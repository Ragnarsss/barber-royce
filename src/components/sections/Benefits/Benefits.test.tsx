import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { screen } from "@testing-library/react";
import { afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config/constants";
import { benefitsList } from "@/data/benefitsData";
import {
  BEAT_FROM,
  BEAT_SCALE,
  PHOTO_SETTLE_END,
  PHOTO_ZOOM,
  PIN_TITLE_END,
  SPIN_END,
  TEXT_FOCUS_FROM,
  cardProgress,
  cardScale,
  drawProgress,
  heartbeatScale,
  photoLift,
  photoScale,
  sharpness,
  spinAngle,
} from "./reveal";
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

  it("CA-25: las tarjetas giran con el scroll sobre el eje vertical, con perspectiva, y las copias se cruzan por opacidad", () => {
    renderWithProviders(<Benefits />);

    const cards = [...document.querySelectorAll("[data-benefit]")];
    for (const card of cards) {
      // Con el scroll en 0, toda tarjeta está a la vista (sin opacidad 0), de frente y borrosa: no corre nada sola
      expect(card.getAttribute("style")).toMatch(/perspective\(900px\)/);
      expect(card.getAttribute("style") ?? "").not.toMatch(/opacity:\s*0/);
      expect((card.querySelector("[data-card-blur]") as HTMLElement).getAttribute("style")).toMatch(/opacity:\s*1/);
      expect((card.firstElementChild as HTMLElement).getAttribute("style")).toMatch(/opacity:\s*0/);
    }
  });

  it("CA-25: el giro de 360° parte y termina de frente, y el giro, el enfoque y el trazo se deshacen al volver (scrub)", () => {
    expect(spinAngle(0)).toBe(0);
    expect(spinAngle(1)).toBe(360);
    const angles = [0, 0.1, 0.3, 0.5, 0.7, 1].map(spinAngle);
    expect(angles).toEqual([...angles].sort((a, b) => a - b));
    expect(spinAngle(SPIN_END / 2)).toBeGreaterThan(0);
    expect(spinAngle(SPIN_END / 2)).toBeLessThan(360);
    expect(sharpness(0)).toBe(0);
    expect(sharpness(1)).toBe(1);
    expect(drawProgress(0)).toBe(0);
    expect(drawProgress(1)).toBe(1);
    expect(cardScale(0)).toBeCloseTo(0.95);
    expect(cardScale(1)).toBeCloseTo(1);
  });

  it("el contenido de la tarjeta sigue borroso la primera parte del giro y se enfoca en la segunda", () => {
    expect(sharpness(0.35)).toBe(0);
    expect(sharpness(SPIN_END)).toBe(1);
    expect(sharpness((0.35 + SPIN_END) / 2)).toBeCloseTo(0.5);
  });

  it("el título y el subtítulo se ven solo borrosos hasta la mitad del avance y recién después se enfocan", () => {
    expect(TEXT_FOCUS_FROM).toBe(0.5);
  });

  it("la foto parte un 50 % más grande y se asienta con desaceleración marcada en el primer 60 % de la sección fija", () => {
    expect(PHOTO_ZOOM).toBe(0.5);
    expect(photoScale(0)).toBeCloseTo(1.5);
    expect(photoScale(PHOTO_SETTLE_END)).toBeCloseTo(1);
    expect(photoScale(1)).toBe(1);
    // Brusco al comienzo: en el primer 20 % del asentamiento ya recorrió casi la mitad del zoom
    expect(photoScale(PHOTO_SETTLE_END * 0.2)).toBeLessThan(1.3);
    const scales = [0, 0.1, 0.2, 0.3, 0.45, 0.6, 1].map(photoScale);
    expect(scales).toEqual([...scales].sort((a, b) => b - a));
    expect(photoLift(0)).toBe("-6%");
    expect(photoLift(1)).toBe("0%");
  });

  it("CA-25: las tarjetas se revelan una tras otra, cada una en su tramo, sin superponerse", () => {
    // Al comienzo: ninguna empezó
    expect([0, 1, 2].map((i) => cardProgress(0, i))).toEqual([0, 0, 0]);
    // En el primer tramo solo avanza la primera; al terminar, la segunda y la tercera aún no empezaron
    expect(cardProgress(1 / 6, 0)).toBeCloseTo(0.5);
    expect(cardProgress(1 / 6, 1)).toBe(0);
    expect(cardProgress(1 / 6, 2)).toBe(0);
    // Al empezar el segundo tramo, la primera ya terminó
    expect(cardProgress(1 / 3, 0)).toBe(1);
    expect(cardProgress(0.5, 1)).toBeCloseTo(0.5);
    expect(cardProgress(0.5, 2)).toBe(0);
    // La tercera termina justo al final
    expect(cardProgress(5 / 6, 2)).toBeCloseTo(0.5);
    expect(cardProgress(1, 2)).toBe(1);
    // Nunca hay dos tarjetas a mitad de camino a la vez
    for (let p = 0; p <= 1; p += 0.01) {
      const inProgress = [0, 1, 2].filter((i) => cardProgress(p, i) > 0.001 && cardProgress(p, i) < 0.999);
      expect(inProgress.length).toBeLessThanOrEqual(1);
    }
  });

  it("CA-25: el ícono late dos veces, solo en el último tramo del avance, y vuelve a su tamaño", () => {
    expect(heartbeatScale(0)).toBe(1);
    expect(heartbeatScale(BEAT_FROM)).toBe(1);
    expect(heartbeatScale(1)).toBeCloseTo(1);
    const samples = Array.from({ length: 201 }, (_, i) => heartbeatScale(BEAT_FROM + ((1 - BEAT_FROM) * i) / 200));
    const peaks = samples.filter((value, i) => i > 0 && i < samples.length - 1 && value > samples[i - 1] && value >= samples[i + 1] && value > 1.05);
    expect(peaks).toHaveLength(2);
    expect(Math.max(...samples)).toBeCloseTo(1 + BEAT_SCALE, 1);
  });

  it("CP-A11Y-003: con reducir movimiento todo es nítido y quieto: sin copias desenfocadas", () => {
    state.reducedMotion = true;
    renderWithProviders(<Benefits />);

    expect(document.querySelector("#benefits [data-focus-blur]")).toBeNull();
    expect(document.querySelector("#benefits [data-card-blur]")).toBeNull();
    expect(screen.getAllByRole("heading", { name: benefitsList[0].title })).toHaveLength(1);
  });

  it("solo se animan propiedades baratas (transform y opacidad): el desenfoque es de radio fijo y fuerte", () => {
    expect(css).toMatch(/\.cardBlur\s*\{[^}]*filter:\s*blur\((?:1[2-9]|[2-9]\d)px\)/);
    expect(css).not.toMatch(/transition:[^;]*filter/);
    expect(source).not.toMatch(/useScrollAnimation|whileInView|animate=\{controls\}/);
  });
});

