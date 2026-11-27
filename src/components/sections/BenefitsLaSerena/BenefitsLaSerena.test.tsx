import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LA_SERENA, colorOf, ratio } from "@/test/themeTokens";
import { benefitsList } from "@/data/benefitsData";
import { LA_SERENA_PHOTOS } from "@/data/laSerenaPhotos";
import { TEXTS } from "@/content/texts";
import { BENEFITS_SERENA_TIMELINE as T } from "@/config/animations.config";

const state = vi.hoisted(() => ({ reducedMotion: false, pinned: false }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

// La escena fija (BR-074) depende de la media query y de useScroll: aquí se controla a mano
vi.mock("@/hooks/usePinnedScene", async () => {
  const { motionValue } = await import("framer-motion");
  const progress = motionValue(0);
  return { __progress: progress, usePinnedScene: () => ({ pinRef: { current: null }, pinned: state.pinned, progress }) };
});

import { BenefitsLaSerena } from "./BenefitsLaSerena";

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "BenefitsLaSerena.module.css"), "utf8");
const rule = (selector: string) => css.match(new RegExp(`\\n${selector.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

const hex = (value: string) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));
const over = (top: string, alpha: number, bottom = "#ffffff") =>
  `#${hex(top)
    .map((v, i) => Math.round(v * alpha + hex(bottom)[i] * (1 - alpha)).toString(16).padStart(2, "0"))
    .join("")}`;

// BR-117 (HU-SUC-002 CA-11, RF-SUC-010, CP-SUC-010): franja de fotos que avanza sola, con título, subtítulo y tarjetas encima.
describe("BenefitsLaSerena (BR-117)", () => {
  const animate = Element.prototype.animate;
  const observer = globalThis.IntersectionObserver;
  // Los observadores que crea el componente (los de framer-motion también pasan por aquí), para dispararlos a mano
  const observers: Array<{ callback: IntersectionObserverCallback; options?: IntersectionObserverInit }> = [];
  /** El observador de la sección: el único con un margen que descuenta la barra de navegación. */
  const fitObserver = () => observers.find((o) => String(o.options?.rootMargin).startsWith("-80px"))!;
  const emitFit = (visible: number, section: number, root: number) =>
    act(() => {
      fitObserver().callback(
        [
          {
            isIntersecting: visible > 0,
            intersectionRect: { height: visible },
            boundingClientRect: { height: section },
            rootBounds: { height: root },
          } as unknown as IntersectionObserverEntry,
        ],
        {} as IntersectionObserver,
      );
    });

  beforeAll(() => {
    // framer-motion acelera con la Web Animations API y mide la vista con IntersectionObserver: jsdom no trae ninguna.
    Element.prototype.animate = vi.fn(() => ({ cancel() {}, finish() {}, play() {}, pause() {}, commitStyles() {}, finished: Promise.resolve(), currentTime: 0, playbackRate: 1, onfinish: null })) as unknown as Element["animate"];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        constructor(callback: IntersectionObserverCallback, options?: IntersectionObserverInit) {
          observers.push({ callback, options });
        }
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  afterAll(() => {
    Element.prototype.animate = animate;
    vi.stubGlobal("IntersectionObserver", observer);
  });

  beforeEach(() => {
    state.reducedMotion = false;
    state.pinned = false;
    observers.length = 0;
  });

  it("CA-11: el título sale del texto editable benefits.titulo y el subtítulo nombra a la barbería", () => {
    renderWithProviders(<BenefitsLaSerena />);

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(TEXTS["benefits.titulo"].default);
    expect(screen.getByText(/cada visita es una oportunidad/)).toHaveTextContent(/Royce Barbería/);
  });

  it("CA-11: muestra los mismos tres beneficios que la sección de Coquimbo, con su título y su descripción", () => {
    renderWithProviders(<BenefitsLaSerena />);

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(benefitsList.length);
    benefitsList.forEach((benefit, index) => {
      expect(cards[index]).toHaveTextContent(benefit.title);
      const plain = benefit.description.map((part) => (typeof part === "string" ? part : part.strong)).join("");
      expect(cards[index]).toHaveTextContent(plain);
    });
  });

  it("CA-11: la franja de fotos es decorativa y repite las fotos para dar la vuelta sin salto", () => {
    const { container } = renderWithProviders(<BenefitsLaSerena />);

    const strip = container.querySelector("[class*='strip']");
    expect(strip).toHaveAttribute("aria-hidden", "true");
    const images = strip!.querySelectorAll("img");
    expect(images).toHaveLength(LA_SERENA_PHOTOS.length * 2);
    images.forEach((image) => expect(image).toHaveAttribute("alt", ""));
    expect(container.querySelector("[class*='veil']")).toHaveAttribute("aria-hidden", "true");
  });

  it("RNF-A11Y-003: un botón pausa y reanuda la franja", () => {
    const { container } = renderWithProviders(<BenefitsLaSerena />);

    fireEvent.click(screen.getByRole("button", { name: "Pausar las fotos" }));

    expect(screen.getByRole("button", { name: "Reanudar las fotos" })).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector("section")?.className).toMatch(/paused/);
  });

  it("RNF-A11Y-003: con «reducir movimiento» no hay botón y las tarjetas están completas", () => {
    state.reducedMotion = true;
    renderWithProviders(<BenefitsLaSerena />);

    expect(screen.queryByRole("button")).toBeNull();
    screen.getAllByRole("article").forEach((card) => expect(card).not.toHaveStyle({ opacity: "0" }));
  });

  it("el CSS pausa la franja con el cursor, con el foco y con el botón, y solo la anima si el movimiento está permitido", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: no-preference\)\s*\{[^@]*animation:\s*strip-x/);
    expect(css).toMatch(/\.benefits:hover \.track,\s*\.benefits:focus-within \.track,\s*\.paused \.track\s*\{[^}]*animation-play-state:\s*paused/);
  });

  it("CA-11: la sección ocupa el espacio visible (la ventana menos la barra de 80 px) y crece si el contenido es más alto", () => {
    expect(rule(".benefits")).toMatch(/min-height:\s*calc\(100svh - 80px\)/);
    expect(rule(".benefits")).not.toMatch(/[^-]height:\s*calc/);
  });

  it("CA-11: la franja empieza quieta y solo se enciende cuando la sección encaja en el espacio visible", () => {
    const { container } = renderWithProviders(<BenefitsLaSerena />);
    const section = container.querySelector("section")!;

    // Sin aviso del observador no está encajada: el CSS la deja en pausa
    expect(section).not.toHaveAttribute("data-fitted", "1");
    expect(css).toMatch(/\.benefits:not\(\[data-fitted="1"\]\) \.track/);

    emitFit(120, 640, 820); // asoma por abajo
    expect(section).toHaveAttribute("data-fitted", "0");

    emitFit(640, 640, 820); // se ve entera
    expect(section).toHaveAttribute("data-fitted", "1");

    emitFit(400, 640, 820); // se va por arriba
    expect(section).toHaveAttribute("data-fitted", "0");
  });

  it("CA-11: en el celular, con la sección más alta que la ventana, encaja cuando llena el espacio visible", () => {
    const { container } = renderWithProviders(<BenefitsLaSerena />);
    const section = container.querySelector("section")!;

    emitFit(764, 1180, 764);
    expect(section).toHaveAttribute("data-fitted", "1");
  });

  it("el observador descuenta la barra de navegación y avisa en pasos finos, no solo al entrar y salir", () => {
    renderWithProviders(<BenefitsLaSerena />);

    const { options } = fitObserver();
    expect(options?.rootMargin).toBe("-80px 0px 0px 0px");
    expect((options?.threshold as number[]).length).toBeGreaterThan(20);
  });

  it("CA-11: las fotos van pegadas, sin separación, sin marco y sin esquinas redondeadas", () => {
    const track = rule(".track") + rule(".photo");

    expect(track).not.toMatch(/gap|padding|border|radius/);
  });

  // La escena fija de escritorio: el scroll arma el título, el subtítulo y las tarjetas, y el último tramo solo asienta la vista
  describe("escena fija con el scroll (escritorio)", () => {
    const scrollTo = async (value: number) => {
      const { __progress } = (await import("@/hooks/usePinnedScene")) as unknown as { __progress: { set: (v: number) => void } };
      act(() => __progress.set(value));
    };
    const opacityOf = (element: Element) => Number.parseFloat((element as HTMLElement).style.opacity || "1");

    beforeEach(async () => {
      state.pinned = true;
      await scrollTo(0);
    });

    it("CA-11: al empezar la escena el título, el subtítulo y las tarjetas están ocultos, y el contenedor es el alto que fija la sección", async () => {
      const { container } = renderWithProviders(<BenefitsLaSerena />);

      await waitFor(() => expect(opacityOf(screen.getByRole("heading", { level: 2 }))).toBe(0));
      expect(opacityOf(screen.getByText(/cada visita es una oportunidad/))).toBe(0);
      screen.getAllByRole("article").forEach((card) => expect(opacityOf(card)).toBe(0));
      expect(container.firstElementChild?.className).toMatch(/pinned/);
    });

    it("CA-11: cada pieza entra en su tramo y en orden: título, subtítulo, y luego las tarjetas una tras otra", async () => {
      renderWithProviders(<BenefitsLaSerena />);
      const title = screen.getByRole("heading", { level: 2 });
      const subtitle = screen.getByText(/cada visita es una oportunidad/);
      const cards = screen.getAllByRole("article");

      await scrollTo(0.17); // el título ya llegó; el subtítulo va a medias; ninguna tarjeta
      await waitFor(() => expect(opacityOf(title)).toBe(1));
      expect(opacityOf(subtitle)).toBeGreaterThan(0);
      expect(opacityOf(subtitle)).toBeLessThan(1);
      cards.forEach((card) => expect(opacityOf(card)).toBe(0));

      await scrollTo(0.35); // la primera tarjeta está entera, la segunda a medias, la tercera todavía no
      await waitFor(() => expect(opacityOf(cards[0])).toBe(1));
      expect(opacityOf(cards[1])).toBeGreaterThan(0);
      expect(opacityOf(cards[1])).toBeLessThan(1);
      expect(opacityOf(cards[2])).toBe(0);

      await scrollTo(0.5); // todo está armado
      await waitFor(() => cards.forEach((card) => expect(opacityOf(card)).toBe(1)));
    });

    it("CA-11: del 0,5 al 1 la vista se asienta: no cambia nada, solo corre la franja de fotos", async () => {
      renderWithProviders(<BenefitsLaSerena />);
      const parts = () => [screen.getByRole("heading", { level: 2 }), screen.getByText(/cada visita es una oportunidad/), ...screen.getAllByRole("article")].map(opacityOf);

      await scrollTo(0.5);
      await waitFor(() => expect(parts().every((value) => value === 1)).toBe(true));
      await scrollTo(0.99);
      await waitFor(() => expect(parts().every((value) => value === 1)).toBe(true));
      // la línea de tiempo lo dice igual: ningún tramo termina después del 0,5
      expect(Math.max(...T.cards.map(([, end]) => end), T.title[1], T.subtitle[1])).toBeLessThanOrEqual(0.5);
    });

    it("al volver a subir la escena se deshace (todo va con el scroll, nada queda como estado)", async () => {
      renderWithProviders(<BenefitsLaSerena />);
      const title = screen.getByRole("heading", { level: 2 });

      await scrollTo(0.5);
      await waitFor(() => expect(opacityOf(title)).toBe(1));
      await scrollTo(0);
      await waitFor(() => expect(opacityOf(title)).toBe(0));
    });

    it("con «reducir movimiento» no hay escena fija: todo se ve completo", async () => {
      state.reducedMotion = true;
      const { container } = renderWithProviders(<BenefitsLaSerena />);

      expect(container.firstElementChild?.className).not.toMatch(/pinned/);
      expect(screen.getByRole("heading", { level: 2 })).not.toHaveStyle({ opacity: "0" });
      screen.getAllByRole("article").forEach((card) => expect(card).not.toHaveStyle({ opacity: "0" }));
    });

    it("el CSS fija la sección bajo la barra solo desde 769 px, con un contenedor de unas tres pantallas", () => {
      const desktop = css.slice(css.indexOf("@media (min-width: 769px)"));

      expect(css.indexOf("@media (min-width: 769px)")).toBeGreaterThan(0);
      expect(rule(".pin")).not.toMatch(/height/); // fuera de escritorio el contenedor no hace nada
      expect(desktop).toMatch(/\.pinned\s*\{[^}]*height:\s*290svh/);
      expect(desktop).toMatch(/\.pinned > \.benefits\s*\{[^}]*position:\s*sticky[^}]*top:\s*80px/);
    });
  });

  // El texto hueso va sobre el velo (70 % de espresso en la zona del título) y sobre la tarjeta (88 %). El peor caso es
  // que detrás haya un píxel blanco de la foto.
  describe("RNF-A11Y-004: el texto se lee sobre las fotos (peor caso: un píxel blanco detrás)", () => {
    const espresso = colorOf("--color-espresso", LA_SERENA);
    const bone = colorOf("--color-bone", LA_SERENA);

    it("el CSS declara el velo del título al 70 % y las tarjetas al 88 %, que es lo que miden los pares de abajo", () => {
      expect(rule(".veil")).toMatch(/var\(--color-espresso\) 70%/);
      expect(rule(".card")).toMatch(/background-color:\s*color-mix\(in srgb,\s*var\(--color-espresso\) 88%/);
    });

    it("el título y el subtítulo (hueso sobre el velo al 70 %) cumplen 4,5:1", () => {
      expect(ratio(bone, over(espresso, 0.7))).toBeGreaterThanOrEqual(4.5);
    });

    it("el título, la descripción y las negritas de la tarjeta (hueso sobre la tarjeta al 88 %) cumplen 4,5:1", () => {
      expect(ratio(bone, over(espresso, 0.88))).toBeGreaterThanOrEqual(4.5);
    });

    it("las negritas de la descripción son huesos, no ámbar (el ámbar daba 3,7:1 sobre la tarjeta)", () => {
      expect(rule(".cardDescription strong")).not.toMatch(/amber/);
      expect(ratio(colorOf("--color-amber", LA_SERENA), over(espresso, 0.88))).toBeLessThan(4.5);
    });
  });
});
