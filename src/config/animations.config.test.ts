import { describe, expect, it } from "vitest";
import { edgeDraw } from "./animations.config";

// BR-096 (HU-EXP-004 CA-38): el borde de una figura se dibuja de 0 a 1.
describe("edgeDraw (BR-096)", () => {
  const states = (delay?: number) => {
    const variants = edgeDraw(delay);
    return { hidden: variants.hidden as Record<string, unknown>, visible: variants.visible as Record<string, unknown> };
  };

  it("CA-38: el trazo va de 0 a 1", () => {
    const { hidden, visible } = states();
    expect(hidden.pathLength).toBe(0);
    expect(visible.pathLength).toBe(1);
  });

  it("CA-38: nunca anima la opacidad: ocultaría el relleno de la figura, no solo su borde", () => {
    const { hidden, visible } = states(0.4);
    expect(hidden).not.toHaveProperty("opacity");
    expect(visible).not.toHaveProperty("opacity");
  });

  it("CA-38: el desfase llega a la transición y distintos desfases dan transiciones distintas", () => {
    const delayOf = (delay?: number) => (states(delay).visible.transition as { delay: number }).delay;
    expect(delayOf()).toBe(0);
    expect(delayOf(0.3)).toBe(0.3);
    expect(delayOf(0.6)).toBe(0.6);
  });
});
