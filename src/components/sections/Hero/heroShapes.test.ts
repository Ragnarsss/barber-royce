import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { HERO_SHAPES } from "./heroShapes";

// BR-091: los triángulos del Hero tienen geometría fija, tomada de cómo se ven a 1920×1080 (decisión del usuario, 2026-10-21).
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "Hero.module.css"), "utf8");
const source = readFileSync(resolve(here, "Hero.tsx"), "utf8");

const TRIANGLES = [
  "leftTriangle",
  "rightTriangle",
  "leftTriangleBackground",
  "rightTriangleBackground",
  "leftTriangleForeground",
  "rightTriangleForeground",
] as const;

describe("BR-091: triángulos del Hero con geometría fija", () => {
  it("CA-34: cada triángulo conserva la caja que tenía a 1920×1080", () => {
    // 50vw × 100vh y 50vw × 110vh; los de la capa rápida, con su tope en px (650 y 700) a ese ancho
    expect([HERO_SHAPES.leftTriangle.width, HERO_SHAPES.leftTriangle.height]).toEqual([960, 1080]);
    expect([HERO_SHAPES.leftTriangleBackground.width, HERO_SHAPES.leftTriangleBackground.height]).toEqual([960, 1188]);
    expect([HERO_SHAPES.leftTriangleForeground.width, HERO_SHAPES.leftTriangleForeground.height]).toEqual([650, 756]);
    expect([HERO_SHAPES.rightTriangleForeground.width, HERO_SHAPES.rightTriangleForeground.height]).toEqual([700, 702]);
  });

  it("CA-34: los puntos son los del polígono de diseño en coordenadas de esa caja", () => {
    expect(HERO_SHAPES.leftTriangle.points).toBe("0,0 960,0 0,1080");
    expect(HERO_SHAPES.rightTriangleBackground.points).toBe("912,59.4 960,1188 48,1128.6");
  });

  it("criterio 5: ningún triángulo se recorta con porcentajes sobre una caja en vw × vh", () => {
    for (const name of TRIANGLES) {
      const rule = css.match(new RegExp(`\\n\\.${name}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
      expect(rule, name).not.toMatch(/clip-path/);
      expect(rule, name).not.toMatch(/height:\s*[\d.]+vh/);
    }
  });

  it("criterio 3: el filo de luz de la diagonal es un trazo real que no se escala", () => {
    expect(source).toMatch(/vectorEffect="non-scaling-stroke"/);
    expect(css).not.toMatch(/--hero-edge-light\)\s*50%/);
  });
});
