import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { featuresList } from "@/data/featuresData";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-072 (HU-EXP-004 CA-23): «Innovación y calidad» con tarjetas de vidrio y carrusel con snap en móvil.
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});

import { Features } from "./Features";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "Features.module.css"), "utf8");
const source = readFileSync(resolve(here, "Features.tsx"), "utf8");
const rule = (selector: RegExp) => css.match(new RegExp(`\\n${selector.source}\\s*\\{([^}]*)\\}`))?.[1] ?? "";
const mobile = css.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

describe("Features: tarjetas de vidrio (BR-072, HU-EXP-004 CA-23)", () => {
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

  it("cada característica es un <article> con su ícono, su título y su descripción", () => {
    renderWithProviders(<Features />);

    const cards = document.querySelectorAll("article");
    expect(cards).toHaveLength(featuresList.length);
    expect(cards[0].querySelector("h3")?.textContent).toBe(featuresList[0].title);
    expect(cards[0].textContent).toContain(featuresList[0].description);
    expect(cards[0].querySelector("svg")).not.toBeNull();
  });

  it("no usa el componente Card", () => {
    expect(source).not.toContain("@/components/ui/card");
  });

  it("CA-23: la tarjeta usa el borde, el vidrio y el recorte de los tokens compartidos", () => {
    expect(rule(/\.card/)).toMatch(/background:\s*var\(--card-edge\)/);
    expect(rule(/\.card/)).toMatch(/clip-path:\s*var\(--card-clip\)/);
    expect(rule(/\.card::before/)).toMatch(/background:\s*var\(--card-glass\)/);
    expect(rule(/\.card::before/)).toMatch(/clip-path:\s*var\(--card-clip\)/);
  });

  it("CA-23: el título y la descripción son blancos sobre el vidrio; el ícono, blanco sobre un cuadrado rojo", () => {
    expect(rule(/\.cardTitle/)).toMatch(/color:\s*var\(--color-brand-white\)/);
    expect(rule(/\.cardDescription/)).toMatch(/color:\s*var\(--color-brand-white\)/);
    expect(rule(/\.cardIcon/)).toMatch(/background:\s*var\(--color-brand-primary\)/);
    expect(rule(/\.cardIcon/)).toMatch(/color:\s*var\(--color-brand-white\)/);
  });

  it("CA-23: el borde se enciende en rojo al pasar el ratón, y la luz que barre solo existe con ratón", () => {
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[^@]*\.card:hover\s*\{[^}]*background:\s*var\(--card-edge-hot\)/);
    expect(css).toMatch(/@media \(hover: hover\) and \(pointer: fine\)\s*\{[^@]*\.card:hover::after/);
  });

  it("CP-A11Y-003: con reducir movimiento no hay luz que barra ni transición", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.card,\s*\.cardIcon\s*\{[^}]*transition:\s*none/);
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.card::after\s*\{[^}]*display:\s*none/);
  });

  it("ADR-002: ni un color escrito a mano en toda la sección", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});

describe("Features en móvil: carrusel (BR-072, BR-070)", () => {
  it("el carrusel lleva el nombre de la sección para los lectores de pantalla", () => {
    expect(source).toContain('carouselLabel="Innovación y calidad"');
  });

  it("el contenedor ocupa todo el ancho: con `margin: 0 auto` se estiraba más allá de la pantalla", () => {
    expect(mobile).toMatch(/\.container\s*\{[^}]*width:\s*100%/);
  });

  it("la fila define el relleno lateral del contenedor para llegar hasta el borde", () => {
    expect(mobile).toMatch(/\.grid\s*\{[^}]*--carousel-gutter:\s*1\.5rem/);
  });

  it("sin el parallax del contenedor en móvil: ninguna tarjeta queda cortada por el borde de la sección", () => {
    expect(mobile).toMatch(/\.container\s*\{[^}]*transform:\s*none\s*!important/);
  });
});
