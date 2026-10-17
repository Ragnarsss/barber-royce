import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { reviewsList } from "@/data/reviewsData";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-069 (HU-EXP-004 CA-20): las reseñas, en tarjetas de vidrio oscuro con esquinas cortadas, como las del Hero.
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});

import { Reviews } from "./Reviews";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "Reviews.module.css"), "utf8");
const source = readFileSync(resolve(here, "Reviews.tsx"), "utf8");
const rule = (selector: RegExp) => css.match(new RegExp(`\\n${selector.source}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("Reviews: tarjetas de vidrio (BR-069, HU-EXP-004 CA-20)", () => {
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

  it("cada reseña es un <article> con sus estrellas, su comentario y su autor", () => {
    renderWithProviders(<Reviews />);

    const cards = document.querySelectorAll("article");
    expect(cards).toHaveLength(reviewsList.length);
    expect(cards[0].textContent).toContain(reviewsList[0].name);
    expect(cards[0].textContent).toContain(reviewsList[0].comment);
    expect(cards[0].textContent).toContain("★".repeat(reviewsList[0].rating));
  });

  it("no usa el componente Card: sus clases de otro sistema de estilos no aportan nada", () => {
    expect(source).not.toContain("@/components/ui/card");
  });

  it("CA-20: la tarjeta usa el borde, el vidrio y el recorte de los tokens compartidos", () => {
    expect(rule(/\.card/)).toMatch(/background:\s*var\(--card-edge\)/);
    expect(rule(/\.card/)).toMatch(/clip-path:\s*var\(--card-clip\)/);
    expect(rule(/\.card::before/)).toMatch(/background:\s*var\(--card-glass\)/);
    expect(rule(/\.card::before/)).toMatch(/clip-path:\s*var\(--card-clip\)/);
  });

  it("CA-20: el comentario y el autor son blancos sobre el vidrio", () => {
    for (const selector of [/\.comment/, /\.author/]) {
      expect(rule(selector)).toMatch(/color:\s*var\(--color-brand-white\)/);
    }
  });

  it("CA-20: el borde se enciende en rojo al pasar el ratón, y la luz que barre solo existe con ratón", () => {
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[^@]*\.card:hover\s*\{[^}]*background:\s*var\(--card-edge-hot\)/);
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[^@]*\.card:hover::after/);
  });

  it("CP-A11Y-003: con reducir movimiento no hay luz que barra ni transición", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.card\s*\{[^}]*transition:\s*none/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.card::after\s*\{[^}]*display:\s*none/);
  });

  it("ADR-002: la tarjeta no trae colores escritos a mano ni el fondo blanco de antes", () => {
    const card = css.match(/\n\.card\s*\{[\s\S]*?\n\.rating\s*\{[\s\S]*?\n\}/)?.[0] ?? "";

    expect(card.length).toBeGreaterThan(0);
    expect(card).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
    expect(card).not.toMatch(/#fff|#ffffff|linear-gradient\(135deg/i);
  });
});
