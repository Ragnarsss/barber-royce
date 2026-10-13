import { describe, expect, it } from "vitest";
import { TEXTS, isTextKey, textOf, type TextKey } from "./texts";

const keys = Object.keys(TEXTS) as TextKey[];

describe("registro de textos editables (BR-042, HU-CNT-002)", () => {
  it("textOf usa el texto de la hoja si existe y el del código si no (CA-01, CA-02)", () => {
    expect(textOf({ "hero.titulo": "De la hoja" }, "hero.titulo")).toBe("De la hoja");
    expect(textOf({}, "hero.titulo")).toBe(TEXTS["hero.titulo"].default);
    expect(textOf({ "cta2.titulo": "Otro" }, "hero.titulo")).toBe(TEXTS["hero.titulo"].default);
  });

  it("isTextKey reconoce solo las claves registradas, también frente a nombres heredados de Object", () => {
    expect(isTextKey("hero.titulo")).toBe(true);
    expect(isTextKey("hero.titlo")).toBe(false);
    expect(isTextKey("toString")).toBe(false);
    expect(isTextKey("__proto__")).toBe(false);
  });

  it.each(keys)("%s: su texto por defecto no está vacío y cabe en su máximo", (key) => {
    const { default: text, max } = TEXTS[key];

    expect(text.trim()).not.toBe("");
    expect(text.length).toBeLessThanOrEqual(max);
  });

  it("las claves tienen el formato grupo.nombre que acepta la hoja", () => {
    for (const key of keys) expect(key).toMatch(/^[a-z0-9]+(?:\.[a-z0-9]+)+$/);
  });

  it("ningún texto por defecto lleva HTML: son texto plano", () => {
    for (const key of keys) expect(TEXTS[key].default).not.toMatch(/[<>]/);
  });
});
