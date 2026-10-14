import { describe, expect, it } from "vitest";
import { spotlightOffset, shouldTrackPointer } from "./spotlight";

// BR-055: el haz de luz del hero sigue al cursor. Su centro va donde está el puntero, medido desde la esquina de la
// sección (no de la ventana), y solo se activa con un puntero fino y sin «reducir movimiento».
describe("spotlightOffset (BR-055, HU-EXP-004 CA-08)", () => {
  const rect = { left: 100, top: 50 };

  it("centra el haz en el puntero, relativo a la sección", () => {
    expect(spotlightOffset({ clientX: 400, clientY: 350 }, rect, 600)).toEqual({ x: 0, y: 0 });
  });

  it("con otro punto y otro tamaño, el centro sigue al puntero", () => {
    expect(spotlightOffset({ clientX: 1100, clientY: 650 }, rect, 400)).toEqual({ x: 800, y: 400 });
  });
});

describe("shouldTrackPointer (BR-055)", () => {
  it("con ratón y sin reducir movimiento, sigue al cursor", () => {
    expect(shouldTrackPointer({ finePointer: true, reducedMotion: false })).toBe(true);
  });

  it("en pantallas táctiles no hay cursor que seguir", () => {
    expect(shouldTrackPointer({ finePointer: false, reducedMotion: false })).toBe(false);
  });

  it("CA-08 / CP-A11Y-003: con reducir movimiento el fondo queda quieto", () => {
    expect(shouldTrackPointer({ finePointer: true, reducedMotion: true })).toBe(false);
  });
});
