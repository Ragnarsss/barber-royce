import { describe, expect, it } from "vitest";
import { lightBarIgnite } from "@/config/animations.config";
import { MAGNET, magneticOffset } from "./magnetic";

// BR-058: el botón de reservar sigue levemente al cursor y las barras de luz hexagonales se encienden una vez.
describe("magneticOffset: el botón sigue al cursor (BR-058, HU-EXP-004 CA-10)", () => {
  const rect = { left: 100, top: 200, width: 200, height: 60 };

  it("con el cursor en el centro, el botón no se mueve", () => {
    expect(magneticOffset({ clientX: 200, clientY: 230 }, rect)).toEqual({ x: 0, y: 0 });
  });

  it("con el cursor hacia un borde, se desplaza una fracción hacia él", () => {
    expect(magneticOffset({ clientX: 220, clientY: 240 }, rect)).toEqual({ x: 20 * MAGNET.STRENGTH, y: 10 * MAGNET.STRENGTH });
  });

  it("nunca se aleja más que el tope, aunque el cursor esté lejos", () => {
    const { x, y } = magneticOffset({ clientX: 2000, clientY: -900 }, rect);

    expect(x).toBe(MAGNET.MAX_PX);
    expect(y).toBe(-MAGNET.MAX_PX);
  });
});

describe("lightBarIgnite: encendido de las barras de luz (BR-058, CP-A11Y-005)", () => {
  const visible = lightBarIgnite.visible as { opacity: number[]; transition: { duration: number } };

  it("empieza apagada y termina encendida", () => {
    expect(visible.opacity[0]).toBeLessThan(0.5);
    expect(visible.opacity.at(-1)).toBe(1);
  });

  it("no pasa de 3 destellos por segundo", () => {
    let changes = 0;
    for (let i = 1; i < visible.opacity.length; i++) if (visible.opacity[i - 1] >= 0.5 !== visible.opacity[i] >= 0.5) changes++;

    expect(changes / 2 / Math.max(visible.transition.duration, 1)).toBeLessThanOrEqual(3);
  });
});
