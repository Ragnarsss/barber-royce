import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const read = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const indexHtml = read("../../index.html");
const heroSource = read("../components/sections/Hero/Hero.tsx");

// BR-011: el preload de index.html y el <picture> del Hero tienen que describir
// el mismo recurso; si divergen, el navegador descarga dos imágenes en el LCP.
describe("preload de la imagen del LCP (BR-011, CP-PERF-001)", () => {
  const attr = (html: string, name: string) => html.match(new RegExp(`${name}="([^"]+)"`))?.[1];
  const preload = indexHtml.match(/<link\s[^>]*rel="preload"[^>]*as="image"[^>]*>/s)?.[0] ?? "";

  it("existe un preload de imagen con prioridad alta", () => {
    expect(preload).not.toBe("");
    expect(preload).toContain('fetchpriority="high"');
  });

  it("precarga el mismo `sizes` que usa el <picture> del Hero", () => {
    const heroSizes = heroSource.match(/sizes="([^"]+)"/)?.[1];

    expect(attr(preload, "imagesizes")).toBe(heroSizes);
  });

  it("precarga los mismos archivos WebP que lista el <picture> del Hero", () => {
    const preloaded = [...(attr(preload, "imagesrcset") ?? "").matchAll(/([\w.-]+\.webp) (\d+w)/g)].map(
      (m) => `${m[1]} ${m[2]}`,
    );
    const inHero = [...heroSource.matchAll(/import heroImage(\d+)w from ".*\/([\w.-]+\.webp)"/g)].map(
      (m) => `${m[2]} ${m[1]}w`,
    );

    expect(preloaded.length).toBeGreaterThan(0);
    expect(preloaded.sort()).toEqual(inHero.sort());
  });

  it("no precarga ningún PNG ni usa un PNG original como imagen del Hero", () => {
    expect(indexHtml).not.toMatch(/rel="preload"[^>]*\.png/);
    expect(heroSource).not.toMatch(/assets\/[\w-]+\.png/);
  });

  it("ninguna imagen se ofrece en AVIF: pesaba más que su WebP y nadie la elegía", () => {
    expect(heroSource).not.toContain("image/avif");
  });
});
