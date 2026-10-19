import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { MEDIA } from "@/config/breakpoints";

const read = (relative: string) => readFileSync(fileURLToPath(new URL(relative, import.meta.url)), "utf8");
const indexHtml = read("../../index.html");
const heroSource = read("../components/sections/Hero/Hero.tsx");

// BR-011: el preload de index.html y el <picture> del Hero tienen que describir
// el mismo recurso; si divergen, el navegador descarga dos imágenes en el LCP.
// BR-061: el Hero tiene dos fotos (móvil y escritorio) y, por tanto, dos preloads, cada uno con su `media`.
describe("preload de la imagen del LCP (BR-011, CP-PERF-001)", () => {
  const attr = (html: string, name: string) => html.match(new RegExp(`${name}="([^"]+)"`))?.[1];
  const preloads = [...indexHtml.matchAll(/<link\s[^>]*rel="preload"[^>]*as="image"[^>]*>/gs)].map((m) => m[0]);
  // Mobile-first (BR-081, ADR-009): la foto de escritorio lleva `media` (desde 769 px) y la de móvil, que es la base, no;
  // el preload de móvil es el complemento del de escritorio.
  const mobilePreload = preloads.find((p) => attr(p, "media")?.startsWith("not all")) ?? "";
  const desktopPreload = preloads.find((p) => attr(p, "media") && !attr(p, "media")?.startsWith("not all")) ?? "";
  // Un <source> del <picture> por cada foto
  const heroSources = [...heroSource.matchAll(/<source\s[^>]*?\/>/gs)].map((m) => m[0]);
  const desktopSource = heroSources.find((s) => s.includes("media=")) ?? "";
  const mobileSource = heroSources.find((s) => !s.includes("media=")) ?? "";

  /** Los archivos de un srcset como «nombre.webp 780w». */
  const filesOf = (srcset: string | undefined) =>
    [...(srcset ?? "").matchAll(/([\w.-]+\.webp) (\d+w)/g)].map((m) => `${m[1]} ${m[2]}`);
  /** Los imports del Hero con su ancho: `heroImage842w` o `heroMobile780w`. */
  const importsOf = (prefix: string) =>
    [...heroSource.matchAll(new RegExp(`import ${prefix}(\\d+)w from ".*\\/([\\w.-]+\\.webp)"`, "g"))].map(
      (m) => `${m[2]} ${m[1]}w`,
    );

  it("existe un preload de imagen con prioridad alta para móvil y otro para escritorio", () => {
    expect(mobilePreload).not.toBe("");
    expect(desktopPreload).not.toBe("");
    expect(mobilePreload).toContain('fetchpriority="high"');
    expect(desktopPreload).toContain('fetchpriority="high"');
  });

  it("los dos `media` son excluyentes: solo se baja una de las fotos", () => {
    expect(attr(desktopPreload, "media")).toBe(MEDIA.desktop);
    expect(attr(mobilePreload, "media")).toBe(`not all and ${MEDIA.desktop}`);
    expect(desktopSource).toContain("media={MEDIA.desktop}");
    // El <picture> toma la primera fuente que coincide: la de escritorio va antes que la de móvil
    expect(heroSources.indexOf(desktopSource)).toBeLessThan(heroSources.indexOf(mobileSource));
  });

  it("precarga el mismo `sizes` que usa el <picture> del Hero", () => {
    expect(attr(mobilePreload, "imagesizes")).toBe(attr(mobileSource, "sizes"));
    expect(attr(desktopPreload, "imagesizes")).toBe(attr(desktopSource, "sizes"));
  });

  it("precarga los mismos archivos WebP que lista el <picture> del Hero", () => {
    const mobile = filesOf(attr(mobilePreload, "imagesrcset"));
    const desktop = filesOf(attr(desktopPreload, "imagesrcset"));

    expect(mobile.length).toBeGreaterThan(0);
    expect(desktop.length).toBeGreaterThan(0);
    expect(mobile.sort()).toEqual(importsOf("heroMobile").sort());
    expect(desktop.sort()).toEqual(importsOf("heroImage").sort());
  });

  it("no precarga ningún PNG ni usa un PNG original como imagen del Hero", () => {
    expect(indexHtml).not.toMatch(/rel="preload"[^>]*\.png/);
    expect(heroSource).not.toMatch(/assets\/[\w-]+\.png/);
  });

  it("ninguna imagen se ofrece en AVIF: pesaba más que su WebP y nadie la elegía", () => {
    expect(heroSource).not.toContain("image/avif");
  });
});
