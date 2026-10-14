import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config/constants";
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
    expect([...document.querySelectorAll("[data-benefit] strong")].map((s) => s.textContent)).toEqual([
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
});
