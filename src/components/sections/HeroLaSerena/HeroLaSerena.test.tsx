import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { SITE } from "@/config/constants";
import { TEXTS } from "@/content/texts";
import { LA_SERENA_PHOTOS } from "@/data/laSerenaPhotos";
import { LETTERING_NAME_PATHS, LETTERING_NAME_TEXT, LETTERING_PREFIX_PATHS, LETTERING_PREFIX_TEXT, LETTERING_VIEWBOX } from "@/components/common/BrandLettering/letteringPaths";

const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

import { HeroLaSerena } from "./HeroLaSerena";

/** Lo que oye un lector de pantalla: el texto sin los nodos `aria-hidden`. */
function audible(container: HTMLElement): string {
  const clone = container.cloneNode(true) as HTMLElement;
  clone.querySelectorAll("[aria-hidden='true']").forEach((node) => node.remove());
  return clone.textContent ?? "";
}

// BR-114 (HU-SUC-002 CA-10, RF-SUC-009, CP-SUC-009): marca que estalla, título, subtítulo letra por letra, tarjetas y
// carruseles, todo con el scroll; con «reducir movimiento», todo quieto y completo.
describe("HeroLaSerena (BR-114)", () => {
  const getContext = HTMLCanvasElement.prototype.getContext;
  const animate = Element.prototype.animate;

  beforeAll(() => {
    // jsdom no dibuja en canvas: sin contexto, las partículas no se montan y el resto del hero funciona igual.
    HTMLCanvasElement.prototype.getContext = (() => null) as typeof getContext;
    // framer-motion acelera con la Web Animations API, que jsdom no trae (igual que en Benefits.test.tsx).
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
  });

  afterAll(() => {
    HTMLCanvasElement.prototype.getContext = getContext;
    Element.prototype.animate = animate;
  });

  beforeEach(() => {
    state.reducedMotion = false;
  });

  it("CP-SUC-009: la marca de SITE.brand es el único h1, y nombra la sucursal", () => {
    renderWithProviders(<HeroLaSerena />);

    const [h1, ...others] = screen.getAllByRole("heading", { level: 1 });
    expect(others).toHaveLength(0);
    expect(h1.textContent).toBe(`${SITE.brand.prefix} ${SITE.brand.name} en La Serena`);
  });

  it("la marca grande es el lettering del dueño dibujado (SVG decorativo, un trazado por letra) y dice lo mismo que SITE.brand; el h1 la nombra en texto", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);

    expect(LETTERING_PREFIX_TEXT).toBe(SITE.brand.prefix);
    expect(LETTERING_NAME_TEXT).toBe(SITE.brand.name);
    const wordmark = container.querySelector("h1 svg[data-particle-path]");
    expect(wordmark).toHaveAttribute("aria-hidden", "true");
    expect(wordmark).toHaveAttribute("viewBox", LETTERING_VIEWBOX);
    // Un trazado por letra: unidos en uno solo, las curvas relativas se arrastran de una letra a la siguiente
    const paths = [...(wordmark?.querySelectorAll("path") ?? [])].map((path) => path.getAttribute("d"));
    expect(paths).toEqual([...LETTERING_PREFIX_PATHS, ...LETTERING_NAME_PATHS]);
    expect(LETTERING_PREFIX_PATHS).toHaveLength(9);
    for (const d of paths) expect(d?.length).toBeGreaterThan(30);
  });

  it("CA-10: el neón del techo, abajo y detrás de las tarjetas, es decorativo: cuatro rectángulos y su copia encendida", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);

    const neon = container.querySelector("svg[class*='neonField']");
    expect(neon).toHaveAttribute("aria-hidden", "true");
    expect(neon?.querySelectorAll("rect")).toHaveLength(8);
  });

  it("cada tarjeta lleva su número (decorativo: el lector oye solo el texto)", () => {
    renderWithProviders(<HeroLaSerena />);

    const numbers = screen.getAllByRole("listitem").map((item) => item.querySelector("[aria-hidden='true']")?.textContent);
    expect(numbers).toEqual(["01", "02", "03"]);
  });

  it("CA-10: el título, el subtítulo y las tres tarjetas salen de los textos editables (RNF-DATOS-002)", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);

    expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(TEXTS["heroserena.titulo"].default);
    const spoken = audible(container);
    for (const key of ["heroserena.punto1", "heroserena.punto2", "heroserena.punto3"] as const) expect(spoken).toContain(TEXTS[key].default);
    expect(screen.getAllByRole("listitem")).toHaveLength(3);
  });

  it("CA-10: el subtítulo arranca sin letras escritas, pero el lector de pantalla lo oye entero una sola vez", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);
    const subtitle = TEXTS["heroserena.subtitulo"].default;

    expect(audible(container).split(subtitle)).toHaveLength(2);
    const typed = container.querySelector("p [aria-hidden='true']:not([class*='Ghost'])");
    expect(typed?.textContent).toBe("");
  });

  it("CA-10: con movimiento hay lienzo de partículas e indicador de scroll, ambos decorativos", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);

    expect(container.querySelector("canvas")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("svg rect")?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("CA-10, RNF-A11Y-003: con «reducir movimiento» no hay partículas ni indicador, y el subtítulo está completo", () => {
    state.reducedMotion = true;
    const { container } = renderWithProviders(<HeroLaSerena />);

    expect(container.querySelector("canvas")).toBeNull();
    expect(screen.queryByText("Desliza para descubrir")).toBeNull();
    expect(screen.getByText(TEXTS["heroserena.subtitulo"].default).tagName).toBe("P");
    expect(container.querySelector("section")?.className).toMatch(/static/);
  });

  it("los dos carruseles se montan cuando el navegador queda libre, son decorativos y repiten las fotos para dar la vuelta sin salto", async () => {
    const { container } = renderWithProviders(<HeroLaSerena />);

    // Se montan después de la carga (TBT): al principio no están.
    expect(container.querySelectorAll("[class*='railTrack']")).toHaveLength(0);
    await waitFor(() => expect(container.querySelectorAll("[class*='railTrack']")).toHaveLength(2), { timeout: 3000 });
    const rails = container.querySelectorAll("[class*='railTrack']");
    expect(rails).toHaveLength(2);
    rails.forEach((rail) => {
      expect(rail.closest("[aria-hidden='true']")).not.toBeNull();
      const images = rail.querySelectorAll("img");
      expect(images).toHaveLength(LA_SERENA_PHOTOS.length * 2);
      images.forEach((image) => expect(image).toHaveAttribute("alt", ""));
    });
  });

  it("CA-10: los carruseles entran quietos: sin el aviso de que la zona blanca terminó de estrecharse, el CSS los deja en pausa", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);
    const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "HeroLaSerena.module.css"), "utf8");

    expect(container.querySelector("[class*='stage']")).not.toHaveAttribute("data-rails-settled", "1");
    expect(css).toMatch(/\.stage:not\(\[data-rails-settled="1"\]\)\s+\.railTrack/);
  });

  it("RNF-A11Y-003: un botón pausa y reanuda las fotos", async () => {
    const { container } = renderWithProviders(<HeroLaSerena />);
    await waitFor(() => expect(container.querySelectorAll("[class*='railTrack']")).toHaveLength(2), { timeout: 3000 });

    const button = screen.getByRole("button", { name: "Pausar las fotos" });
    fireEvent.click(button);
    expect(screen.getByRole("button", { name: "Reanudar las fotos" })).toHaveAttribute("aria-pressed", "true");
    container.querySelectorAll("[class*='railTrack']").forEach((rail) => expect(rail.className).toMatch(/paused/));
  });

  it("el botón de reserva abre AgendaPro de La Serena en otra pestaña", () => {
    renderWithProviders(<HeroLaSerena />);

    const book = screen.getByRole("link", { name: "Agendar Sesión" });
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("CLAUDE.md regla 6: nada escucha el evento de scroll ni lee window.lenis; el scroll llega como MotionValue", () => {
    const here = dirname(fileURLToPath(import.meta.url));
    for (const file of ["HeroLaSerena.tsx", "useBrandParticles.ts"]) {
      const source = readFileSync(resolve(here, file), "utf8");
      expect(source, file).not.toMatch(/addEventListener\(\s*["']scroll/);
      expect(source, file).not.toMatch(/window\.lenis/);
    }
  });
});
