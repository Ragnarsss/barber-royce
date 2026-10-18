import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { LenisContext } from "@/contexts/lenisContextValue";
import { SITE } from "@/config/constants";
import { TEXTS } from "@/content/texts";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-050: la marca sale de `SITE` y `hero.lema` es solo el lema. El contenido «de la hoja» cambia en cada prueba.
const state = vi.hoisted(() => ({ texts: {} as Record<string, string>, reducedMotion: false }));
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return {
    default: {
      services: [],
      products: [],
      team: [],
      faq: [],
      business: snapshot.business,
      locations: [],
      get texts() {
        return state.texts;
      },
    },
  };
});
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

import { Hero } from "./Hero";

const heroCss = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "Hero.module.css"), "utf8");
const cardTokensCss = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "../../../styles/tokens/cards.css"), "utf8");

const renderHero = () => {
  renderWithProviders(
    <LenisContext value={null}>
      <Hero />
    </LenisContext>,
  );
  return document.querySelector("h1") as HTMLHeadingElement;
};

/** Lo que lee un lector de pantalla: el texto sin los nodos `aria-hidden`, con los espacios normalizados. */
const accessibleText = (el: HTMLElement) => {
  const clone = el.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[aria-hidden='true']").forEach((node) => node.remove());
  return (clone.textContent ?? "").replace(/\s+/g, " ").trim();
};

