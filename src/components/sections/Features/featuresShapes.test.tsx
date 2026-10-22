import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-096 (HU-EXP-004 CA-38): los dos polígonos decorativos de «Innovación y calidad» pasan de `::before`/`::after`
// casi invisibles a SVG con un trazo que se dibuja al entrar la sección.
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});

import { Features } from "./Features";

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "Features.module.css"), "utf8");

describe("Features: polígonos que se dibujan (BR-096, HU-EXP-004 CA-38)", () => {
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

  it("CA-38: hay dos figuras decorativas SVG de pentágono, ocultas para el lector de pantalla", () => {
    renderWithProviders(<Features />);

    const shapes = document.querySelectorAll("section#features > [data-edge-shape] svg");
    expect(shapes).toHaveLength(2);
    for (const svg of shapes) {
      expect(svg.getAttribute("aria-hidden")).toBe("true");
      expect(svg.querySelectorAll("polygon")).toHaveLength(1);
    }
  });

  it("CA-38: el CSS ya no las dibuja con `clip-path` en `::before` y `::after`", () => {
    expect(css).not.toMatch(/\.features::(before|after)/);
    expect(css).not.toMatch(/clip-path:\s*polygon\(50% 0%, 100% 38%/);
  });

  it("CA-38: el contenido va por encima de la decoración", () => {
    // La decoración va en z-index 0; el contenedor, positioned, con uno mayor
    expect(css).toMatch(/\.container\s*\{[^}]*position:\s*relative;[^}]*z-index:\s*[1-9]/);
    expect(css).toMatch(/\.shapeTop,\s*\.shapeBottom\s*\{[^}]*z-index:\s*0/);
  });
});
