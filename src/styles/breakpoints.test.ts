import { readdirSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BREAKPOINTS, MEDIA } from "@/config/breakpoints";

// BR-024 (RNF-MANT-004, ADR-009): CSS mobile-first con un solo conjunto de cortes.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const WIDTHS: number[] = Object.values(BREAKPOINTS);
/** Alto mínimo de las escenas fijas: el único corte de alto permitido. */
const HEIGHTS = [720];

/**
 * Archivos que todavía no migran a mobile-first. La lista solo se achica: cada ticket de grupo (`BR-080` a `BR-083`)
 * saca los suyos, y un archivo que ya cumple no puede quedarse en ella.
 */
const PENDING = new Set([
  // BR-081: secciones de la home
  // BR-082: páginas internas
  // BR-083: componentes comunes
  "components/common/CardCarousel/CardCarousel.module.css",
  "components/common/CardCarousel/CardCarousel.tsx",
  "components/common/ErrorBoundary/CatastrophicError.module.css",
  "components/common/Honeycomb/Honeycomb.module.css",
  "components/common/HoneycombPage/HoneycombPage.module.css",
  "components/common/ModalDialog/ModalDialog.module.css",
  "components/team/BarberProfileDialog.module.css",
]);

/** Por qué una hoja de estilos incumple el patrón: un `max-width` o `max-height`, o un corte fuera del conjunto. */
function cssViolations(css: string): string[] {
  const code = css.replace(/\/\*[\s\S]*?\*\//g, "");
  const found: string[] = [];
  for (const [, prelude] of code.matchAll(/@media([^{]*)\{/g)) {
    for (const [feature, kind, axis, value] of prelude.matchAll(/\((min|max)-(width|height)\s*:\s*([\d.]+)px\)/g)) {
      const allowed = axis === "width" ? WIDTHS : HEIGHTS;
      if (kind === "max" || !allowed.includes(Number(value))) found.push(feature);
    }
    if (/\(\s*(width|height)\s*[<>]/.test(prelude)) found.push(prelude.trim());
  }
  return found;
}

/**
 * Media queries de ancho escritas como texto en TypeScript, o el ancho de la ventana comparado a mano: deben salir de
 * `MEDIA` (`src/config/breakpoints.ts`). Las listas `sizes` de las imágenes (una condición seguida del ancho de la foto,
 * como `(max-width: 768px) 100vw`) quedan fuera: eligen qué archivo descargar, no aplican estilos, y su forma habitual
 * es con `max-width`.
 */
function scriptViolations(source: string): string[] {
  const query = /\((?:min|max)-width:\s*\d+px\)(?!\s*[\d.]+(?:vw|px|rem|em)\b)|innerWidth\s*[<>]=?\s*\d+/g;
  return [...source.matchAll(query)].map(([found]) => found);
}

const files = readdirSync(src, { recursive: true, encoding: "utf8" })
  .map((path) => path.replaceAll("\\", "/"))
  .filter((path) => /\.(css|tsx?)$/.test(path) && !/\.test\.tsx?$|^test\/|^config\/breakpoints\.ts$/.test(path));

const violations = new Map(
  files
    .map((path) => {
      const text = readFileSync(resolve(src, path), "utf8");
      return [path, path.endsWith(".css") ? cssViolations(text) : scriptViolations(text)] as const;
    })
    .filter(([, found]) => found.length > 0),
);

describe("Breakpoints mobile-first (BR-024, RNF-MANT-004)", () => {
  it("ningún archivo fuera de la lista de pendientes usa max-width o un corte fuera del conjunto", () => {
    const offenders = [...violations].filter(([path]) => !PENDING.has(path));

    expect(offenders).toEqual([]);
  });

  it("la lista de pendientes solo se achica: un archivo que ya cumple sale de ella", () => {
    const clean = [...PENDING].filter((path) => !violations.has(path));

    expect(clean).toEqual([]);
  });

  it("detecta max-width, cortes fuera del conjunto y la sintaxis de rango; acepta los del conjunto", () => {
    expect(cssViolations("@media (max-width: 768px) { a { b: c } }")).toEqual(["(max-width: 768px)"]);
    expect(cssViolations("@media (min-width: 768px) { a { b: c } }")).toEqual(["(min-width: 768px)"]);
    expect(cssViolations("@media (width > 768px) { a { b: c } }")).toHaveLength(1);
    expect(cssViolations("@media (min-width: 769px) and (min-height: 720px) { a { b: c } }")).toEqual([]);
    expect(cssViolations("@media (prefers-reduced-motion: reduce) { a { b: c } }")).toEqual([]);
    expect(cssViolations("/* @media (max-width: 768px) */ a { b: c }")).toEqual([]);
  });

  it("detecta media queries de ancho escritas como texto en TypeScript", () => {
    expect(scriptViolations('useMediaQuery("(min-width: 769px)")')).toEqual(["(min-width: 769px)"]);
    expect(scriptViolations("if (window.innerWidth > 768) close();")).toEqual(["innerWidth > 768"]);
    expect(scriptViolations("useMediaQuery(MEDIA.desktop)")).toEqual([]);
    expect(scriptViolations('<source sizes="(max-width: 768px) 100vw, 700px" />')).toEqual([]);
    expect(scriptViolations('const SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px";')).toEqual([]);
  });

  it("las precargas de index.html tampoco usan max-width: la de móvil es el complemento (`not all and …`) de la de escritorio", () => {
    const indexHtml = readFileSync(resolve(src, "../index.html"), "utf8");
    const medias = [...indexHtml.matchAll(/\bmedia="([^"]*)"/g)].map(([, media]) => media);

    expect(medias.length).toBeGreaterThan(0);
    expect(medias.filter((media) => /max-(width|height)/.test(media))).toEqual([]);
  });

  it("MEDIA se arma con el conjunto de cortes", () => {
    expect(Object.values(MEDIA)).toEqual(WIDTHS.map((width) => `(min-width: ${width}px)`));
  });

  it("los archivos recorridos incluyen los estilos y el código de src (el recorrido no quedó vacío)", () => {
    expect(files.some((path) => path.endsWith(".module.css"))).toBe(true);
    expect(files).toContain("hooks/useMediaQuery.ts");
  });
});