describe("Hero: tipografía de marca (BR-050, HU-EXP-004)", () => {
  beforeAll(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  beforeEach(() => {
    state.texts = {};
    state.reducedMotion = false;
  });

  it("CA-01: el título contiene la marca (de SITE) antes del lema, en ese orden", () => {
    const h1 = renderHero();

    expect(accessibleText(h1)).toBe(`${SITE.brand.prefix} ${SITE.brand.name} ${TEXTS["hero.lema"].default}`);
  });

  it("CA-01: la marca se dibuja letra por letra, cada letra marcada para que no la lea el lector de pantalla", () => {
    const h1 = renderHero();

    const letters = [...h1.querySelectorAll("[data-letter]")];
    expect(letters.map((l) => l.textContent).join("")).toBe(SITE.brand.name);
    for (const letter of letters) expect(letter.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("CA-04: el lema de la hoja cambia solo el lema; la marca no depende de la hoja", () => {
    state.texts = { "hero.lema": "Tu lema nuevo" };

    const h1 = renderHero();

    expect(accessibleText(h1)).toBe(`${SITE.brand.prefix} ${SITE.brand.name} Tu lema nuevo`);
  });

  it("CA-04: el valor por defecto del lema no repite la marca", () => {
    const lema = TEXTS["hero.lema"].default.toLowerCase();

    expect(lema).not.toContain(SITE.brand.name.toLowerCase());
    expect(lema).not.toContain(SITE.brand.prefix.toLowerCase());
  });

  it("CA-04: un salto de línea escrito en la hoja se ve como salto en el lema (white-space: pre-line)", () => {
    const rule = heroCss.match(/\n\.tagline\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(rule).toMatch(/white-space:\s*pre-line/);
  });

  it("CA-04: el lema se muestra como está en la hoja, sin forzar mayúsculas en cada palabra", () => {
    const rule = heroCss.match(/\n\.(?:title|tagline)\s*\{([^}]*)\}/g)?.join("") ?? "";

    expect(rule).not.toMatch(/text-transform:\s*capitalize/);
  });

  it("CA-03: con reducir movimiento las letras salen sin estado inicial de animación y sin destello", () => {
    state.reducedMotion = true;

    const h1 = renderHero();

    for (const letter of h1.querySelectorAll<HTMLElement>("[data-letter]")) {
      expect(letter.getAttribute("style") ?? "").not.toMatch(/opacity|transform/);
    }
    expect(h1.querySelector("[data-shine]")).toBeNull();
  });

  it("CA-03: el destello se apaga también por CSS cuando el sistema pide reducir el movimiento", () => {
    expect(heroCss).toMatch(/@media \(prefers-reduced-motion: reduce\)[^{]*\{[^@]*\.shine[^{]*\{[^}]*animation:\s*none/);
  });

  it("RNF-DATOS-001: el nombre de la marca no está escrito como literal en el componente ni en su CSS", () => {
    const source = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "Hero.tsx"), "utf8");

    expect(source).not.toMatch(/Royce|Barbería/);
    expect(heroCss).not.toMatch(/Royce|Barbería/);
  });
});

describe("Hero: fondos con profundidad (BR-055, HU-EXP-004 CA-08)", () => {
  const withPointer = (fine: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: fine && query === "(pointer: fine)", media: query, addEventListener() {}, removeEventListener() {} }));

  beforeAll(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  beforeEach(() => {
    state.texts = {};
    state.reducedMotion = false;
  });

  it("CA-08: con ratón, el haz de luz que sigue al cursor está montado y es decorativo", () => {
    withPointer(true);
    renderHero();

    const spot = document.querySelector("[data-spotlight]");
    expect(spot).not.toBeNull();
    expect(spot?.getAttribute("aria-hidden")).toBe("true");
  });

  it("CA-08: en pantallas táctiles no hay haz", () => {
    withPointer(false);
    renderHero();

    expect(document.querySelector("[data-spotlight]")).toBeNull();
  });

  it("CP-A11Y-003: con reducir movimiento no hay haz aunque haya ratón", () => {
    withPointer(true);
    state.reducedMotion = true;
    renderHero();

    expect(document.querySelector("[data-spotlight]")).toBeNull();
  });

  // BR-061 (2026-10-17, decisión del usuario con el Figma «Resumen Mobile»): en móvil la foto a pantalla completa
  // reemplaza al triángulo de BR-055 como fondo. Sigue sin ser un color plano.
  it("CA-08 / CA-13: en móvil el fondo es la foto a pantalla completa, no un fondo plano", () => {
    const mobile = heroCss.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    const hidden = mobile.match(/([^{}]*)\{\s*display:\s*none;?\s*\}/)?.[1] ?? "";

    expect(hidden).toMatch(/\.leftTriangle\s*(,|$)/m);
    expect(mobile).toMatch(/\.heroImageSEO\s*\{[^}]*inset:\s*0/);
    expect(mobile).toMatch(/\.heroImageSEO\s*\{[^}]*width:\s*100%/);
    expect(mobile).toMatch(/\.heroImageSEO img\s*\{[^}]*object-fit:\s*cover/);
    // Posición horizontal explícita, ajustada a mano por el usuario (2026-10-17, quedó en 50 %): el rostro del barbero se ve entero.
    expect(mobile).toMatch(/\.heroImageSEO img\s*\{[^}]*object-position:\s*\d{1,3}% top/);
  });

  it("CA-13: en móvil la foto va sin parallax (el inline de framer se pisa) y hay una línea blanca bajo el título", () => {
    const mobile = heroCss.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

    expect(mobile).toMatch(/\.heroImageSEO\s*\{[^}]*transform:\s*none\s*!important/);
    // El velo del Figma (60 % negro) va por CSS y con un token: la foto viene sin velo y se puede cambiar sin tocarlo.
    expect(mobile).toMatch(/\.heroImageSEO::after\s*\{[^}]*color-mix\(in srgb, var\(--color-primary-900\) 60%, transparent\)/);
    expect(mobile).toMatch(/\.title::after\s*\{[^}]*background:\s*var\(--color-brand-white\)/);
  });

  it("CA-13: el Hero ofrece una foto distinta para móvil en el mismo <picture>", () => {
    renderHero();

    const source = document.querySelector("picture source[media='(max-width: 768px)']");
    expect(source).not.toBeNull();
    expect(source?.getAttribute("srcset")).toMatch(/hero_mobile_\d+w\.webp 780w/);
  });

  it("ADR-002: los triángulos, el grano y el haz no traen colores escritos a mano", () => {
    const layers = heroCss.match(/\/\* ===== CAPAS DE TRIÁNGULOS PARALLAX ===== \*\/([\s\S]*?)@media/)?.[1] ?? "";

    expect(layers.length).toBeGreaterThan(0);
    expect(layers).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});

describe("Hero: tarjetas de beneficios (BR-056, HU-EXP-004 CA-09)", () => {
  const withScreen = (wide: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: wide && query === "(min-width: 769px)", media: query, addEventListener() {}, removeEventListener() {} }));

  beforeAll(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  beforeEach(() => {
    state.texts = {};
    state.reducedMotion = false;
  });

  it("CA-09: en escritorio las tres tarjetas tienen profundidad ligada al scroll", () => {
    withScreen(true);
    renderHero();

    const cards = [...document.querySelectorAll("[data-benefit]")];
    expect(cards).toHaveLength(3);
    for (const card of cards) expect(card.getAttribute("data-depth")).toBe("on");
  });

  it("en móvil no hay profundidad: las tarjetas quedan bajo el pliegue y se montarían sobre el texto", () => {
    withScreen(false);
    renderHero();

    for (const card of document.querySelectorAll("[data-benefit]")) expect(card.getAttribute("data-depth")).toBe("off");
  });

  it("CP-A11Y-003: con reducir movimiento no hay profundidad ni luz que barre", () => {
    withScreen(true);
    state.reducedMotion = true;
    renderHero();

    for (const card of document.querySelectorAll("[data-benefit]")) expect(card.getAttribute("data-depth")).toBe("off");
    expect(heroCss).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.benefit::after\s*\{\s*display:\s*none/);
  });

  it("la tarjeta tiene las esquinas cortadas y la luz que barre solo existe con ratón", () => {
    // Desde BR-069 el recorte es un token compartido: el Hero lo usa y el token define las esquinas cortadas
    expect(heroCss).toMatch(/\n\.benefit\s*\{[^}]*clip-path:\s*var\(--card-clip\)/);
    expect(cardTokensCss).toMatch(/--card-clip:\s*polygon\(/);
    expect(heroCss).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[^@]*\.benefit:hover::after/);
  });

  it("ADR-002: las tarjetas no traen colores escritos a mano ni prometen un clic que no existe", () => {
    const cards = heroCss.match(/\n\.benefit\s*\{[\s\S]*?\n\.heroImage\s*\{/)?.[0] ?? "";

    expect(cards.length).toBeGreaterThan(0);
    expect(cards).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
    expect(cards).not.toMatch(/cursor:\s*pointer/);
  });
});
