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

  it("RNF-SEG-004: los scripts solo pueden ser propios o de Google Tag Manager; sin unsafe-inline, unsafe-eval ni hashes", () => {
    expect(directive(csp, "script-src")).toBe("script-src 'self' https://www.googletagmanager.com");
  });

  it("RNF-SEG-004: los únicos orígenes de terceros nuevos son los de Google Analytics", () => {
    const googleOrigins = /^https:\/\/(www\.googletagmanager\.com|\*\.googletagmanager\.com|www\.google-analytics\.com|\*\.google-analytics\.com|\*\.analytics\.google\.com)$/;
    const extra = ["script-src", "connect-src", "img-src"]
      .flatMap((name) => (directive(csp, name) ?? "").split(" ").slice(1))
      .filter((source) => source.startsWith("https://") && !googleOrigins.test(source) && source !== "https://images.unsplash.com");

    expect(extra).toEqual([]);
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
