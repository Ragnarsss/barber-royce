import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import type { ReactElement } from "react";
import { LenisContext } from "@/contexts/lenisContextValue";
import { TEXTS, type TextKey } from "@/content/texts";
import { renderWithProviders } from "./renderWithProviders";

// El contenido «de la hoja» cambia en cada prueba: el módulo virtual lee `state.texts` en el momento de renderizar.
const state = vi.hoisted(() => ({ texts: {} as Record<string, string> }));
vi.mock("virtual:site-content", () => ({
  default: {
    services: [],
    products: [],
    team: [],
    faq: [],
    get texts() {
      return state.texts;
    },
  },
}));

import { Benefits } from "@/components/sections/Benefits/Benefits";
import { CTA1 } from "@/components/sections/CTA1/CTA1";
import { CTA2 } from "@/components/sections/CTA2/CTA2";
import { Features } from "@/components/sections/Features/Features";
import { Hero } from "@/components/sections/Hero/Hero";
import { Reviews } from "@/components/sections/Reviews/Reviews";
import { SocialProof1 } from "@/components/sections/SocialProof1/SocialProof1";
import { SocialProof2 } from "@/components/sections/SocialProof2/SocialProof2";

const keys = Object.keys(TEXTS) as TextKey[];
const marker = (key: string) => `TEXTO-DE-LA-HOJA[${key}]`;
const occurrences = (text: string, part: string) => text.split(part).length - 1;

// La home entera, como la monta HomePage.
const home: ReactElement = (
  <LenisContext.Provider value={{ lenis: null, isReady: false }}>
    <Hero />
    <CTA1 />
    <SocialProof1 />
    <Benefits />
    <Reviews />
    <Features />
    <SocialProof2 />
    <CTA2 />
  </LenisContext.Provider>
);

const render = () => {
  renderWithProviders(home);
  return document.body.textContent ?? "";
};

describe("textos editables en la home (BR-042, HU-CNT-002 CA-01 y CA-02)", () => {
  beforeAll(() => {
    // framer-motion usa IntersectionObserver para `whileInView`; jsdom no lo trae.
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
    state.texts = {};
  });

  it("CA-02: sin textos en la hoja, cada texto de la home es el de siempre", () => {
    const page = render();

    for (const key of keys) expect(page, key).toContain(TEXTS[key].default);
  });

  it("CA-01: con un valor para cada clave, cada uno aparece exactamente una vez, en lugar del texto de siempre", () => {
    state.texts = Object.fromEntries(keys.map((key) => [key, marker(key)]));

    const page = render();

    for (const key of keys) {
      expect(occurrences(page, marker(key)), `${key} debe aparecer una vez`).toBe(1);
      expect(page, `${key}: el texto de siempre no debe quedar`).not.toContain(TEXTS[key].default);
    }
  });

  it("cambiar una sola clave no toca a las demás", () => {
    state.texts = { "cta2.titulo": marker("cta2.titulo") };

    const page = render();

    expect(page).toContain(marker("cta2.titulo"));
    for (const key of keys.filter((k) => k !== "cta2.titulo")) expect(page, key).toContain(TEXTS[key].default);
  });

  it("RN-01: un texto con HTML se muestra como texto, no se interpreta", () => {
    state.texts = { "hero.titulo": "<img src=x onerror=alert(1)>Hola" };

    const page = render();

    expect(page).toContain("<img src=x onerror=alert(1)>Hola");
    expect(document.querySelector("img[onerror]")).toBeNull();
  });

  it("los títulos de dos líneas conservan el salto de línea de la hoja", () => {
    state.texts = { "hero.titulo": "Línea uno\nLínea dos" };

    render();

    expect(document.querySelector("h1")?.textContent).toBe("Línea uno\nLínea dos");
  });
});
