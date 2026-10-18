import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config/constants";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";
import { HEAVY_SCROLL } from "@/utils/heavyScroll";

// BR-062: corte láser cinematográfico de SocialProof1 y su deuda saldada.
const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

import { SocialProof1 } from "./SocialProof1";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "SocialProof1.module.css"), "utf8");
const source = readFileSync(resolve(here, "SocialProof1.tsx"), "utf8");

const renderSection = () =>
  renderWithProviders(
    <LenisContext value={null}>
      <SocialProof1 />
    </LenisContext>,
  );

describe("SocialProof1: corte láser (BR-062, HU-EXP-004 CA-14)", () => {
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
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query === "(min-width: 769px)", media: query, addEventListener() {}, removeEventListener() {} }));
    // jsdom no trae la API de animaciones web; framer-motion la usa para las transformaciones ligadas al scroll.
    if (!Element.prototype.animate) {
      Element.prototype.animate = vi.fn(() => ({
        cancel() {},
        finish() {},
        play() {},
        pause() {},
        commitStyles() {},
        finished: Promise.resolve(),
        currentTime: 0,
        playbackRate: 1,
        onfinish: null,
      })) as unknown as Element["animate"];
    }
  });

  beforeEach(() => {
    state.reducedMotion = false;
  });

  it("CA-14: la foto y la tarjeta tienen su panel de corte", () => {
    renderSection();

    expect(document.querySelector('[data-cut="photo"]')).not.toBeNull();
    expect(document.querySelector('[data-cut="card"]')).not.toBeNull();
  });

  it("CA-27: ya no hay pistas ni haces láser: el lens flare los reemplaza", () => {
    renderSection();

    expect(document.querySelector("[data-laser-track]")).toBeNull();
    expect(css).not.toMatch(/\.laserTrack|\.bolt\b/);
    expect(source).not.toMatch(/LaserBolt|BOLT|laserTrack/);
  });

  it("CP-A11Y-003: con reducir movimiento, todo revelado: sin paneles de corte, sin flare ni destello", () => {
    state.reducedMotion = true;
    renderSection();

    expect(document.querySelector("[data-cut]")).toBeNull();
    expect(document.querySelector("[data-lens-flare]")).toBeNull();
    expect(document.querySelector("[data-title-underline]")?.getAttribute("style") ?? "").not.toMatch(/scale/);
  });

  it("RNF-DATOS-001: la marca sale de la config en la cita y en el alt, sin literal en el componente", () => {
    renderSection();

    expect(document.body.textContent).toContain(`confío en ${SITE.name}`);
    expect(document.querySelector("img")?.getAttribute("alt")).toContain(SITE.name);
    expect(source).not.toMatch(/Royce|Barbería/);
  });

  it("ADR-002: sin colores escritos a mano ni will-change fijo", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
    expect(css).not.toMatch(/will-change\s*:/);
  });

  it("CP-A11Y-004: el distintivo de la tarjeta ya no usa un gris claro sin contraste", () => {
    const rule = css.match(/\n\.clientBadge\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(rule).toMatch(/color:\s*var\(--color-neutral-600\)/);
  });
});

