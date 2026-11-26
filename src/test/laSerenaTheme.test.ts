import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BRANCH_THEME_COLOR } from "@/config/branches";

// BR-104 (HU-SUC-002 CA-01, CP-A11Y-004, RNF-A11Y-004): con La Serena activa, cada par de texto y fondo del tema cumple el
// contraste mínimo. Se lee de los tokens reales (`colors.css`), así que cambiar un color sin revisar el par falla aquí.
const tokensCss = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../styles/tokens/colors.css"), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

/** Las declaraciones `--nombre: valor;` de un bloque de tokens (`:root` o `[data-branch="la-serena"]`). */
function block(selector: string): Map<string, string> {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const body = tokensCss.match(new RegExp(`${escaped}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
  return new Map([...body.matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)].map(([, name, value]) => [name, value.trim().replace(/\s+/g, " ")]));
}

const ROOT = block(":root");
const LA_SERENA = block('[data-branch="la-serena"]');

/** Resuelve un token siguiendo sus `var(--otro)`; `scope` pisa a `:root`, como hace el navegador. */
function resolveToken(name: string, scope: Map<string, string>, depth = 0): string | undefined {
  const raw = scope.get(name) ?? ROOT.get(name);
  const reference = raw?.match(/^var\(\s*(--[\w-]+)\s*\)$/)?.[1];
  if (raw === undefined || depth > 8) return undefined;
  return reference ? resolveToken(reference, scope, depth + 1) : raw;
}

function luminance(hex: string): number {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255).map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const ratio = (a: string, b: string) => {
  const [x, y] = [luminance(a), luminance(b)];
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
};
const colorOf = (name: string, scope: Map<string, string>) => {
  const value = resolveToken(name, scope);
  expect(value, `${name} no está definido o no es un color #rrggbb`).toMatch(/^#[0-9a-fA-F]{6}$/);
  return value!;
};

describe("el calculador de contraste (BR-104)", () => {
  it("da los valores conocidos de WCAG", () => {
    expect(ratio("#000000", "#ffffff")).toBeCloseTo(21, 1);
    expect(ratio("#ffffff", "#ffffff")).toBeCloseTo(1, 5);
    expect(ratio("#1a1a1a", "#ffffff")).toBeCloseTo(17.4, 0);
  });

  it("lee el bloque de Coquimbo siguiendo los alias (texto blanco sobre el fondo oscuro de la marca)", () => {
    expect(ratio(colorOf("--color-brand-white", ROOT), colorOf("--color-brand-background", ROOT))).toBeGreaterThanOrEqual(4.5);
  });
});

describe('tema de La Serena: [data-branch="la-serena"] (BR-104)', () => {
  it("el bloque existe y redefine los alias de marca", () => {
    expect(LA_SERENA.size).toBeGreaterThan(0);
    for (const alias of ["--color-brand-background", "--color-brand-section-bg", "--color-brand-primary", "--color-brand-primary-hover", "--color-brand-white", "--color-on-primary", "--color-detail", "--color-hover-text", "--color-ink"]) {
      expect(LA_SERENA.has(alias), alias).toBe(true);
    }
  });

  // [texto, fondo, mínimo, qué es]. 4,5 para texto; 3 para texto grande y componentes de interfaz (WCAG 2.1 AA).
  const PAIRS: Array<[string, string, number, string]> = [
    ["--color-brand-white", "--color-brand-background", 4.5, "texto principal sobre el fondo"],
    ["--color-brand-white", "--color-brand-section-bg", 4.5, "texto principal sobre las secciones alternas"],
    ["--color-on-primary", "--color-brand-primary", 4.5, "texto de un botón"],
    ["--color-on-primary", "--color-brand-primary-hover", 4.5, "texto de un botón en hover"],
    ["--color-cta-hover-text", "--color-cta-hover-bg", 4.5, "texto ámbar del botón principal de CTA1 en hover (BR-112)"],
    ["--color-btn-hover-text", "--color-btn-hover-bg", 4.5, "texto ámbar del botón principal de CTA2 y del hero en hover (BR-112)"],
    ["--color-bone", "--color-btn-hover-bg", 4.5, "texto del botón secundario del hero en hover (BR-112)"],
    ["--color-cta-ghost-hover-text", "--color-cta-ghost-hover-bg", 4.5, "texto del botón fantasma de CTA1 en hover (BR-112)"],
    ["--color-bone", "--color-hover-fill", 4.5, "texto hueso sobre el verde de los botones del hero en hover (BR-112)"],
    ["--color-on-primary", "--color-hover-fill", 4.5, "texto sobre el relleno de un elemento en hover (BR-112)"],
    ["--color-hover-fill", "--color-brand-background", 3, "relleno o contorno en hover sobre el fondo (BR-112)"],
    ["--color-brand-primary-hover", "--color-brand-background", 3, "hover o contorno como gráfico sobre el fondo (BR-112)"],
    ["--color-brand-primary-hover", "--color-brand-section-bg", 3, "hover o contorno como gráfico sobre las secciones alternas (BR-112)"],
    ["--color-brand-primary", "--color-brand-background", 4.5, "enlace o acento como texto sobre el fondo"],
    ["--color-brand-primary", "--color-brand-section-bg", 4.5, "enlace o acento como texto sobre las secciones alternas"],
    ["--color-text-secondary", "--color-brand-background", 4.5, "texto secundario sobre el fondo"],
    ["--color-text-secondary", "--color-brand-section-bg", 4.5, "texto secundario sobre las secciones alternas"],
    ["--color-leaf", "--color-brand-background", 4.5, "verde hoja como texto"],
    ["--color-detail", "--color-brand-background", 4.5, "verde de los detalles y hovers sobre el fondo"],
    ["--color-detail", "--color-brand-section-bg", 4.5, "verde de los detalles y hovers sobre las secciones alternas"],
    ["--color-ink", "--color-brand-section-bg", 4.5, "tinta sobre las secciones alternas (subtítulo de CTA2)"],
    ["--color-ink", "--color-brand-background", 4.5, "tinta sobre el fondo"],
    ["--color-hover-text", "--color-brand-background", 4.5, "texto de un enlace con el cursor encima, sobre el fondo"],
    ["--color-hover-text", "--color-brand-section-bg", 4.5, "texto de un enlace con el cursor encima, sobre las secciones alternas"],
    ["--color-accent-on-inverse", "--color-brand-white", 4.5, "acento sobre el botón oscuro (relleno --color-brand-white)"],
    ["--color-neon", "--color-espresso", 4.5, "neón sobre una banda oscura"],
    ["--color-amber", "--color-espresso", 4.5, "ámbar sobre una banda oscura"],
    ["--color-wood", "--color-brand-background", 3, "madera, solo decorativa: no texto (3:1 como gráfico)"],
  ];

  it.each(PAIRS)("CA-01: %s sobre %s llega a %s:1 (%s)", (text, background, minimum) => {
    expect(ratio(colorOf(text, LA_SERENA), colorOf(background, LA_SERENA))).toBeGreaterThanOrEqual(minimum);
  });

  it("BR-112: el botón principal en hover es verde hoja oscuro con texto ámbar en La Serena, y en Coquimbo conserva lo que tenía", () => {
    expect(colorOf("--color-btn-hover-bg", LA_SERENA)).toBe(colorOf("--color-leaf-deep", LA_SERENA));
    expect(colorOf("--color-btn-hover-text", LA_SERENA)).toBe(colorOf("--color-amber", LA_SERENA));
    expect(colorOf("--color-btn-hover-bg", ROOT)).toBe(colorOf("--color-accent-300", ROOT));
    expect(colorOf("--color-btn-hover-text", ROOT)).toBe(colorOf("--color-on-primary", ROOT));
  });

  it("BR-112: la barra de progreso va de verde hoja a ámbar en La Serena y de rojo a rojo vivo en Coquimbo", () => {
    expect(colorOf("--color-progress-from", LA_SERENA)).toBe(colorOf("--color-leaf", LA_SERENA));
    expect(colorOf("--color-progress-to", LA_SERENA)).toBe(colorOf("--color-amber", LA_SERENA));
    expect(colorOf("--color-progress-from", ROOT)).toBe(colorOf("--color-accent-500", ROOT));
    expect(colorOf("--color-progress-to", ROOT)).toBe(colorOf("--color-accent-300", ROOT));
  });

  it("BR-112: los botones de CTA1 en hover son verde hoja oscuro en La Serena, y en Coquimbo conservan lo que tenían", () => {
    expect(colorOf("--color-cta-hover-bg", LA_SERENA)).toBe(colorOf("--color-leaf-deep", LA_SERENA));
    expect(colorOf("--color-cta-ghost-hover-bg", LA_SERENA)).toBe(colorOf("--color-leaf-deep", LA_SERENA));
    expect(colorOf("--color-cta-hover-bg", ROOT)).toBe(colorOf("--color-brand-white", ROOT));
    expect(colorOf("--color-cta-hover-text", ROOT)).toBe(colorOf("--color-brand-primary", ROOT));
    expect(colorOf("--color-cta-ghost-hover-text", ROOT)).toBe(colorOf("--color-primary-700", ROOT));
  });

  it("BR-112: el hover y los contornos de La Serena son el verde hoja, no el café; Coquimbo conserva su rojo", () => {
    expect(colorOf("--color-brand-primary-hover", LA_SERENA)).toBe(colorOf("--color-leaf", LA_SERENA));
    expect(colorOf("--color-brand-primary-hover", LA_SERENA)).not.toBe(colorOf("--color-earth-deep", LA_SERENA));
    expect(colorOf("--color-brand-primary-hover", ROOT)).toBe(colorOf("--color-accent-300", ROOT));
    expect(colorOf("--color-hover-fill", LA_SERENA)).toBe(colorOf("--color-leaf", LA_SERENA));
    expect(colorOf("--color-hover-fill", ROOT)).toBe(colorOf("--color-brand-primary", ROOT));
  });

  it("el ámbar sobre el fondo claro NO sirve como texto (por eso solo va sobre bandas oscuras o como adorno)", () => {
    expect(ratio(colorOf("--color-amber", LA_SERENA), colorOf("--color-brand-background", LA_SERENA))).toBeLessThan(3);
  });

  it("el fondo de La Serena es claro y el de Coquimbo oscuro: el tema sí invierte la página", () => {
    expect(luminance(colorOf("--color-brand-background", LA_SERENA))).toBeGreaterThan(0.7);
    expect(luminance(colorOf("--color-brand-background", ROOT))).toBeLessThan(0.05);
  });
});

// La barra del navegador y el loader no pueden leer tokens CSS (una etiqueta meta, y un <style> que se pinta antes que
// cualquier hoja de estilos), así que repiten sus colores; aquí se comprueba que sigan siendo los del tema.
const indexHtml = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../../index.html"), "utf8");
const loaderRule = (selector: string) => indexHtml.match(new RegExp(String.raw`\[data-branch="la-serena"\] #neon-loader${selector}\{([^}]*)\}`))?.[1] ?? "";

describe("color de la barra del navegador y loader por sucursal (BR-104)", () => {
  it("BRANCH_THEME_COLOR es el fondo de cada tema", () => {
    expect(BRANCH_THEME_COLOR.coquimbo).toBe(colorOf("--color-brand-background", ROOT).toLowerCase());
    expect(BRANCH_THEME_COLOR["la-serena"]).toBe(colorOf("--color-brand-background", LA_SERENA).toLowerCase());
  });

  it("index.html trae el theme-color de Coquimbo, que BranchProvider ajusta a la sucursal activa", () => {
    expect(indexHtml).toContain(`<meta name="theme-color" content="${BRANCH_THEME_COLOR.coquimbo}" />`);
  });

  it("el loader de La Serena es oscuro, con neón frío: sus colores son los de espresso, bark y neon", () => {
    expect(loaderRule("")).toContain(`background:${colorOf("--color-espresso", LA_SERENA).toLowerCase()}`);
    expect(loaderRule(" .off")).toContain(`color:${colorOf("--color-bark", LA_SERENA).toLowerCase()}`);
    expect(loaderRule(" .halo")).toContain(`color:${colorOf("--color-neon", LA_SERENA).toLowerCase()}`);
    expect(loaderRule(" .core")).toContain(colorOf("--color-neon", LA_SERENA).toLowerCase());
  });
});
