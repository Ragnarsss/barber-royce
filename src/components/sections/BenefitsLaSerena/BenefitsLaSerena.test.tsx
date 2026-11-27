import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LA_SERENA, colorOf, ratio } from "@/test/themeTokens";
import { benefitsList } from "@/data/benefitsData";
import { LA_SERENA_PHOTOS } from "@/data/laSerenaPhotos";
import { TEXTS } from "@/content/texts";

const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

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

  beforeAll(() => {
    // framer-motion acelera con la Web Animations API y mide la vista con IntersectionObserver: jsdom no trae ninguna.
    Element.prototype.animate = vi.fn(() => ({ cancel() {}, finish() {}, play() {}, pause() {}, commitStyles() {}, finished: Promise.resolve(), currentTime: 0, playbackRate: 1, onfinish: null })) as unknown as Element["animate"];
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

  afterAll(() => {
    Element.prototype.animate = animate;
    vi.stubGlobal("IntersectionObserver", observer);
  });

  beforeEach(() => {
    state.reducedMotion = false;
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

  it("CA-11: las fotos van pegadas, sin separación, sin marco y sin esquinas redondeadas", () => {
    const track = rule(".track") + rule(".photo");

    expect(track).not.toMatch(/gap|padding|border|radius/);
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
