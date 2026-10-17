import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { CARD_DEPTH, cardDepthRange } from "./cards";

// BR-056: tarjetas de beneficios en vidrio oscuro con esquinas cortadas.
const here = dirname(fileURLToPath(import.meta.url));
const heroCss = readFileSync(resolve(here, "Hero.module.css"), "utf8");
const tokens = readFileSync(resolve(here, "../../../styles/tokens/colors.css"), "utf8");
// BR-069: los valores de la tarjeta (vidrio, borde) son tokens compartidos; el rojo claro del fondo sigue en el Hero.
const cardTokens = readFileSync(resolve(here, "../../../styles/tokens/cards.css"), "utf8");

describe("cardDepthRange: profundidad al hacer scroll (BR-056, HU-EXP-004 CA-09)", () => {
  it("la primera tarjeta sube lo mínimo", () => {
    expect(cardDepthRange(0)).toEqual([0, -CARD_DEPTH.BASE_PX]);
  });

  it("cada tarjeta siguiente sube más: se separan en capas", () => {
    expect(cardDepthRange(2)).toEqual([0, -(CARD_DEPTH.BASE_PX + 2 * CARD_DEPTH.STEP_PX)]);
  });
});

// --- Contraste del texto sobre el vidrio (CP-A11Y-004) -------------------------------------------------------------
type Rgb = [number, number, number];
const hex = (value: string): Rgb => [1, 3, 5].map((i) => Number.parseInt(value.slice(i, i + 2), 16)) as Rgb;
const token = (name: string): Rgb => {
  const value = tokens.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1];
  if (!value) throw new Error(`token ${name} sin valor hex`);
  return hex(value);
};
const mix = (a: Rgb, b: Rgb, weightA: number): Rgb => a.map((v, i) => v * weightA + b[i] * (1 - weightA)) as Rgb;
const luminance = (rgb: Rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a: Rgb, b: Rgb) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
const percentOf = (variable: string) =>
  Number((cardTokens.match(new RegExp(`--${variable}:[^;]*?(\\d+)%`)) ?? heroCss.match(new RegExp(`--${variable}:[^;]*?(\\d+)%`)))?.[1]) / 100;

describe("contraste de las tarjetas (BR-056, CP-A11Y-004)", () => {
  // El vidrio (::before) se compone sobre el fondo de la propia tarjeta, que es su borde: blanco translúcido en reposo
  // y rojo al pasar el cursor. Ese borde, a su vez, está sobre lo que haya detrás; el peor caso es el rojo claro.
  const glassOver = (edge: Rgb, edgePercent: number) => {
    const white = token("color-brand-white");
    const red = token("color-accent-500"); // --color-brand-primary
    const lightestBackdrop = mix(red, white, percentOf("hero-red-light"));
    const card = mix(edge, lightestBackdrop, edgePercent);
    return mix(token("color-primary-500"), card, percentOf("card-glass")); // --color-brand-background
  };

  it("CA-09: en reposo, el texto blanco cumple 4,5:1 aun con el fondo más claro detrás", () => {
    expect(Number.isNaN(percentOf("card-glass"))).toBe(false);
    expect(contrast(token("color-brand-white"), glassOver(token("color-brand-white"), percentOf("card-edge")))).toBeGreaterThanOrEqual(4.5);
  });

  it("CA-09: con el cursor encima (borde rojo), el texto blanco también cumple 4,5:1", () => {
    expect(contrast(token("color-brand-white"), glassOver(token("color-accent-500"), percentOf("card-edge-hot")))).toBeGreaterThanOrEqual(4.5);
  });
});
