import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { SP1_HEXAGONS } from "./sp1Hexagons";
import { CUT } from "./sceneTimeline";

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

  it("BR-096 (CA-38): el borde de los hexágonos se dibuja con el recorrido del láser", () => {
    // Empieza con el primer corte, el de la foto, y termina cuando acaba el de la tarjeta
    expect(CUT.EDGE[0]).toBe(CUT.PHOTO[0]);
    expect(CUT.EDGE[1]).toBeGreaterThanOrEqual(CUT.CARD[1]);
    // Sin la sección fija (ventanas bajas) sigue el avance de la sección, más tarde que con el recorrido fijo
    for (const range of [CUT.EDGE, CUT.EDGE_FREE]) {
      expect(range[0]).toBeGreaterThanOrEqual(0);
      expect(range[1]).toBeLessThanOrEqual(1);
      expect(range[0]).toBeLessThan(range[1]);
    }
    expect(source).toMatch(/pathLength:\s*hexagonEdge/);
  });

  it("BR-096: ningún grosor depende de non-scaling-stroke; el trazo se mide en unidades del viewBox por capa", () => {
    expect(css).not.toMatch(/vector-effect/);
    for (const layer of ["hexBackground", "hexMiddle", "hexForeground", "hexSmall"]) {
      expect(css, layer).toMatch(new RegExp(`\\.${layer} polygon\\s*\\{[^}]*stroke-width:\\s*[\\d.]+;`));
    }
  });
});
