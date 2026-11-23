import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// Protege lo que BR-002 y BR-013 dejaron fijado en vercel.json y no se ve al ejecutar
// la app: una CSP floja o un rewrite que esconda un chunk inexistente solo se notan en producción.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const config = JSON.parse(readFileSync(resolve(root, "vercel.json"), "utf8")) as {
  rewrites: { source: string; destination: string }[];
  headers: { source: string; headers: { key: string; value: string }[] }[];
};
const indexHtml = readFileSync(resolve(root, "index.html"), "utf8");

const headerOf = (source: string, key: string) =>
  config.headers.find((entry) => entry.source === source)?.headers.find((header) => header.key === key)?.value;
const directive = (csp: string, name: string) =>
  csp
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name} `));

describe("vercel.json (BR-002, BR-013)", () => {
  const csp = headerOf("/(.*)", "Content-Security-Policy") ?? "";

  it("CP-SEG-001: define las 6 cabeceras de seguridad en todo el sitio", () => {
    for (const key of [
      "Content-Security-Policy",
      "Strict-Transport-Security",
      "X-Content-Type-Options",
      "Referrer-Policy",
      "Permissions-Policy",
      "X-Frame-Options",
    ]) {
      expect(headerOf("/(.*)", key), key).toBeTruthy();
    }
  });

  it("RNF-SEG-004: los scripts solo pueden ser propios, de Google Tag Manager o el script de arranque por su hash; sin unsafe-inline ni unsafe-eval", () => {
    // Enmienda 2026-11-23 (ADR-010, BR-103): antes no admitía ningún hash. Ahora admite exactamente uno, el del script de
    // arranque de la sucursal (`RNF-SEG-005` comprueba que sea el de `index.html`).
    expect(directive(csp, "script-src")).toMatch(/^script-src 'self' https:\/\/www\.googletagmanager\.com 'sha256-[A-Za-z0-9+/]{43}='$/);
    expect(csp).not.toContain("'unsafe-inline' https");
    expect(directive(csp, "script-src")).not.toMatch(/unsafe-(inline|eval|hashes)/);
  });

  it("RNF-SEG-005, CP-SEG-005: el hash de la CSP es el del script de arranque de index.html, byte por byte", () => {
    const script = indexHtml.match(/<script id="branch-init">([^<]*)<\/script>/)?.[1];
    expect(script, "index.html no trae <script id=\"branch-init\">").toBeTruthy();
    // Una sola línea: así el hash no depende de si el archivo se guardó con CRLF o con LF.
    expect(script).not.toMatch(/[\r\n]/);

    const hash = `'sha256-${createHash("sha256").update(script!, "utf8").digest("base64")}'`;

    expect(directive(csp, "script-src")?.split(" ")).toContain(hash);
  });

  it("RNF-SEG-004: los únicos orígenes de terceros nuevos son los de Google Analytics y la hoja de contenido (BR-047)", () => {
    const googleOrigins = /^https:\/\/(www\.googletagmanager\.com|\*\.googletagmanager\.com|www\.google-analytics\.com|\*\.google-analytics\.com|\*\.analytics\.google\.com|docs\.google\.com|\*\.googleusercontent\.com)$/;
    const extra = ["script-src", "connect-src", "img-src"]
      .flatMap((name) => (directive(csp, name) ?? "").split(" ").slice(1))
      .filter((source) => source.startsWith("https://") && !googleOrigins.test(source) && source !== "https://images.unsplash.com");

    expect(extra).toEqual([]);
  });

  it("BR-047: la hoja de Google solo se puede leer con fetch (connect-src), nunca como script ni imagen", () => {
    const sheetOrigins = ["https://docs.google.com", "https://*.googleusercontent.com"];
    const connect = (directive(csp, "connect-src") ?? "").split(" ");

    expect(sheetOrigins.every((origin) => connect.includes(origin))).toBe(true);
    for (const name of ["script-src", "img-src", "frame-src"]) {
      const sources = (directive(csp, name) ?? "").split(" ");
      expect(sheetOrigins.some((origin) => sources.includes(origin))).toBe(false);
    }
  });

  it("ningún HTML de origen trae manejadores inline (onload=, onclick=…) que la CSP bloquearía", () => {
    expect(indexHtml).not.toMatch(/\son[a-z]+\s*=/i);
  });

  it("CP-CONF-001: todo se reescribe a index.html excepto /assets, para que un chunk viejo dé 404", () => {
    const [rewrite] = config.rewrites;
    const matches = (path: string) => new RegExp(`^${rewrite.source}$`).test(path);

    expect(rewrite.destination).toBe("/index.html");
    expect(["/", "/servicios", "/no-existe"].every(matches)).toBe(true);
    expect(matches("/assets/js/index-abc123.js")).toBe(false);
  });

  it("los assets con hash se cachean como inmutables por un año", () => {
    expect(headerOf("/assets/(.*)", "Cache-Control")).toBe("public, max-age=31536000, immutable");
  });
});
