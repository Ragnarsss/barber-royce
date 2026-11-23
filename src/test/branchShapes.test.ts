import { mix } from "framer-motion";
import { describe, expect, it } from "vitest";
import { BRANCHES, type Branch } from "@/config/branches";
import type { FixedShapeGeometry } from "@/components/common/FixedShape/shapeGeometry";
import { CTA_SHAPES_BY_BRANCH } from "@/components/sections/CTA1/ctaShapes";
import { FEATURES_PENTAGON_BY_BRANCH } from "@/components/sections/Features/featuresShapes";
import { REVIEWS_SHAPES_BY_BRANCH } from "@/components/sections/Reviews/reviewsShapes";
import { SP1_HEXAGON_BY_BRANCH } from "@/components/sections/SocialProof1/sp1Hexagons";
import { SP2_HEXAGON_BY_BRANCH } from "@/components/sections/SocialProof2/sp2Shapes";

// BR-104 (ADR-010 punto 6, HU-SUC-002 CA-02 y CA-03, CP-SUC-005): cada figura de fondo tiene una versión por sucursal con
// la misma caja y la misma cantidad de puntos, para que framer pueda transformar una en otra. Con distinta cantidad de
// puntos NO falla: salta al destino sin avisar (comprobado el 2026-11-23), por eso este test es lo único que lo vigila.
type ByBranch = Record<Branch, FixedShapeGeometry>;

const cta = (key: keyof (typeof CTA_SHAPES_BY_BRANCH)["coquimbo"]): ByBranch =>
  Object.fromEntries(BRANCHES.map((branch) => [branch, CTA_SHAPES_BY_BRANCH[branch][key]])) as ByBranch;
const reviews = (key: keyof (typeof REVIEWS_SHAPES_BY_BRANCH)["coquimbo"]): ByBranch =>
  Object.fromEntries(BRANCHES.map((branch) => [branch, REVIEWS_SHAPES_BY_BRANCH[branch][key]])) as ByBranch;

const FIGURES: Array<[string, ByBranch]> = [
  ["SocialProof1 · hexágono", SP1_HEXAGON_BY_BRANCH],
  ["SocialProof2 · hexágono", SP2_HEXAGON_BY_BRANCH],
  ["CTA1 · textHexagonBackground", cta("textHexagonBackground")],
  ["CTA1 · textHexagon", cta("textHexagon")],
  ["CTA1 · textHexagonForeground", cta("textHexagonForeground")],
  ["CTA1 · imageHexagonForeground", cta("imageHexagonForeground")],
  ["Reviews · octágono", reviews("octagon")],
  ["Reviews · hexágono", reviews("hexagon")],
  ["Features · pentágono", FEATURES_PENTAGON_BY_BRANCH],
];

const numbers = (points: string) => points.split(/[ ,]+/).map(Number);
const count = (points: string) => points.trim().split(/\s+/).length;

describe("figuras por sucursal (BR-104)", () => {
  it("cubre las cinco secciones con figuras: SocialProof1, SocialProof2, CTA1, Reviews y Features", () => {
    expect(FIGURES.length).toBe(9);
  });

  it.each(FIGURES)("CA-02, CP-SUC-005: %s tiene una versión para cada sucursal", (_name, shapes) => {
    expect(Object.keys(shapes).sort()).toEqual([...BRANCHES].sort());
  });

  it.each(FIGURES)("CP-SUC-005: %s tiene la misma cantidad de puntos y la misma caja en las dos sucursales", (_name, shapes) => {
    const [a, b] = [shapes.coquimbo, shapes["la-serena"]];

    expect(count(b.points)).toBe(count(a.points));
    expect([b.width, b.height]).toEqual([a.width, a.height]);
  });

  it.each(FIGURES)("CA-02: %s en La Serena es otra forma, no una copia de la de Coquimbo", (_name, shapes) => {
    expect(shapes["la-serena"].points).not.toBe(shapes.coquimbo.points);
  });

  it.each(FIGURES)("CA-02: %s en La Serena cabe dentro de su caja", (_name, shapes) => {
    const { width, height, points } = shapes["la-serena"];
    const values = numbers(points);

    for (let i = 0; i < values.length; i += 2) {
      expect(values[i], `x del punto ${i / 2}`).toBeGreaterThanOrEqual(0);
      expect(values[i], `x del punto ${i / 2}`).toBeLessThanOrEqual(width);
      expect(values[i + 1], `y del punto ${i / 2}`).toBeGreaterThanOrEqual(0);
      expect(values[i + 1], `y del punto ${i / 2}`).toBeLessThanOrEqual(height);
    }
  });

  it.each(FIGURES)("CA-03: %s se transforma punto a punto: a la mitad hay los mismos puntos, entre los dos extremos", (_name, shapes) => {
    const [from, to] = [numbers(shapes.coquimbo.points), numbers(shapes["la-serena"].points)];
    const middle = numbers(mix(shapes.coquimbo.points, shapes["la-serena"].points)(0.5));

    expect(middle).toHaveLength(from.length);
    middle.forEach((value, i) => {
      expect(value).toBeCloseTo((from[i] + to[i]) / 2, 1);
    });
  });

  it("el motivo del test: con distinta cantidad de puntos framer no interpola, salta al destino", () => {
    expect(mix("0,0 10,10", "0,0 10,10 20,20")(0.5)).toBe("0,0 10,10 20,20");
  });
});
