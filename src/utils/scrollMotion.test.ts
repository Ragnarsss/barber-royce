import { describe, expect, it } from "vitest";
import { nextDirection } from "./scrollMotion";

describe("nextDirection (BR-015)", () => {
  it("scroll hacia abajo → 1", () => {
    expect(nextDirection(-1, 100, 140)).toBe(1);
  });

  it("scroll hacia arriba → -1", () => {
    expect(nextDirection(1, 140, 100)).toBe(-1);
  });

  it("sin movimiento conserva la dirección anterior, sea cual sea", () => {
    expect(nextDirection(1, 100, 100)).toBe(1);
    expect(nextDirection(-1, 100, 100)).toBe(-1);
  });
});
