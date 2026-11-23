import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BranchProvider } from "@/branch/BranchProvider";
import { BranchVines } from "./BranchVines";
import { VINE_BOX, VINE_LEAVES, VINE_LEAF, VINE_STEM } from "./SideVines/vineShapes";

// BR-108 (HU-SUC-002 CA-06 y CA-07, CP-SUC-007): con La Serena, las enredaderas son decorativas y completas con reducir
// movimiento; con Coquimbo no se renderizan ni se descargan.
const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

/** El carrusel se pide con import dinámico: con toda la suite corriendo en paralelo puede tardar más que el segundo por defecto */
const LAZY_MS = 5000;

const here = dirname(fileURLToPath(import.meta.url));
const read = (file: string) => readFileSync(resolve(here, file), "utf8");

const renderAt = (route: string, sides: "left" | "right" | "both" = "both") =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <BranchProvider>
        <BranchVines sides={sides}>
          <section data-testid="section">contenido</section>
        </BranchVines>
      </BranchProvider>
    </MemoryRouter>,
  );

describe("BranchVines (BR-108)", () => {
  afterEach(() => {
    state.reducedMotion = false;
    localStorage.clear();
    delete document.documentElement.dataset.branch;
  });

  it("CA-06, CP-SUC-007: con La Serena, una enredadera por lado pedido, decorativas (aria-hidden)", async () => {
    const { container } = renderAt("/la-serena", "both");

    await waitFor(() => expect(container.querySelectorAll("svg")).toHaveLength(2), { timeout: LAZY_MS });
    container.querySelectorAll("svg").forEach((svg) => expect(svg.parentElement).toHaveAttribute("aria-hidden", "true"));
    expect(screen.getByTestId("section")).toBeInTheDocument();
  });

  it.each([
    ["left", 1],
    ["right", 1],
  ] as const)("con sides=%s hay una sola enredadera", async (sides, count) => {
    const { container } = renderAt("/la-serena", sides);

    await waitFor(() => expect(container.querySelectorAll("svg")).toHaveLength(count), { timeout: LAZY_MS });
  });

  it("CA-07: con Coquimbo no se renderiza ninguna enredadera y la sección queda igual", () => {
    const { container } = renderAt("/coquimbo", "both");

    expect(container.querySelectorAll("svg")).toHaveLength(0);
    expect(screen.getByTestId("section")).toBeInTheDocument();
  });

  it("CA-06: con «reducir movimiento», la enredadera se ve completa y quieta: el tallo entero y todas las hojas", async () => {
    state.reducedMotion = true;
    const { container } = renderAt("/la-serena", "left");

    await waitFor(() => expect(container.querySelectorAll("svg")).toHaveLength(1), { timeout: LAZY_MS });
    const stem = container.querySelector("path");
    expect(stem).toHaveAttribute("d", VINE_STEM);
    expect(stem?.hasAttribute("pathLength")).toBe(false);
    expect(container.querySelectorAll(`path[d="${VINE_LEAF}"]`)).toHaveLength(VINE_LEAVES.length);
  });

  it("con movimiento, el tallo arranca sin dibujar y las hojas, cerradas", async () => {
    const { container } = renderAt("/la-serena", "left");

    await waitFor(() => expect(container.querySelectorAll("svg")).toHaveLength(1), { timeout: LAZY_MS });
    expect(container.querySelector("path")?.getAttribute("stroke-dasharray")).toBe("0 1");
    expect(container.querySelectorAll(`path[d="${VINE_LEAF}"]`)).toHaveLength(VINE_LEAVES.length);
  });

  it("CA-07: el código de La Serena se carga con lazy y no hay import estático de SideVines", () => {
    const source = read("BranchVines.tsx");

    expect(source).toMatch(/lazy\(\(\) => import\("\.\/SideVines\/SideVines"\)/);
    expect(source).not.toMatch(/^import .*SideVines/m);
  });

  it("CP-PERF-006: sin estado ni escucha del scroll en la enredadera (todo es MotionValue)", () => {
    const source = read("SideVines/SideVines.tsx");

    expect(source).not.toMatch(/useState|addEventListener|onScroll/);
  });

  it("no recibe clics y su color sale de tokens", () => {
    const css = read("SideVines/SideVines.module.css");

    expect(css).toMatch(/\.vines\s*\{[^}]*pointer-events:\s*none/);
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,8}\b|rgba?\(/);
  });
});

describe("la geometría de la enredadera (BR-108)", () => {
  it("el tallo y la hoja son trazados no vacíos y la caja de referencia tiene tamaño", () => {
    expect(VINE_STEM.length).toBeGreaterThan(10);
    expect(VINE_LEAF.length).toBeGreaterThan(10);
    expect(VINE_BOX.width).toBeGreaterThan(0);
    expect(VINE_BOX.height).toBeGreaterThan(0);
  });

  it("las hojas nacen dentro de la caja, de arriba abajo y con un tamaño razonable", () => {
    VINE_LEAVES.forEach((leaf, index) => {
      expect(leaf.x).toBeGreaterThanOrEqual(0);
      expect(leaf.x).toBeLessThanOrEqual(VINE_BOX.width);
      expect(leaf.y).toBeGreaterThanOrEqual(0);
      expect(leaf.y).toBeLessThanOrEqual(VINE_BOX.height);
      expect(leaf.scale).toBeGreaterThan(0.2);
      expect(leaf.scale).toBeLessThanOrEqual(0.6);
      if (index > 0) expect(leaf.y).toBeGreaterThan(VINE_LEAVES[index - 1].y);
    });
  });

  it("las hojas alternan de lado del tallo", () => {
    const sides = VINE_LEAVES.map((leaf) => Math.sign(leaf.rotate));
    const switches = sides.filter((side, index) => index > 0 && side !== sides[index - 1]).length;

    expect(switches).toBeGreaterThanOrEqual(4);
  });
});
