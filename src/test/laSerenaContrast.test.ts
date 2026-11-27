import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { LA_SERENA, ROOT, colorOf, ratio } from "./themeTokens";

// BR-116 (HU-SUC-002 CA-01, RNF-A11Y-004): con La Serena activa, el texto de CTA1 y de la tarjeta de «Respaldados por los
// mejores» se lee. Los pares salen de los tokens reales; las reglas, de los CSS Modules reales.
const sections = resolve(dirname(fileURLToPath(import.meta.url)), "../components/sections");
const cta1 = readFileSync(resolve(sections, "CTA1/CTA1.module.css"), "utf8");
const social1 = readFileSync(resolve(sections, "SocialProof1/SocialProof1.module.css"), "utf8");

/** El cuerpo de la primera regla `selector { … }` que aparece a partir de `from`. */
function rule(css: string, selector: string, from = 0): string {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return css.slice(from).match(new RegExp(`(?:^|\\n)\\s*${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
}

const hex = (value: string): [number, number, number] => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16)) as [number, number, number];
const toHex = (rgb: number[]) => `#${rgb.map((v) => Math.round(v).toString(16).padStart(2, "0")).join("")}`;
/** `top` con la opacidad `alpha` sobre `bottom` (lo que hace `color-mix(in srgb, top N%, transparent)`). */
const over = (top: string, bottom: string, alpha: number) => toHex(hex(top).map((v, i) => v * alpha + hex(bottom)[i] * (1 - alpha)));

const SCOPES = [
  ["La Serena", LA_SERENA],
  ["Coquimbo", ROOT],
] as const;

describe("BR-116: CTA1 en escritorio (el texto va sobre el hexágono de marca)", () => {
  const desktop = cta1.indexOf("@media (min-width: 769px)");

  it("hay un bloque de escritorio", () => {
    expect(desktop).toBeGreaterThan(0);
  });

  it.each(SCOPES)("CA-01: el texto sobre el hexágono de marca cumple 4,5:1 en %s", (_name, scope) => {
    expect(ratio(colorOf("--color-on-primary", scope), colorOf("--color-brand-primary", scope))).toBeGreaterThanOrEqual(4.5);
  });

  it.each(SCOPES)("CA-01: también sobre el hexágono translúcido de adelante (acento al 50 %% sobre la marca) en %s", (_name, scope) => {
    const mixed = over(colorOf("--color-accent-600", scope), colorOf("--color-brand-primary", scope), 0.5);
    expect(ratio(colorOf("--color-on-primary", scope), mixed)).toBeGreaterThanOrEqual(4.5);
  });

  it("CA-01: el título, el subtítulo y el botón secundario usan el color del texto sobre la marca, no el «blanco» del tema", () => {
    expect(rule(cta1, ".title", desktop)).toMatch(/color:\s*var\(--color-on-primary\)/);
    expect(rule(cta1, ".subtitle", desktop)).toMatch(/color-mix\(in srgb,\s*var\(--color-on-primary\)/);
    expect(rule(cta1, ".ctaButtonGhost", desktop)).toMatch(/color:\s*var\(--color-on-primary\)/);
    expect(rule(cta1, ".ctaButtonGhost", desktop)).toMatch(/border-color:\s*var\(--color-on-primary\)/);
  });

  it("el foco del botón principal también se ve sobre el hexágono", () => {
    expect(rule(cta1, ".magnet:has(:focus-visible)", desktop)).toMatch(/var\(--color-on-primary\)/);
  });
});

describe("BR-116: tarjeta de testimonio de «Respaldados por los mejores» (fondo: --color-brand-white)", () => {
  it.each(SCOPES)("CA-01: el testimonio y el nombre (--color-brand-background) cumplen 4,5:1 sobre la tarjeta en %s", (_name, scope) => {
    expect(ratio(colorOf("--color-brand-background", scope), colorOf("--color-brand-white", scope))).toBeGreaterThanOrEqual(4.5);
  });

  it("CA-01: el cargo y «Cliente hace N años» derivan del color del texto de la tarjeta, no de grises pensados para una tarjeta blanca", () => {
    for (const selector of [".author span", ".clientBadge"]) {
      const color = rule(social1, selector).match(/color:\s*([^;]+);/)?.[1] ?? "";
      expect(color, selector).toMatch(/var\(--color-brand-background\)/);
      expect(color, selector).not.toMatch(/text-secondary|neutral-/);
    }
  });

  it.each(SCOPES)("CA-01: el cargo (texto al 75 %%) y «Cliente hace N años» (al 70 %%) cumplen 4,5:1 sobre la tarjeta en %s", (_name, scope) => {
    const card = colorOf("--color-brand-white", scope);
    const ink = colorOf("--color-brand-background", scope);
    expect(ratio(over(ink, card, 0.75), card)).toBeGreaterThanOrEqual(4.5);
    expect(ratio(over(ink, card, 0.7), card)).toBeGreaterThanOrEqual(4.5);
  });

  it("el CSS declara exactamente esas opacidades (si cambian, cambian los pares de arriba)", () => {
    expect(rule(social1, ".author span")).toMatch(/color-mix\(in srgb,\s*var\(--color-brand-background\)\s*75%/);
    expect(rule(social1, ".clientBadge")).toMatch(/color-mix\(in srgb,\s*var\(--color-brand-background\)\s*70%/);
  });
});
