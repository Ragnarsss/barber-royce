import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { screen } from "@testing-library/react";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config/constants";
import { cardBlurFade, cardBodyFocus, cardSpinReveal, iconHeartbeat } from "@/config/animations.config";
import { benefitsList } from "@/data/benefitsData";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-064: «Estilo que te acompaña» fiel al Figma «Beneficios v2», con íconos que se dibujan.
const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

import { Benefits } from "./Benefits";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "Benefits.module.css"), "utf8");
const source = readFileSync(resolve(here, "Benefits.tsx"), "utf8");

/** jsdom no trae la API de animaciones web; framer-motion la usa para lo ligado al scroll. Solo para esos tests:
 *  en los demás cambiaría cómo framer aplica el trazo de los íconos. */
const withAnimateStub = (run: () => void) => {
  const original = Element.prototype.animate;
  Element.prototype.animate = vi.fn(() => ({ cancel() {}, finish() {}, play() {}, pause() {}, commitStyles() {}, finished: Promise.resolve(), currentTime: 0, playbackRate: 1, onfinish: null })) as unknown as Element["animate"];
  try {
    run();
  } finally {
    Element.prototype.animate = original;
  }
};

describe("Benefits (BR-064, HU-EXP-004 CA-16)", () => {
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
    state.reducedMotion = false;
  });

  it("CA-16: tres tarjetas con los títulos y las negritas del Figma", () => {
    renderWithProviders(<Benefits />);

    const cards = [...document.querySelectorAll("[data-benefit]")];
    expect(cards.map((card) => card.querySelector("h3")?.textContent)).toEqual(benefitsList.map((b) => b.title));
    // Sin la copia desenfocada de BR-074 (aria-hidden), que repite el texto
    const strongs = [...document.querySelectorAll("[data-benefit] strong")].filter((s) => !s.closest("[aria-hidden='true']"));
    expect(strongs.map((s) => s.textContent)).toEqual([
      "maestros en su oficio",
      "comodidad y el buen gusto",
      "escuchamos y asesoramos",
    ]);
  });

  it("CA-16: cada ícono se dibuja con un trazo (pathLength) que arranca oculto", () => {
    renderWithProviders(<Benefits />);

    const strokes = document.querySelectorAll("[data-benefit] [data-stroke]");
    expect(strokes.length).toBeGreaterThanOrEqual(9);
    for (const stroke of strokes) expect(stroke.getAttribute("stroke-dasharray")).not.toBeNull();
  });

  it("CP-A11Y-003: con reducir movimiento, íconos y tarjetas aparecen sin animar", () => {
    state.reducedMotion = true;
    renderWithProviders(<Benefits />);

    for (const stroke of document.querySelectorAll("[data-benefit] [data-stroke]")) {
      expect(stroke.getAttribute("stroke-dasharray")).toBeNull();
    }
    for (const card of document.querySelectorAll("[data-benefit]")) expect(card.getAttribute("style") ?? "").not.toMatch(/opacity:\s*0/);
  });

  it("la frase del subtítulo continúa en las tarjetas y la marca sale de la config", () => {
    renderWithProviders(<Benefits />);

    expect(document.body.textContent).toContain(`En ${SITE.name}, cada visita`);
    expect(document.body.textContent).toMatch(/ofreciendo:/);
    expect(source).not.toMatch(/Royce|Barbería/);
  });

  it("sin la tarjeta de shadcn (BR-023) ni colores escritos a mano (ADR-002)", () => {
    expect(source).not.toMatch(/components\/ui\/card/);
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });

  it("la foto ya no lleva el velo rojo: el rojo es una franja diagonal aparte", () => {
    expect(css).not.toMatch(/\.benefits::before/);
    expect(css).toMatch(/\n\.band\s*\{[^}]*clip-path:\s*polygon\(/);
  });

  it("el hover de la tarjeta usa translate: un transform del CSS lo pisaría la entrada de framer", () => {
    expect(css).toMatch(/\.card:hover\s*\{[^}]*translate:/);
    expect(css).not.toMatch(/\.card:hover\s*\{[^}]*transform:/);
  });

  it("escena de scroll: la franja y la foto se mueven ligadas al scroll", () => {
    withAnimateStub(() => {
      renderWithProviders(<Benefits />);

      expect(document.querySelector("[data-band]")?.getAttribute("style") ?? "").toMatch(/transform/);
      expect(document.querySelector("[data-photo-motion]")?.getAttribute("style") ?? "").toMatch(/transform/);
    });
  });

  it("CP-A11Y-003: con reducir movimiento, la franja y la foto quedan quietas en su lugar", () => {
    state.reducedMotion = true;
    renderWithProviders(<Benefits />);

    expect(document.querySelector("[data-band]")?.getAttribute("style")).toBeNull();
    expect(document.querySelector("[data-photo-motion]")?.getAttribute("style")).toBeNull();
  });

  it("al pasar el ratón, el ícono se vuelve a dibujar por CSS (un whileHover rompería la herencia de la entrada)", () => {
    expect(css).toMatch(/\.card:hover \.cardIcon \[data-stroke\]\s*\{[^}]*animation:\s*iconRedraw/);
    expect(source).not.toMatch(/whileHover=/);
  });
});

