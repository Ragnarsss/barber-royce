import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { NEON_LOADER } from "../loader/neonLoader";

// BR-054: el letrero de neón va en línea en index.html para pintarse antes del JavaScript. Estos tests cuidan lo
// que no se puede ver en un test de componente: el SVG, los colores, los tiempos y los destellos.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const html = readFileSync(resolve(root, "index.html"), "utf8");
const tokens = readFileSync(resolve(root, "src/styles/tokens/colors.css"), "utf8");

const loaderCss = html.match(/<style id="neon-loader-css">([\s\S]*?)<\/style>/)?.[1] ?? "";
const loaderMarkup = html.match(/<div id="neon-loader"[\s\S]*?<\/svg>\s*<\/div>/)?.[0] ?? "";
const cssMs = (name: string) => Number(loaderCss.match(new RegExp(`--${name}:\\s*(\\d+)ms`))?.[1]);

/** Cambios de opacidad de un keyframe, en orden: [porcentaje, opacidad]. */
const keyframeSteps = (name: string): [number, number][] => {
  const body = loaderCss.match(new RegExp(`@keyframes ${name}\\s*\\{([\\s\\S]*?)\\}\\s*\\}`))?.[1] ?? "";
  const steps: [number, number][] = [];
  for (const [, stops, opacity] of body.matchAll(/([\d%,\s]+)\{\s*opacity:\s*([\d.]+)/g)) {
    for (const stop of stops.split(",")) steps.push([Number.parseFloat(stop), Number(opacity)]);
  }
  return steps.sort((a, b) => a[0] - b[0]);
};

/** Destellos según WCAG 2.3.1: un par de cambios opuestos de luminancia. Un cambio cuenta si cruza 0,5. */
const flashes = (steps: [number, number][]) => {
  let changes = 0;
  for (let i = 1; i < steps.length; i++) if (steps[i - 1][1] >= 0.5 !== steps[i][1] >= 0.5) changes++;
  return changes / 2;
};

describe("letrero de neón en index.html (BR-054)", () => {
  it("existe antes de #root, oculto para lectores de pantalla", () => {
    expect(loaderMarkup).toContain('aria-hidden="true"');
    expect(html.indexOf('id="neon-loader"')).toBeLessThan(html.indexOf('id="root"'));
  });

  it("no usa scripts en línea: la CSP no los permite (solo estilos en línea)", () => {
    expect(loaderMarkup).not.toMatch(/<script|onload=|onclick=/i);
  });

  it("los tiempos del CSS son los mismos que los de neonLoader.ts", () => {
    expect(cssMs("neon-min")).toBe(NEON_LOADER.MIN_MS);
    expect(cssMs("neon-exit")).toBe(NEON_LOADER.EXIT_MS);
    expect(cssMs("neon-max")).toBe(NEON_LOADER.MAX_MS);
  });

  it("sin JavaScript se retira solo al máximo: nunca tapa el sitio para siempre", () => {
    expect(loaderCss).toMatch(/#neon-loader\s*\{[^}]*animation:\s*neon-failsafe[^;]*var\(--neon-max\)/);
    expect(loaderCss).toMatch(/@keyframes neon-failsafe\s*\{[^}]*visibility:\s*hidden/);
  });

  it("CP-A11Y-005: el encendido no pasa de 3 destellos por segundo", () => {
    for (const name of ["neon-ignite", "neon-ignite-defect"]) {
      const steps = keyframeSteps(name);
      const duration = Number(loaderCss.match(new RegExp(`animation:\\s*${name}\\s+(\\d+)ms`))?.[1]) / 1000;

      expect(steps.length, name).toBeGreaterThan(2);
      expect(flashes(steps) / Math.max(duration, 1), name).toBeLessThanOrEqual(3);
    }
  });

  it("CP-A11Y-003: con reducir movimiento el letrero queda encendido y quieto", () => {
    const reduced = loaderCss.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\}\s*\}/)?.[1] ?? "";

    expect(reduced).toMatch(/\.lit[^{]*\{[^}]*animation:\s*none/);
    expect(reduced).toMatch(/opacity:\s*1/);
  });

  it("todo color del letrero es un valor de los tokens (ADR-002)", () => {
    const colors = new Set(loaderCss.match(/#[0-9a-fA-F]{6}\b/g) ?? []);

    expect(colors.size).toBeGreaterThan(0);
    for (const color of colors) expect(tokens.toLowerCase(), color).toContain(color.toLowerCase());
  });

  it("el SVG es válido para un navegador: viewBox, trazados con datos y sin comentarios", () => {
    const svg = loaderMarkup.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? "";
    const paths = [...svg.matchAll(/<path[^>]*\sd="([^"]*)"/g)].map((m) => m[1]);

    expect(svg).toMatch(/viewBox="0 0 \d+ \d+"/);
    expect(paths.length).toBeGreaterThan(3);
    for (const d of paths) expect(d.trim()).not.toBe("");
    expect(svg).not.toContain("<!--");
  });

  it("los trazados no traen colores escritos: el color sale del CSS", () => {
    const svg = loaderMarkup.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? "";

    expect(svg).not.toMatch(/(fill|stroke)="#/);
  });
});

describe("escena de ladrillo y encendido por piezas (BR-123)", () => {
  const svg = loaderMarkup.match(/<svg[\s\S]*<\/svg>/)?.[0] ?? "";
  const sourceSvg = readFileSync(resolve(root, "src/assets/neon-name.svg"), "utf8");
  const pathData = (markup: string) => [...markup.matchAll(/<path[^>]*\sd="([^"]*)"/g)].map((m) => m[1]).sort();
  /** Retraso del encendido de la pieza n (`.lit-n`), en ms. */
  const pieceDelay = (n: number) => Number(loaderCss.match(new RegExp(`\\.lit-${n}\\s*\\{[^}]*--lit-delay:\\s*(\\d+)ms`))?.[1]);

  it("una sola fuente: los trazados de index.html son los de src/assets/neon-name.svg", () => {
    expect(pathData(svg)).toEqual(pathData(sourceSvg));
  });

  it("CA-41: la pared de ladrillo es CSS en línea, sin peticiones de red antes del JavaScript", () => {
    expect(loaderCss).toMatch(/#neon-loader::before\s*\{[^}]*repeating-linear-gradient/);
    expect(loaderCss).not.toMatch(/url\(/);
  });

  it("CA-41: las piezas se encienden en orden: marco, «Barber», «Royce», tijera y la letra defectuosa", () => {
    const order = ["n-frame", "n-barber", "n-royce", "n-scissors", "n-defect"];
    order.forEach((id, i) => {
      const group = svg.match(new RegExp(`<g class="lit lit-${i + 1}[^"]*">([\\s\\S]*?)</g>`))?.[1] ?? "";
      expect(group, id).toContain(`#${id}`);
    });
    const delays = order.map((_, i) => pieceDelay(i + 1));
    for (let i = 1; i < delays.length; i++) expect(delays[i], `pieza ${i + 1}`).toBeGreaterThan(delays[i - 1]);
  });

  it("CA-41: la luz sobre la pared acompaña al letrero y solo anima la opacidad", () => {
    expect(loaderMarkup).toMatch(/class="wall-glow"/);
    const body = loaderCss.match(/@keyframes neon-wall\s*\{([\s\S]*?)\}\s*\}/)?.[1] ?? "";
    expect(body).toMatch(/opacity/);
    expect(body.replace(/opacity:\s*[\d.]+/g, "")).not.toMatch(/[a-z-]+\s*:/);
  });

  it("CP-A11Y-005: la luz de la pared tampoco pasa de 3 destellos por segundo", () => {
    const steps = keyframeSteps("neon-wall");
    const duration = Number(loaderCss.match(/animation:\s*neon-wall\s+(\d+)ms/)?.[1]) / 1000;

    expect(steps.length).toBeGreaterThan(2);
    expect(flashes(steps) / Math.max(duration, 1)).toBeLessThanOrEqual(3);
  });

  it("CP-A11Y-003: con reducir movimiento la pared queda iluminada y quieta", () => {
    const reduced = loaderCss.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*?)\}\s*\}/)?.[1] ?? "";

    expect(reduced).toMatch(/\.wall-glow/);
  });

  it("sin JavaScript hay un aviso en lugar de la página vacía", () => {
    expect(html).toMatch(/<noscript>[\s\S]*?<\/noscript>/);
  });
});
