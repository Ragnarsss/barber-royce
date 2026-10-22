import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-096 (HU-EXP-004 CA-38): los dos polígonos decorativos de las reseñas pasan de `::before`/`::after` casi
// invisibles a SVG con un trazo que se dibuja al entrar la sección.
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});

import { Reviews } from "./Reviews";

const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "Reviews.module.css"), "utf8");

describe("Reviews: polígonos que se dibujan (BR-096, HU-EXP-004 CA-38)", () => {
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

  it("CA-38: hay dos figuras decorativas SVG (un octágono y un hexágono), ocultas para el lector de pantalla", () => {
    renderWithProviders(<Reviews />);

    const shapes = document.querySelectorAll("section#reviews > [data-edge-shape] svg");
    expect(shapes).toHaveLength(2);
    const vertices = [...shapes].map((svg) => svg.querySelector("polygon")?.getAttribute("points")?.split(" ").length);
    expect(vertices.sort()).toEqual([6, 8]);
    for (const svg of shapes) expect(svg.getAttribute("aria-hidden")).toBe("true");
  });

  it("CA-38: el CSS ya no las dibuja con `clip-path` en `::before` y `::after`", () => {
    expect(css).not.toMatch(/\.reviews::(before|after)/);
  });
});
