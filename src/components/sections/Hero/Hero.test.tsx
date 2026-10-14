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

  it("CA-08: en móvil queda una forma geométrica, no un fondo plano", () => {
    const mobile = heroCss.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
    const hidden = mobile.match(/([^{}]*)\{\s*display:\s*none;?\s*\}/)?.[1] ?? "";

    expect(hidden).not.toMatch(/\.leftTriangle\s*(,|$)/m);
    expect(mobile).toMatch(/\.leftTriangle\s*\{[^}]*width:/);
  });

  it("ADR-002: los triángulos, el grano y el haz no traen colores escritos a mano", () => {
    const layers = heroCss.match(/\/\* ===== CAPAS DE TRIÁNGULOS PARALLAX ===== \*\/([\s\S]*?)@media/)?.[1] ?? "";

    expect(layers.length).toBeGreaterThan(0);
    expect(layers).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});
