import { beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { NEON_SQUARES } from "./heroLaSerenaShapes";

const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

import { HeroLaSerena } from "./HeroLaSerena";

// BR-106 (HU-SUC-002 CA-04, CP-A11Y-003): cuatro cuadrados que se dibujan desde cero; con «reducir movimiento», completos.
describe("HeroLaSerena (BR-106)", () => {
  beforeEach(() => {
    state.reducedMotion = false;
  });

  it("CA-04: dibuja cuatro cuadrados de neón, cada uno con su propio desfase", () => {
    expect(NEON_SQUARES).toHaveLength(4);
    expect(new Set(NEON_SQUARES.map((square) => square.delay)).size).toBe(4);
    expect(NEON_SQUARES.map((square) => square.delay)).toEqual([...NEON_SQUARES.map((square) => square.delay)].sort((a, b) => a - b));
  });

  it("CA-04: con movimiento, el trazo de cada cuadrado arranca sin dibujar (pathLength 0)", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);

    const squares = container.querySelectorAll("polygon");
    expect(squares).toHaveLength(4);
    squares.forEach((polygon) => expect(polygon.getAttribute("stroke-dasharray")).toBe("0 1"));
  });

  it("CA-04, CP-A11Y-003: con «reducir movimiento», los cuadrados son polígonos comunes, dibujados completos", () => {
    state.reducedMotion = true;
    const { container } = renderWithProviders(<HeroLaSerena />);

    const squares = container.querySelectorAll("polygon");
    expect(squares).toHaveLength(4);
    squares.forEach((polygon) => expect(polygon.hasAttribute("pathLength")).toBe(false));
  });

  it("el título es el único h1 y el botón de reserva abre AgendaPro de La Serena en otra pestaña", () => {
    renderWithProviders(<HeroLaSerena />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    const book = screen.getByRole("link", { name: "Agendar Sesión" });
    expect(book).toHaveAttribute("target", "_blank");
    expect(book).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("las hojas y los cuadrados son decorativos", () => {
    const { container } = renderWithProviders(<HeroLaSerena />);

    container.querySelectorAll("svg").forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
  });
});
