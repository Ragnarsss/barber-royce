import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { SITE } from "@/config/constants";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-062: corte láser cinematográfico de SocialProof1 y su deuda saldada.
const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return { default: { services: [], products: [], team: [], faq: [], business: snapshot.business, locations: [], texts: {} } };
});
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

import { SocialProof1 } from "./SocialProof1";
import { BOLT } from "./laserCut";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "SocialProof1.module.css"), "utf8");
const source = readFileSync(resolve(here, "SocialProof1.tsx"), "utf8");

const renderSection = () =>
  renderWithProviders(
    <LenisContext value={null}>
      <SocialProof1 />
    </LenisContext>,
  );

describe("SocialProof1: corte láser (BR-062, HU-EXP-004 CA-14)", () => {
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
    vi.stubGlobal("matchMedia", (query: string) => ({ matches: query === "(min-width: 769px)", media: query, addEventListener() {}, removeEventListener() {} }));
    // jsdom no trae la API de animaciones web; framer-motion la usa para las transformaciones ligadas al scroll.
    if (!Element.prototype.animate) {
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
    }
  });

  beforeEach(() => {
    state.reducedMotion = false;
  });

  it("CA-14: la foto y la tarjeta tienen su panel de corte", () => {
    renderSection();

    expect(document.querySelector('[data-cut="photo"]')).not.toBeNull();
    expect(document.querySelector('[data-cut="card"]')).not.toBeNull();
  });

  it("los rayos son pistas diagonales con un haz cada una", () => {
    renderSection();

    const tracks = document.querySelectorAll("[data-laser-track]");
    expect(tracks).toHaveLength(BOLT.TRACKS);
    for (const track of tracks) expect(track.children).toHaveLength(1);
  });

  it("regresión del bug: la pista no lleva transform en línea, así su rotación del CSS no se pisa", () => {
    renderSection();

    for (const track of document.querySelectorAll("[data-laser-track]")) expect(track.getAttribute("style")).toBeNull();
    for (const n of [1, 2, 3]) expect(css).toMatch(new RegExp(`\\.laserTrack${n}\\s*\\{[^}]*transform:\\s*rotate\\(`));
  });

  it("CP-A11Y-003: con reducir movimiento, todo revelado: sin paneles de corte, sin haces ni destello", () => {
    state.reducedMotion = true;
    renderSection();

    expect(document.querySelector("[data-cut]")).toBeNull();
    for (const track of document.querySelectorAll("[data-laser-track]")) expect(track.children).toHaveLength(0);
    expect(document.querySelector("[data-title-underline]")?.getAttribute("style") ?? "").not.toMatch(/scale/);
  });

  it("RNF-DATOS-001: la marca sale de la config en la cita y en el alt, sin literal en el componente", () => {
    renderSection();

    expect(document.body.textContent).toContain(`confío en ${SITE.name}`);
    expect(document.querySelector("img")?.getAttribute("alt")).toContain(SITE.name);
    expect(source).not.toMatch(/Royce|Barbería/);
  });

  it("ADR-002: sin colores escritos a mano ni will-change fijo", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
    expect(css).not.toMatch(/will-change\s*:/);
  });

  it("CP-A11Y-004: el distintivo de la tarjeta ya no usa un gris claro sin contraste", () => {
    const rule = css.match(/\n\.clientBadge\s*\{([^}]*)\}/)?.[1] ?? "";

    expect(rule).toMatch(/color:\s*var\(--color-neutral-600\)/);
  });
});
