import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config/constants";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-058: CTA1 con barras de luz hexagonales, foto enmarcada y botón de reserva; y su deuda técnica saldada.
const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

import { CTA1 } from "./CTA1";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "CTA1.module.css"), "utf8");
const source = readFileSync(resolve(here, "CTA1.tsx"), "utf8");
const renderCta = () =>
  renderWithProviders(
    <LenisContext value={null}>
      <CTA1 />
    </LenisContext>,
  );
const tokens = readFileSync(resolve(here, "../../../styles/tokens/colors.css"), "utf8");

describe("CTA1 (BR-058, HU-EXP-004 CA-10)", () => {
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

  it("CA-10: la foto está dentro de la figura blanca, que la recorta", () => {
    renderCta();

    expect(document.querySelector("[data-figure] picture img")).not.toBeNull();
    expect(css).toMatch(/\n\.imageHexagon\s*\{[^}]*clip-path:\s*polygon\(/);
  });

  it("CA-10: detrás de la foto hay rojo de marca sólido, no rojo translúcido sobre blanco", () => {
    const rule = css.match(/\n\.imageHexagonForeground\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(rule).toMatch(/background:\s*var\(--color-brand-primary\);/);
  });

  it("las barras de luz son decorativas y, con reducir movimiento, aparecen encendidas sin parpadeo", () => {
    state.reducedMotion = true;
    renderCta();

    const bars = document.querySelector("[data-light-bars]");
    expect(bars?.getAttribute("aria-hidden")).toBe("true");
    expect(bars?.getAttribute("style") ?? "").not.toMatch(/opacity/);
  });

  it("sin reducir movimiento, las barras arrancan apagadas para encenderse al entrar la sección", () => {
    renderCta();

    expect(document.querySelector("[data-light-bars]")?.getAttribute("style") ?? "").toMatch(/opacity:\s*0\.15/);
  });

  it("RNF-DATOS-001: el alt de la foto usa el nombre de la config, sin literal en el componente", () => {
    renderCta();

    expect(document.querySelector("[data-figure] img")?.getAttribute("alt")).toContain(SITE.name);
    expect(source).not.toMatch(/Royce|Barbería/);
  });

  it("ADR-002: ningún color escrito a mano en el CSS de CTA1", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });

  it("el will-change no es fijo: lo pone .isAnimating solo mientras hay scroll", () => {
    expect(css).not.toMatch(/will-changes*:/);
    expect(source).toMatch(/useLenisScrollActive\(\)\s*\?\s*"isAnimating"/);
  });

  it("sin CSS muerto: reglas que no apuntaban a nada", () => {
    expect(css).not.toMatch(/\.imageWrapper|\.content::before|background-size|background-position/);
  });

  it("el foco del botón principal se dibuja fuera del chaflán, que lo recortaría", () => {
    expect(css).toMatch(/\.magnet:has\(:focus-visible\)\s*\{[^}]*outline:\s*3px solid/);
  });

  it("CP-A11Y-004: el texto blanco sobre el hexágono rojo cumple 4,5:1", () => {
    const hex = (name: string) => tokens.match(new RegExp(`--${name}:\\s*#([0-9a-fA-F]{6})`))?.[1] ?? "";
    const lum = (h: string) => {
      const [r, g, b] = [0, 2, 4].map((i) => {
        const s = Number.parseInt(h.slice(i, i + 2), 16) / 255;
        return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
      });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const ratio = (lum(hex("color-brand-white")) + 0.05) / (lum(hex("color-accent-500")) + 0.05);

    expect(ratio).toBeGreaterThanOrEqual(4.5);
  });
});