// BR-075 (HU-EXP-004 CA-26): sección fija mientras ocurre el láser, y revelado con el scroll al terminar.
describe("SocialProof1: escena fija y revelado (BR-075, HU-EXP-004 CA-26)", () => {
  const desktop = css.match(/@media \(min-width: 769px\)\s*\{\s*\.pinned\s*\{([\s\S]*?)\n\}/)?.[0] ?? "";

  beforeEach(() => {
    state.reducedMotion = false;
  });

  it("CA-26: en escritorio el contenedor alto fija la sección (la clase pinned)", () => {
    renderSection();

    expect(document.getElementById("social-proof-1")!.parentElement?.className).toMatch(/pinned/);
  });

  it("CA-26: el subtítulo y el texto del testimonio tienen su copia desenfocada decorativa (aria-hidden); el título, no", () => {
    renderSection();

    const copies = document.querySelectorAll("#social-proof-1 [data-focus-blur]");
    expect(copies).toHaveLength(2);
    expect(document.querySelector("#social-proof-1 h2 [data-focus-blur]")).toBeNull();
    copies.forEach((copy) => expect(copy.getAttribute("aria-hidden")).toBe("true"));
  });

  it("CA-26: la foto lleva una copia desenfocada decorativa, sin texto alternativo, que se ve primero", () => {
    renderSection();

    const copy = document.querySelector("[data-photo-blur]")!;
    expect(copy.getAttribute("aria-hidden")).toBe("true");
    expect(copy.querySelector("img")?.getAttribute("alt")).toBe("");
    expect(copy.getAttribute("style")).toMatch(/opacity:\s*1/);
  });

  it("CP-A11Y-002: los lectores de pantalla encuentran el título y la foto una sola vez", () => {
    renderSection();

    expect(document.querySelectorAll("#social-proof-1 h2")).toHaveLength(1);
    expect(document.querySelectorAll("#social-proof-1 img[alt]:not([alt=''])")).toHaveLength(1);
  });

  it("CP-A11Y-003: con reducir movimiento no se fija ni hay copias desenfocadas: todo nítido", () => {
    state.reducedMotion = true;
    renderSection();

    expect(document.getElementById("social-proof-1")!.parentElement?.className).not.toMatch(/pinned/);
    expect(document.querySelector("#social-proof-1 [data-focus-blur]")).toBeNull();
    expect(document.querySelector("[data-photo-blur]")).toBeNull();
  });

  it("BR-077: el recorrido fijo es largo: a la velocidad máxima del scroll pesado toma unos 3 segundos o más", () => {
    const vh = Number(desktop.match(/\.pinned\s*\{[^}]*height:\s*(\d+)vh/)?.[1]);
    const pixels = (vh - 100) * 9; // referencia: una pantalla de 900 px de alto

    expect(pixels / HEAVY_SCROLL.MAX_SPEED).toBeGreaterThanOrEqual(2.8);
  });

  it("el CSS: contenedor alto y sección pegada arriba a pantalla completa, solo desde 769 px", () => {
    expect(desktop).toMatch(/\.pinned\s*\{[^}]*height:\s*\d+vh/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*position:\s*sticky/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*top:\s*0/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*height:\s*100vh/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*padding:\s*5rem 0 2rem/);
  });

  it("la copia de la foto es de desenfoque fijo y fuerte: lo que se anima es su opacidad", () => {
    expect(css).toMatch(/\.pictureBlur\s*\{[^}]*filter:\s*blur\((?:1[8-9]|[2-9]\d)px\)/);
    expect(css).not.toMatch(/transition:[^;]*filter/);
  });

  it("la sección usa el hook compartido y no mide el scroll de cada elemento por separado", () => {
    expect(source).toContain("usePinnedScene()");
    expect(source).not.toMatch(/useScroll\(/);
    expect(source).not.toMatch(/photoRef|cardRef/);
  });
});

// BR-076 (HU-EXP-004 CA-27): lens flare que viaja con el borde de cada corte, en lugar de los láseres.
describe("SocialProof1: lens flare (BR-076, HU-EXP-004 CA-27)", () => {
  beforeEach(() => {
    state.reducedMotion = false;
  });

  it("CA-27: hay un flare en el borde del corte de la foto y otro en el de la tarjeta, decorativos (aria-hidden)", () => {
    renderSection();

    for (const which of ["photo", "card"]) {
      const flare = document.querySelector(`[data-flare="${which}"]`)!;
      expect(flare).not.toBeNull();
      expect(flare.getAttribute("aria-hidden")).toBe("true");
      expect(flare.querySelector("[data-lens-flare]")).not.toBeNull();
    }
  });

  it("el flare se mueve con el mismo recorrido que el panel de su corte y arranca apagado", () => {
    renderSection();

    for (const which of ["photo", "card"]) {
      const flare = document.querySelector(`[data-flare="${which}"]`)!;
      // Con el scroll en 0, el flare todavía no se enciende
      expect(flare.getAttribute("style")).toMatch(/opacity:\s*0/);
    }
    expect(source).toContain("x: photoCutX");
    expect(source).toContain("x: cardCutX");
  });

  it("el flare de la tarjeta es de núcleo rojo (la tarjeta es blanca) y los fantasmas quedan del lado ya revelado", () => {
    renderSection();

    expect(document.querySelector('[data-flare="photo"] [data-lens-flare]')?.className).not.toMatch(/light/);
    expect(document.querySelector('[data-flare="card"] [data-lens-flare]')?.className).toMatch(/light/);
    // Por defecto los fantasmas quedan a la izquierda; solo la tarjeta los lleva a la derecha, y no hay clases sueltas
    expect(document.querySelector('[data-flare="photo"] [data-lens-flare]')?.className).not.toMatch(/trailRight|undefined/);
    expect(document.querySelector('[data-flare="card"] [data-lens-flare]')?.className).toMatch(/trailRight/);
    expect(document.querySelector('[data-flare="card"] [data-lens-flare]')?.className).not.toMatch(/undefined/);
  });

  it("cada flare tiene núcleo, halo, trazo y cuatro fantasmas", () => {
    renderSection();

    const flare = document.querySelector("[data-lens-flare]")!;
    expect(flare.children).toHaveLength(7);
  });

  it("el contenedor del flare repite el recuadro del panel de corte, sin recorte ni fondo", () => {
    const flare = css.match(/\n\.cutFlare\s*\{([^}]*)\}/)?.[1] ?? "";
    const cover = css.match(/\n\.cutCover\s*\{([^}]*)\}/)?.[1] ?? "";

    for (const prop of ["top: -25%", "bottom: -25%", "left: -30%", "width: 160%"]) {
      expect(flare).toContain(prop);
      expect(cover).toContain(prop);
    }
    expect(flare).not.toMatch(/background|overflow/);
  });

  it("solo móvil o sin sección fija: no hay flare", () => {
    state.reducedMotion = true;
    renderSection();

    expect(document.querySelector("[data-flare]")).toBeNull();
  });
});
