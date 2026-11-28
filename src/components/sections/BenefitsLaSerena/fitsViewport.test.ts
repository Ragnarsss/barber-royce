import { describe, expect, it } from "vitest";
import { fitsViewport } from "./fitsViewport";

// BR-117 (HU-SUC-002 CA-11): la franja de fotos empieza a moverse cuando la sección encaja en el espacio visible.
describe("fitsViewport (BR-117)", () => {
  it("encaja cuando se ve entera (sección más baja que la ventana)", () => {
    expect(fitsViewport(640, 640, 820)).toBe(true);
  });

  it("no encaja cuando solo asoma una parte", () => {
    expect(fitsViewport(300, 640, 820)).toBe(false);
    expect(fitsViewport(600, 640, 820)).toBe(false); // 40 px fuera: más que la tolerancia
  });

  it("perdona unos pocos píxeles (redondeos y un scroll casi justo)", () => {
    expect(fitsViewport(630, 640, 820)).toBe(true);
    expect(fitsViewport(616, 640, 820)).toBe(true); // justo la tolerancia
  });

  it("si la sección es más alta que la ventana (celular), encaja cuando la llena entera", () => {
    expect(fitsViewport(764, 1100, 764)).toBe(true);
    expect(fitsViewport(400, 1100, 764)).toBe(false);
  });

  it("una sección sin alto o una ventana sin alto nunca encajan", () => {
    expect(fitsViewport(0, 0, 800)).toBe(false);
    expect(fitsViewport(0, 500, 0)).toBe(false);
  });
});
