import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-065: la parrilla de SocialProof2 sigue las proporciones del Figma «Prueba social 2».
const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "SocialProof2.module.css"), "utf8");
const rule = (selector: string, scope = css) => scope.match(new RegExp(`\\n\\s*\\.${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
const rows = (selector: string) => rule(selector).match(/grid-row:\s*(\d+)\s*\/\s*(\d+)/)?.slice(1).map(Number) ?? [];
const desktop = css.split("@media (max-width: 1024px)")[0];

describe("SocialProof2: bento del Figma (BR-065, HU-EXP-004 CA-17)", () => {
  it("CA-17: tres columnas de distinto ancho (no tres iguales)", () => {
    const columns = rule("bentoGrid", desktop).match(/grid-template-columns:\s*([^;]+);/)?.[1].trim().split(/\s+/) ?? [];

    expect(columns).toHaveLength(3);
    expect(new Set(columns).size).toBe(3);
  });

  it("CA-17: la columna 1 es grande arriba y chica abajo; la 2, al revés; la 3, una foto alta", () => {
    const [aStart, aEnd] = rows("bentoA");
    const [cStart, cEnd] = rows("bentoC");
    const [bStart, bEnd] = rows("bentoB");
    const [dStart, dEnd] = rows("bentoD");

    expect(aEnd - aStart).toBeGreaterThan(cEnd - cStart);
    expect(bEnd - bStart).toBeLessThan(dEnd - dStart);
    expect(aEnd).toBe(cStart);
    expect(bEnd).toBe(dStart);
    expect(rows("bentoTall")).toEqual([1, 13]);
  });

  it("el contenedor ocupa el ancho: margin auto dentro de un flex en columna lo encogía a su contenido", () => {
    expect(rule("container")).toMatch(/width:\s*100%/);
  });

  it("cada recuadro recorta su foto (object-fit: cover) para recibir cualquier proporción de Instagram", () => {
    expect(css).toMatch(/\.bentoItem img\s*\{[^}]*object-fit:\s*cover/);
  });

  it("el zoom del hover usa scale: un transform del CSS lo pisaría la entrada de framer", () => {
    expect(css).toMatch(/\.bentoItem:hover\s*\{[^}]*scale:/);
    expect(css).not.toMatch(/\.bentoItem:hover\s*\{[^}]*transform:/);
  });

  it("en móvil, dos columnas con la foto alta junto a las demás", () => {
    const mobile = css.split("@media (max-width: 768px)")[1] ?? "";

    expect(rule("bentoGrid", mobile)).toMatch(/grid-template-columns:\s*1fr 1fr/);
    expect(rule("bentoTall", mobile)).toMatch(/grid-row:\s*2 \/ 5/);
  });

  it("ADR-002: sin colores escritos a mano ni will-change fijo", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
    expect(css).not.toMatch(/will-change\s*:/);
  });
});