// BR-069 (HU-EXP-004 CA-20): las tarjetas pasan del blanco del Figma al vidrio oscuro con esquinas cortadas del Hero.
describe("Benefits: tarjetas de vidrio (BR-069, HU-EXP-004 CA-20)", () => {
  const rule = (selector: RegExp) => css.match(new RegExp(`\\n${selector.source}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

  it("CA-20: la tarjeta usa el borde, el vidrio y el recorte de los tokens compartidos", () => {
    expect(rule(/\.card/)).toMatch(/background:\s*var\(--card-edge\)/);
    expect(rule(/\.card/)).toMatch(/clip-path:\s*var\(--card-clip\)/);
    expect(rule(/\.card::before/)).toMatch(/background:\s*var\(--card-glass\)/);
    expect(rule(/\.card::before/)).toMatch(/clip-path:\s*var\(--card-clip\)/);
  });

  it("CA-20: el texto y el ícono son blancos sobre el vidrio", () => {
    for (const selector of [/\.cardTitle/, /\.cardIcon/, /\.cardDescription/]) {
      expect(rule(selector)).toMatch(/color:\s*var\(--color-brand-white\)/);
    }
  });

  it("CA-20: el borde se enciende en rojo al pasar el ratón, y la luz que barre solo existe con ratón", () => {
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[^@]*\.card:hover\s*\{[^}]*background:\s*var\(--card-edge-hot\)/);
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[^@]*\.card:hover::after/);
  });

  it("CP-A11Y-003: con reducir movimiento no hay luz que barra", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.card::after\s*\{[^}]*display:\s*none/);
  });

  it("ADR-002: ni el fondo blanco de antes ni colores escritos a mano en las tarjetas", () => {
    expect(rule(/\.card/)).not.toMatch(/background-color:\s*var\(--color-brand-white\)/);
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});

// BR-071 (HU-EXP-004 CA-22): la foto puente de móvil lleva dos cuñas rojas, en espejo.
describe("Benefits: foto puente con dos cuñas (BR-071, HU-EXP-004 CA-22)", () => {
  const mobile = css.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const rule = (selector: RegExp) => mobile.match(new RegExp(`\\n\\s*${selector.source}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

  it("CA-22: una cuña arriba a la izquierda (::before) y otra abajo a la derecha (::after)", () => {
    expect(rule(/\.imageBackground::before/)).toMatch(/top:\s*0/);
    expect(rule(/\.imageBackground::before/)).toMatch(/left:\s*0/);
    expect(rule(/\.imageBackground::before/)).toMatch(/clip-path:\s*polygon\(0 0, 100% 0, 0 100%\)/);
    expect(rule(/\.imageBackground::after/)).toMatch(/bottom:\s*0/);
    expect(rule(/\.imageBackground::after/)).toMatch(/right:\s*0/);
    expect(rule(/\.imageBackground::after/)).toMatch(/clip-path:\s*polygon\(100% 0, 100% 100%, 0 100%\)/);
  });

  it("el tamaño de cada cuña sale de variables, para ajustarlo a ojo", () => {
    expect(mobile).toMatch(/--wedge-top-height:\s*\d+%/);
    expect(mobile).toMatch(/--wedge-bottom-width:\s*\d+%/);
    expect(mobile).toMatch(/--wedge-bottom-height:\s*\d+%/);
    expect(rule(/\.imageBackground::before/)).toMatch(/height:\s*var\(--wedge-top-height\)/);
    expect(rule(/\.imageBackground::after/)).toMatch(/width:\s*var\(--wedge-bottom-width\)/);
  });

  it("las dos cuñas son del rojo de la marca, de un token", () => {
    expect(rule(/\.imageBackground::before/)).toMatch(/background:\s*var\(--color-brand-primary\)/);
    expect(rule(/\.imageBackground::after/)).toMatch(/background:\s*var\(--color-brand-primary\)/);
  });
});

// BR-074 (HU-EXP-004 CA-25): título y subtítulo que se enfocan con el scroll, tarjetas que giran 360° y ícono que late.
describe("Benefits: revelado con el scroll (BR-074, HU-EXP-004 CA-25)", () => {
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
    state.reducedMotion = false;
  });

  it("el título y el subtítulo tienen cada uno su copia desenfocada decorativa (aria-hidden)", () => {
    renderWithProviders(<Benefits />);

    const copies = document.querySelectorAll("#benefits [data-focus-blur]");
    expect(copies).toHaveLength(2);
    copies.forEach((copy) => expect(copy.getAttribute("aria-hidden")).toBe("true"));
  });

  it("CA-25: cada tarjeta lleva una copia desenfocada de su texto, sin ícono, que reserva su lugar", () => {
    renderWithProviders(<Benefits />);

    const cards = [...document.querySelectorAll("[data-benefit]")];
    cards.forEach((card, index) => {
      const copy = card.querySelector("[data-card-blur]")!;
      expect(copy.getAttribute("aria-hidden")).toBe("true");
      expect(copy.textContent).toContain(benefitsList[index].title);
      expect(copy.querySelector("svg")).toBeNull();
    });
  });

  it("CA-25: los lectores de pantalla leen cada título de tarjeta una sola vez", () => {
    renderWithProviders(<Benefits />);

    for (const benefit of benefitsList) {
      expect(screen.getAllByRole("heading", { name: benefit.title })).toHaveLength(1);
    }
  });

  it("CA-25: la tarjeta gira 360° sobre el eje vertical y termina de frente, con perspectiva", () => {
    expect(cardSpinReveal.hidden).toMatchObject({ rotateY: -360, transformPerspective: expect.any(Number) });
    expect(cardSpinReveal.visible).toMatchObject({ rotateY: 0, opacity: 1, scale: 1 });
  });

  it("el contenido nítido aparece cuando la copia desenfocada se desvanece, al mismo tiempo", () => {
    const delay = (variant: unknown) => (variant as { transition: { delay: number } }).transition.delay;

    expect(delay(cardBodyFocus.visible)).toBe(delay(cardBlurFade.visible));
    expect(cardBlurFade.hidden).toMatchObject({ opacity: 1 });
    expect(cardBlurFade.visible).toMatchObject({ opacity: 0 });
  });

  it("CA-25: el ícono late dos veces, una sola vez, y vuelve a su tamaño", () => {
    const visible = iconHeartbeat.visible as { scale: number[]; transition: { duration: number; delay: number } };
    const peaks = visible.scale.filter((value, i, all) => i > 0 && i < all.length - 1 && value > all[i - 1] && value > all[i + 1]);

    expect(peaks).toHaveLength(2);
    expect(visible.scale[0]).toBe(1);
    expect(visible.scale.at(-1)).toBe(1);
    // CP-A11Y-005: menos de 3 pulsos por segundo; y espera a que termine el giro
    expect(peaks.length / visible.transition.duration).toBeLessThanOrEqual(3);
    expect((cardSpinReveal.visible as { transition: { duration: number } }).transition.duration).toBeLessThan(visible.transition.delay);
  });

  it("CP-A11Y-003: con reducir movimiento todo es nítido y quieto: sin copias desenfocadas", () => {
    state.reducedMotion = true;
    renderWithProviders(<Benefits />);

    expect(document.querySelector("#benefits [data-focus-blur]")).toBeNull();
    expect(document.querySelector("#benefits [data-card-blur]")).toBeNull();
    expect(screen.getAllByRole("heading", { name: benefitsList[0].title })).toHaveLength(1);
  });

  it("solo se animan propiedades baratas: transform y opacidad, nunca el radio de un desenfoque", () => {
    const keys = [cardSpinReveal, cardBodyFocus, cardBlurFade, iconHeartbeat].flatMap((variants) =>
      Object.values(variants).flatMap((variant) => Object.keys(variant as object)),
    );
    const allowed = ["opacity", "rotateY", "scale", "y", "transformPerspective", "transition"];

    expect(keys.filter((key) => !allowed.includes(key))).toEqual([]);
    expect(css).toMatch(/\.cardBlur\s*\{[^}]*filter:\s*blur\(\d+px\)/);
    expect(css).not.toMatch(/transition:[^;]*filter/);
  });
});
