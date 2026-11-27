import { describe, expect, it } from "vitest";
import { LA_SERENA, ROOT, colorOf, ratio, resolveToken } from "./themeTokens";

// BR-113 (variante D «Taller verde»; HU-SUC-002 CA-01 y CA-09; RF-SUC-005 y RF-SUC-008; RNF-A11Y-004). Se leen los tokens
// reales: el verde hoja es la marca de La Serena, el café queda de apoyo, los titulares van en Fraunces y Coquimbo no cambia.
describe('BR-113: La Serena «Taller verde» ([data-branch="la-serena"])', () => {
  describe("color de marca (HU-SUC-002 CA-01)", () => {
    it("la marca es el verde hoja y su hover es el verde hoja oscuro", () => {
      expect(colorOf("--color-brand-primary", LA_SERENA)).toBe(colorOf("--color-leaf", LA_SERENA));
      expect(colorOf("--color-brand-primary-hover", LA_SERENA)).toBe(colorOf("--color-leaf-deep", LA_SERENA));
    });

    it("el café tierra queda como alias de apoyo, y deja de ser la marca", () => {
      expect(colorOf("--color-brand-support", LA_SERENA)).toBe(colorOf("--color-earth", LA_SERENA));
      expect(colorOf("--color-brand-primary", LA_SERENA)).not.toBe(colorOf("--color-earth", LA_SERENA));
    });

    it("la escala de acento que usan los módulos sigue a la marca (si no, quedan botones café junto a botones verdes)", () => {
      expect(colorOf("--color-accent-500", LA_SERENA)).toBe(colorOf("--color-brand-primary", LA_SERENA));
      expect(colorOf("--color-accent-400", LA_SERENA)).toBe(colorOf("--color-brand-primary", LA_SERENA));
      expect(colorOf("--color-accent-300", LA_SERENA)).toBe(colorOf("--color-brand-primary-hover", LA_SERENA));
    });

    // [texto, fondo, mínimo, qué es]. Los mínimos de la variante D son mayores que los 4,5 del tema, para que no bajen sin avisar.
    const PAIRS: Array<[string, string, number, string]> = [
      ["--color-on-primary", "--color-brand-primary", 6.5, "texto blanco del botón en reposo"],
      ["--color-btn-hover-text", "--color-btn-hover-bg", 4.5, "texto ámbar del botón en hover"],
      ["--color-brand-primary", "--color-brand-background", 5.8, "verde de marca como texto sobre el hueso"],
      ["--color-brand-primary", "--color-brand-section-bg", 5.1, "verde de marca como texto sobre la arena"],
      ["--color-brand-support", "--color-brand-background", 4.5, "café de apoyo (etiquetas) sobre el hueso"],
      ["--color-brand-support", "--color-brand-section-bg", 4.5, "café de apoyo (etiquetas) sobre la arena"],
    ];

    it.each(PAIRS)("CA-01: %s sobre %s llega a %s:1 (%s)", (text, background, minimum) => {
      expect(ratio(colorOf(text, LA_SERENA), colorOf(background, LA_SERENA))).toBeGreaterThanOrEqual(minimum);
    });

    it("el contorno del foco del teclado (café de apoyo) se ve sobre el fondo y la arena: 3:1", () => {
      expect(ratio(colorOf("--color-brand-support", LA_SERENA), colorOf("--color-brand-background", LA_SERENA))).toBeGreaterThanOrEqual(3);
      expect(ratio(colorOf("--color-brand-support", LA_SERENA), colorOf("--color-brand-section-bg", LA_SERENA))).toBeGreaterThanOrEqual(3);
    });
  });

  describe("tipografía de display (HU-SUC-002 CA-09, RF-SUC-008, CP-SUC-008)", () => {
    it("el display de La Serena es Fraunces y el de Coquimbo sigue siendo Anton", () => {
      expect(LA_SERENA.get("--font-family-display")).toMatch(/^"Fraunces Variable"/);
      expect(ROOT.get("--font-family-display")).toMatch(/^"Anton"/);
    });

    it("el display de La Serena trae una serif genérica de respaldo para no mover el layout si la fuente tarda", () => {
      expect(LA_SERENA.get("--font-family-display")).toMatch(/\bserif\b/);
    });

    it("el cuerpo sigue en Montserrat en las dos sucursales", () => {
      expect(LA_SERENA.get("--font-family-primary") ?? ROOT.get("--font-family-primary")).toMatch(/^"Montserrat"/);
    });
  });

  describe("esquinas y textura (alcance 3 y 4)", () => {
    it("botones y tarjetas de La Serena tienen esquinas de 4 px; Coquimbo conserva 8 y 12 px", () => {
      expect(resolveToken("--radius-md", LA_SERENA)).toBe("0.25rem");
      expect(resolveToken("--radius-lg", LA_SERENA)).toBe("0.25rem");
      expect(ROOT.get("--radius-md")).toBe("0.5rem");
      expect(ROOT.get("--radius-lg")).toBe("0.75rem");
    });

    it("la veta de madera es un gradiente CSS (sin imágenes) y solo existe en La Serena", () => {
      expect(LA_SERENA.get("--texture-wood")).toMatch(/repeating-linear-gradient/);
      expect(LA_SERENA.get("--texture-wood")).not.toMatch(/url\(/);
      expect(ROOT.has("--texture-wood")).toBe(false);
    });
  });

  describe("Coquimbo no cambia (HU-SUC-002 CA-09: «con Coquimbo, nada cambia»)", () => {
    it("la marca sigue siendo el rojo y el hover el rojo vivo", () => {
      expect(colorOf("--color-brand-primary", ROOT).toLowerCase()).toBe("#d52323");
      expect(colorOf("--color-brand-primary-hover", ROOT).toLowerCase()).toBe("#fe0000");
    });
  });
});
