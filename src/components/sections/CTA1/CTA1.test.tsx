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
import { CTA_ZOOM, CTA_ZOOM_ORIGIN, CTA_ZOOM_WINDOW } from "./ctaZoom";

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

// BR-061 (HU-EXP-004 CA-13): vista móvil fiel al Figma «CTA 1 Mobile». Solo cambia ≤ 768 px; el escritorio queda igual.
describe("CTA1 en móvil (BR-061, HU-EXP-004 CA-13)", () => {
  const mobile = css.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";
  const rule = (selector: RegExp) => mobile.match(new RegExp(`\\n\\s*${selector.source}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

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

  it("CA-13: la primera frase del subtítulo va en negrita y el texto sigue completo", () => {
    renderCta();

    const subtitle = document.querySelector("p[class*='subtitle']") as HTMLElement;
    expect(subtitle.querySelector("strong")?.textContent).toBe("¿Listo para un cambio que te defina?");
    expect(subtitle.textContent).toMatch(/^¿Listo para un cambio que te defina\? Agenda tu cita/);
  });

  it("CA-13: la negrita es solo de móvil; en escritorio la primera frase pesa como el resto", () => {
    expect(css).toMatch(/\n\.lead\s*\{[^}]*font-weight:\s*inherit/);
    expect(rule(/\.lead/)).toMatch(/font-weight:\s*700/);
  });

  it("CA-13: en móvil se ocultan los hexágonos y las barras de luz; el fondo es charcoal", () => {
    const hidden = mobile.match(/([^{}]*)\{\s*display:\s*none;?\s*\}/)?.[1] ?? "";

    for (const name of ["textHexagon", "textHexagonBackground", "imageHexagonBackground", "imageHexagonForeground", "lightBars"]) {
      expect(hidden).toMatch(new RegExp(`\\.${name}\\b`));
    }
    expect(css).toMatch(/\n\.cta\s*\{[^}]*background:\s*var\(--color-brand-section-bg\)/);
  });

  it("CA-13: la foto va detrás del texto, a la derecha y sin recorte de figura ni parallax", () => {
    const figure = rule(/\.imageHexagon/);

    expect(figure).toMatch(/inset:\s*0/);
    expect(figure).toMatch(/clip-path:\s*none/);
    expect(figure).toMatch(/transform:\s*none\s*!important/);
    expect(rule(/\.ctaImage/)).toMatch(/right:\s*-\d+%/);
    // Sin `max-width: none` la regla global de imágenes la limita al 100 % y el rostro no se agranda.
    expect(rule(/\.ctaImage/)).toMatch(/max-width:\s*none/);
  });

  it("CA-13: en móvil la foto es la del Hero de escritorio, en el mismo <picture> y con los mismos archivos", () => {
    renderCta();

    const source = document.querySelector("[data-figure] picture source[media='(max-width: 768px)']");
    expect(source?.getAttribute("srcset")).toMatch(/hero_model_left_profile_842w\S*\.webp 842w/);
    expect(source?.getAttribute("srcset")).toMatch(/hero_model_left_profile_1684w\S*\.webp 1684w/);
  });

  it("CA-13: el texto va alineado a la izquierda, con una línea blanca bajo el título", () => {
    expect(rule(/\.textContent/)).toMatch(/text-align:\s*left/);
    expect(rule(/\.title::after/)).toMatch(/background:\s*var\(--color-brand-white\)/);
  });

  it("CA-13: el botón de reservar sigue siendo blanco con ícono rojo y 'Conocer Servicios' se mantiene", () => {
    renderCta();

    expect(document.querySelector("a[class*='ctaButton'] svg")).not.toBeNull();
    expect(css).toMatch(/\n\.ctaButton svg\s*\{[^}]*color:\s*var\(--color-brand-primary\)/);
    expect(document.body.textContent).toContain("Conocer Servicios");
  });

  it("ADR-002: el bloque móvil no trae colores escritos a mano", () => {
    expect(mobile.length).toBeGreaterThan(0);
    expect(mobile).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});

// BR-079 (HU-EXP-004 CA-30): zoom-in marcado de la foto con el scroll.
describe("CTA1: zoom-in de la foto con el scroll (BR-079, HU-EXP-004 CA-30)", () => {
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

  it("CA-30: el zoom es claro (al menos un 30 %) y no tanto que pixele la foto", () => {
    expect(CTA_ZOOM.DESKTOP).toBeGreaterThanOrEqual(1.3);
    expect(CTA_ZOOM.MOBILE).toBeGreaterThanOrEqual(1.3);
    expect(CTA_ZOOM.DESKTOP).toBeLessThanOrEqual(1.8);
    expect(CTA_ZOOM.MOBILE).toBeLessThanOrEqual(1.8);
  });

  it("el zoom ocurre mientras la sección está en pantalla, no antes ni después", () => {
    const [from, to] = CTA_ZOOM_WINDOW;

    expect(from).toBeGreaterThan(0);
    expect(to).toBeLessThan(1);
    expect(to).toBeGreaterThan(from);
  });

  it("el zoom parte del rostro en cada tamaño (un punto de apoyo dentro de la foto)", () => {
    for (const origin of [CTA_ZOOM_ORIGIN.DESKTOP, CTA_ZOOM_ORIGIN.MOBILE]) {
      const [x, y] = origin.split(" ").map((value) => Number.parseFloat(value));
      expect(x).toBeGreaterThan(0);
      expect(x).toBeLessThan(100);
      expect(y).toBeGreaterThan(0);
      expect(y).toBeLessThan(100);
    }
  });

  it("CA-30: la foto recibe un `scale` por un MotionValue (sin setState por scroll) y su punto de apoyo", () => {
    expect(source).toMatch(/useTransform\(scrollYProgress, CTA_ZOOM_WINDOW, \[1, isWide \? CTA_ZOOM\.DESKTOP : CTA_ZOOM\.MOBILE\]\)/);
    expect(source).toMatch(/scale: zoom/);
    expect(source).toMatch(/style=\{imageStyle\}/);
  });

  it("CP-A11Y-003: con reducir movimiento la foto no recibe estilo de zoom", () => {
    state.reducedMotion = true;
    renderCta();

    const picture = document.querySelector("[data-figure] picture")!;
    expect(picture.getAttribute("style") ?? "").not.toMatch(/scale/);
  });
});