// BR-074: en escritorio la sección queda fija en pantalla mientras se revela, y el scroll avanza la secuencia.
describe("Benefits: sección fija mientras se revela (BR-074, HU-EXP-004 CA-25)", () => {
  const desktop = css.match(/@media \(min-width: 769px\)\s*\{\s*\.pinned\s*\{([\s\S]*?)\n\}/)?.[0] ?? "";

  const stubViewport = (wide: boolean) =>
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: wide && query === "(min-width: 769px)",
      addEventListener: () => {},
      removeEventListener: () => {},
    }));

  beforeEach(() => {
    state.reducedMotion = false;
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

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("en escritorio, el contenedor alto fija la sección (la clase pinned)", () => {
    stubViewport(true);
    renderWithProviders(<Benefits />);

    const section = document.getElementById("benefits")!;
    expect(section.parentElement?.className).toMatch(/pinned/);
  });

  it("en móvil la sección no se fija: sube con la página", () => {
    stubViewport(false);
    renderWithProviders(<Benefits />);

    expect(document.getElementById("benefits")!.parentElement?.className).not.toMatch(/pinned/);
  });

  it("CP-A11Y-003: con reducir movimiento tampoco se fija, aunque la pantalla sea ancha", () => {
    stubViewport(true);
    state.reducedMotion = true;
    renderWithProviders(<Benefits />);

    expect(document.getElementById("benefits")!.parentElement?.className).not.toMatch(/pinned/);
  });

  it("el CSS: contenedor de 280vh y sección pegada arriba a pantalla completa, solo desde 769 px", () => {
    expect(desktop).toMatch(/\.pinned\s*\{[^}]*height:\s*280vh/);
    expect(desktop).toMatch(/\.pinned > \.benefits\s*\{[^}]*position:\s*sticky/);
    expect(desktop).toMatch(/\.pinned > \.benefits\s*\{[^}]*top:\s*0/);
    expect(desktop).toMatch(/\.pinned > \.benefits\s*\{[^}]*height:\s*100vh/);
  });

  it("la navbar fija (80 px) no tapa el contenido de la sección fija", () => {
    expect(desktop).toMatch(/\.pinned > \.benefits\s*\{[^}]*padding:\s*5rem 0 0/);
  });

  it("el recorrido fijo: primero los títulos y luego las tarjetas, una detrás de otra", () => {
    expect(PIN_TITLE_END).toBe(0.2);
    expect(source).toMatch(/offset:\s*\["start start",\s*"end end"\]/);
  });
});
