import { describe, expect, it } from "vitest";
import { calmRange } from "./reducedMotion";

describe("calmRange (BR-017, CP-A11Y-003)", () => {
  it("sin reducir movimiento devuelve una copia del rango", () => {
    const range = ["0%", "15%"] as const;
    const result = calmRange(range, false);

    expect(result).toEqual(["0%", "15%"]);
    expect(result).not.toBe(range);
  });

  it("reduciendo movimiento aplana un rango de texto al valor inicial", () => {
    expect(calmRange(["0%", "45%"], true)).toEqual(["0%", "0%"]);
  });

  it("reduciendo movimiento aplana un rango numérico (escala, rotación)", () => {
    expect(calmRange([1, 1.12], true)).toEqual([1, 1]);
    expect(calmRange([0, -2, 3], true)).toEqual([0, 0, 0]);
  });
});
