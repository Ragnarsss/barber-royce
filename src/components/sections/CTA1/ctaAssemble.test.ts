import { describe, expect, it } from "vitest";
import { assembleOffset, CTA_ASSEMBLE } from "./ctaAssemble";

// BR-097 (HU-EXP-004 CA-39): los tres hexágonos de CTA1 llegan desfasados y encajan con el scroll de la sección.
describe("ensamble de los hexágonos de CTA1 (BR-097)", () => {
  it("CA-39: al terminar el ensamble cada pieza está donde estaba (desfase 0), sea cual sea de dónde llegue", () => {
    for (const from of [-110, -60, 0, 70, 120]) expect(assembleOffset(from, 1)).toBeCloseTo(0, 10);
  });

  it("CA-39: al empezar, la pieza está en su desfase, y a mitad de camino, a la mitad", () => {
    expect(assembleOffset(70, 0)).toBe(70);
    expect(assembleOffset(-110, 0)).toBe(-110);
    expect(assembleOffset(70, 0.5)).toBe(35);
    expect(assembleOffset(-110, 0.25)).toBeCloseTo(-82.5, 10);
  });

  it("CA-39: el ensamble termina antes de que la sección quede alineada con la ventana (avance 0,5 del recorrido)", () => {
    const [start, end] = CTA_ASSEMBLE.WINDOW;
    expect(start).toBeGreaterThanOrEqual(0);
    expect(start).toBeLessThan(end);
    // Con la sección ocupando la ventana, el recorrido de la sección va por la mitad: ahí ya tiene que estar armada
    expect(end).toBeLessThanOrEqual(0.5);
  });

  it("CA-39: cada hexágono llega desde un lado distinto, para que se vea que encajan y no que se desplazan juntos", () => {
    const pieces = [CTA_ASSEMBLE.background, CTA_ASSEMBLE.text, CTA_ASSEMBLE.foreground];
    const directions = pieces.map((piece) => `${Math.sign(piece.x)}${Math.sign(piece.y)}`);
    expect(new Set(directions).size).toBe(3);
    for (const piece of pieces) {
      expect(Math.abs(piece.x) + Math.abs(piece.y)).toBeGreaterThan(40);
      expect(Math.abs(piece.rotate)).toBeGreaterThan(0);
      expect(Math.abs(piece.rotate)).toBeLessThanOrEqual(25);
    }
  });

  it("CA-39: las barras de luz bajan unos píxeles y no tapan nada al llegar (poco desfase vertical)", () => {
    expect(CTA_ASSEMBLE.bars.y).toBeLessThan(0);
    expect(Math.abs(CTA_ASSEMBLE.bars.y)).toBeLessThanOrEqual(60);
  });
});
