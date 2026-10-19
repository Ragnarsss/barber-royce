import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config/constants";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";

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
    // La primera imagen del documento es la copia desenfocada, decorativa y sin alt: se busca la que describe la foto
    expect(document.querySelector("img[alt]:not([alt=''])")?.getAttribute("alt")).toContain(SITE.name);
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

  it("regresión: la copia desenfocada va debajo de la foto nítida y se mantiene opaca, para no dejar ver el marco rojo", () => {
    renderSection();

    const clip = document.querySelector("[data-photo-blur]")!.parentElement!;
    const layers = [...clip.querySelectorAll("picture")];
    // La copia borrosa es la primera: queda debajo (la nítida se pinta después, encima)
    expect(layers[0].hasAttribute("data-photo-blur")).toBe(true);
    expect(layers[1].getAttribute("style")).toMatch(/opacity:\s*0/);
    // Solo se retira cuando la nítida ya es del todo opaca: nunca se cruzan dos capas translúcidas
    expect(source).toMatch(/useTransform\(photoFocusProgress, \(value\) => \(value >= 1 \? 0 : 1\)\)/);
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

  it("el CSS: contenedor de 300vh y sección pegada arriba a pantalla completa, solo desde 769 px", () => {
    expect(desktop).toMatch(/\.pinned\s*\{[^}]*height:\s*300vh/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*position:\s*sticky/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*top:\s*0/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*height:\s*100vh/);
    expect(desktop).toMatch(/\.pinned > \.socialProof\s*\{[^}]*padding:\s*5rem 0 2rem/);
  });

  it("la copia de la foto es de desenfoque fijo y fuerte: lo que se anima es su opacidad", () => {
    expect(css).toMatch(/\.pictureBlur\s*\{[^}]*filter:\s*blur\((?:1[8-9]|[2-9]\d)px\)/);
    expect(css).not.toMatch(/transition:[^;]*filter/);
  });

  it("en escritorio los cortes, el flare y el enfoque salen del recorrido fijo del hook compartido, no del scroll de cada elemento", () => {
    expect(source).toContain("usePinnedScene()");
    for (const timeline of ["CUT.PHOTO", "CUT.CARD", "CUT.FLASH", "FLARE.PHOTO", "FLARE.CARD"]) {
      expect(source).toContain(`useTransform(pinProgress, ${timeline}`);
    }
    // El avance de cada elemento (`useScroll` sobre su propia referencia) solo alimenta el desenfoque de móvil (BR-078)
    expect(source).toMatch(/const subtitleFocus = scrub \? titleFocus : freeSubtitle/);
    expect(source).toMatch(/const photoFocusProgress = scrub \? photoFocus : freePhoto/);
    expect(source).toMatch(/const quoteFocusProgress = scrub \? quoteFocus : freeQuote/);
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

// BR-078 (HU-EXP-004 CA-29): en móvil, la tarjeta con la forma de escritorio y el revelado con desenfoque.
describe("SocialProof1 en móvil (BR-078, HU-EXP-004 CA-29)", () => {
  // Mobile-first (BR-081, ADR-009): la tarjeta de móvil es la regla base; el escritorio la ajusta desde 769 px
  const mobileCss = css;
  const card = mobileCss.match(/\.testimonialCard\s*\{([^}]*)\}/)?.[1] ?? "";

  /** Simula una pantalla angosta: la sección no se fija y el avance sale de cada elemento. */
  const withMobile = (run: () => void) => {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({ matches: false, media: query, addEventListener() {}, removeEventListener() {} })) as unknown as typeof window.matchMedia;
    try {
      run();
    } finally {
      window.matchMedia = original;
    }
  };

  beforeEach(() => {
    state.reducedMotion = false;
  });

  it("CA-29: la foto, el subtítulo y el texto del testimonio tienen su copia desenfocada decorativa; el título, no", () => {
    withMobile(() => {
      renderSection();

      expect(document.querySelectorAll("[data-photo-blur]")).toHaveLength(1);
      const copies = document.querySelectorAll("#social-proof-1 [data-focus-blur]");
      expect(copies).toHaveLength(2);
      copies.forEach((copy) => expect(copy.getAttribute("aria-hidden")).toBe("true"));
      expect(document.querySelector("#social-proof-1 h2 [data-focus-blur]")).toBeNull();
    });
  });

  it("empieza borroso: la copia de la foto se ve y la nítida está apagada", () => {
    withMobile(() => {
      renderSection();

      const clip = document.querySelector("[data-photo-blur]")!.parentElement!;
      const [blurred, sharp] = [...clip.querySelectorAll("picture")];
      expect(blurred.getAttribute("style")).toMatch(/opacity:\s*1/);
      expect(sharp.getAttribute("style")).toMatch(/opacity:\s*0/);
    });
  });

  it("en móvil la sección no se fija y no hay flare, pero sí el corte que revela la foto y la tarjeta", () => {
    withMobile(() => {
      renderSection();

      expect(document.getElementById("social-proof-1")!.parentElement?.className).not.toMatch(/pinned/);
      expect(document.querySelector("[data-flare]")).toBeNull();
      expect(document.querySelector('[data-cut="photo"]')).not.toBeNull();
      expect(document.querySelector('[data-cut="card"]')).not.toBeNull();
    });
  });

  it("CP-A11Y-003: con reducir movimiento, en móvil todo nítido y sin copias", () => {
    state.reducedMotion = true;
    withMobile(() => {
      renderSection();

      expect(document.querySelector("[data-photo-blur]")).toBeNull();
      expect(document.querySelector("#social-proof-1 [data-focus-blur]")).toBeNull();
    });
  });

  it("CA-29: la tarjeta conserva la forma de escritorio (sin quitar el recorte ni redondearla)", () => {
    expect(card.length).toBeGreaterThan(0);
    expect(card).not.toMatch(/clip-path:\s*none|border-radius|aspect-ratio:\s*auto|overflow:\s*hidden/);
  });

  it("CA-29: la tarjeta queda a la derecha y metida bajo la parte baja de la foto, con un margen negativo", () => {
    expect(card).toMatch(/margin:\s*-[\d.]+rem 0 0 auto/);
    // La foto está por encima de la tarjeta, como en escritorio
    const zIndex = (selector: RegExp) => Number(css.match(new RegExp(`\\n${selector.source}\\s*\\{[^}]*z-index:\\s*(\\d+)`))?.[1]);
    expect(zIndex(/\.imageContainer/)).toBeGreaterThan(zIndex(/\.testimonialCard/));
  });

  it("el texto de la tarjeta sigue dentro del polígono: el relleno se ajusta al ancho de la pantalla", () => {
    expect(card).toMatch(/padding:\s*clamp\(/);
    expect(card).toMatch(/width:\s*min\(\d+vw,/);
  });
});
