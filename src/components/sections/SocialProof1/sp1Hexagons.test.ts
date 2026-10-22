import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SP1_HEXAGONS } from "./sp1Hexagons";

// BR-092: los hexágonos de fondo de «Respaldados por los mejores» se ven como se diseñaron.
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "SocialProof1.module.css"), "utf8");
const source = readFileSync(resolve(here, "SocialProof1.tsx"), "utf8");
const hexagonRules = [...css.matchAll(/\n\.(hexagon\w+)\s*\{([^}]*)\}/g)];

describe("BR-092: hexágonos de SocialProof1", () => {
  it("CA-35: cada hexágono conserva la rotación de su diseño", () => {
    // Antes se rotaban con `transform: rotate(…)` y framer, que escribe su propio transform, la pisaba
    expect(SP1_HEXAGONS.hexagonBackground1.rotate).toBe(12);
    expect(SP1_HEXAGONS.hexagonMiddle3.rotate).toBe(40);
    expect(SP1_HEXAGONS.hexagonForeground2.rotate).toBe(-40);
    expect(SP1_HEXAGONS.hexagonSmall4.rotate).toBe(-50);
    expect(Object.keys(SP1_HEXAGONS)).toHaveLength(14);
  });

  it("CA-35: ninguna regla de hexágono usa `transform`, que framer pisa", () => {
    expect(hexagonRules.length).toBeGreaterThan(0);
    for (const [, name, body] of hexagonRules) {
      expect(body, name).not.toMatch(/(^|[^-])transform:/);
    }
  });

  it("CA-35: sin efectos que el recorte no deja ver ni transiciones que persiguen a framer", () => {
    for (const [, name, body] of hexagonRules) {
      expect(body, name).not.toMatch(/backdrop-filter|box-shadow|border:|clip-path/);
      expect(body, name).not.toMatch(/transition:[^;]*transform/);
    }
  });

  it("CA-35: el borde es un trazo real en los seis lados del hexágono SVG", () => {
    expect(source).toMatch(/<FixedShape\b/);
    expect(css).toMatch(/polygon\s*\{[^}]*stroke:/);
  });
});
