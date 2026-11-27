import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { BranchProvider } from "@/branch/BranchProvider";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LenisContext } from "@/contexts/lenisContextValue";
import { ROUTES } from "@/config/routes";
// Las secciones de la home de Coquimbo necesitan IntersectionObserver y scroll: aquí solo importa la cabecera de la página.
vi.mock("../components/sections/Benefits/Benefits", () => ({ Benefits: () => null }));
vi.mock("../components/sections/CTA1/CTA1", () => ({ CTA1: () => null }));
vi.mock("../components/sections/CTA2/CTA2", () => ({ CTA2: () => null }));
vi.mock("../components/sections/Features/Features", () => ({ Features: () => null }));
vi.mock("../components/sections/Hero/Hero", () => ({ Hero: () => null }));
// El hero de La Serena es una secuencia atada al scroll (BR-114): lo prueba HeroLaSerena.test.tsx.
vi.mock("../components/sections/HeroLaSerena/HeroLaSerena", () => ({ HeroLaSerena: () => null }));
vi.mock("../components/sections/Reviews/Reviews", () => ({ Reviews: () => null }));
vi.mock("../components/sections/SocialProof1/SocialProof1", () => ({ SocialProof1: () => null }));
vi.mock("../components/sections/SocialProof2/SocialProof2", () => ({ SocialProof2: () => null }));
vi.mock("@/components/common/BackToTop/BackToTop", () => ({ BackToTop: () => null }));

import { MemoryRouter, Route, Routes } from "react-router-dom";
import { BranchPickerPage } from "./BranchPickerPage";
import { HomePage } from "./HomePage";
import { LaSerenaPage } from "./LaSerenaPage";

// BR-106 (RF-SUC-002, RF-SUC-004, RNF-SEO-001): cada portada declara su título, su descripción y los datos
// estructurados de su sucursal; el código de La Serena no viaja con Coquimbo.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file: string) => readFileSync(resolve(src, file), "utf8");

const SCRIPTS = 'script[type="application/ld+json"]';

async function headOf(page: React.ReactElement, title: string) {
  renderWithProviders(<LenisContext value={null}>{page}</LenisContext>);
  await waitFor(() => expect(document.title).toBe(title));
  await waitFor(() => expect(document.querySelectorAll(SCRIPTS).length).toBeGreaterThan(0));
  return { jsonLd: [...document.querySelectorAll(SCRIPTS)].map((script) => script.textContent).join(" ") };
}

describe("portadas (BR-106)", () => {
  it("CA-01, CP-SUC-004: `/` usa el título de ROUTES.home y declara las dos sucursales", async () => {
    const { jsonLd } = await headOf(<BranchPickerPage />, ROUTES.home.title);

    expect(jsonLd).toContain("barberia-royce-coquimbo");
    expect(jsonLd).toContain("barberia-royce-la-serena");
    expect(screen.getAllByRole("link").length).toBeGreaterThanOrEqual(2);
  });

  it("/la-serena usa su título y declara solo su sucursal", async () => {
    const { jsonLd } = await headOf(<LaSerenaPage />, ROUTES.laSerena.title);

    expect(jsonLd).toContain("barberia-royce-la-serena");
    expect(jsonLd).not.toContain("barberia-royce-coquimbo");
  });

  it("/coquimbo usa su título y declara solo su sucursal", async () => {
    const { jsonLd } = await headOf(<HomePage />, ROUTES.coquimbo.title);

    expect(jsonLd).toContain("barberia-royce-coquimbo");
    expect(jsonLd).not.toContain("barberia-royce-la-serena");
  });

  it("CA-03, HU-SUC-002 CA-07: la portada de La Serena se carga con lazy y ninguna página de Coquimbo la importa", () => {
    expect(read("App.tsx")).toMatch(/lazy\(\(\) => import\("\.\/pages\/LaSerenaPage"\)/);
    expect(read("App.tsx")).not.toMatch(/^import .*LaSerenaPage/m);
    for (const file of ["pages/HomePage.tsx", "pages/BranchPickerPage.tsx"]) {
      expect(read(file)).not.toMatch(/HeroLaSerena|LaSerenaPage/);
    }
  });
});

// HU-SUC-001 (decisión del usuario, 2026-11-23): la sucursal se elige una sola vez; después, `/` lleva a su portada.
describe("`/` tras elegir sucursal (BR-106)", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.branch;
  });

  const renderAtRoot = () =>
    render(
      <HelmetProvider>
        <MemoryRouter initialEntries={["/"]}>
          <BranchProvider>
            <Routes>
              <Route index element={<BranchPickerPage />} />
              <Route path="la-serena" element={<p>portada de La Serena</p>} />
              <Route path="coquimbo" element={<p>portada de Coquimbo</p>} />
            </Routes>
          </BranchProvider>
        </MemoryRouter>
      </HelmetProvider>,
    );

  it("quien nunca eligió ve las dos mitades", () => {
    renderAtRoot();

    expect(screen.getByRole("link", { name: "La Serena" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Coquimbo" })).toBeInTheDocument();
  });

  it.each([
    ["la-serena", "portada de La Serena"],
    ["coquimbo", "portada de Coquimbo"],
  ])("quien ya eligió %s pasa directo a su portada, sin ver el selector", (branch, text) => {
    localStorage.setItem("royce:branch", branch);
    renderAtRoot();

    expect(screen.getByText(text)).toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2, name: "Coquimbo" })).toBeNull();
  });
});
