import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { BranchProvider } from "@/branch/BranchProvider";
import { LenisContext } from "@/contexts/lenisContextValue";
import { snapshot } from "@/content/snapshot";
import { TeamPage } from "./TeamPage";

// BR-107 (HU-SUC-002 CA-05 y CA-07, CP-SUC-006): con La Serena, /equipo es un carrusel con «Barbero N de M»; con Coquimbo,
// el panal de siempre; el código del carrusel no viaja con Coquimbo; los botones son de vidrio.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file: string) => readFileSync(resolve(src, file), "utf8");

const renderTeam = (route: string) =>
  render(
    <HelmetProvider>
      <MemoryRouter initialEntries={[route]}>
        <BranchProvider>
          <LenisContext value={null}>
            <TeamPage />
          </LenisContext>
        </BranchProvider>
      </MemoryRouter>
    </HelmetProvider>,
  );

describe("TeamPage por sucursal (BR-107)", () => {
  beforeEach(() => {
    // El carrusel observa qué tarjetas se ven con IntersectionObserver, que jsdom no trae
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        disconnect() {}
        unobserve() {}
      },
    );
  });

  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.branch;
    vi.unstubAllGlobals();
  });

  it("CA-05, CP-SUC-006: con La Serena, el equipo es un carrusel con «Barbero N de M»", async () => {
    renderTeam("/la-serena");
    const total = snapshot.team.length;

    await waitFor(() => expect(screen.getByRole("group", { name: `Barbero 1 de ${total}` })).toBeInTheDocument());
    expect(screen.getAllByRole("group", { name: /^Barbero \d+ de \d+$/ })).toHaveLength(total);
    expect(screen.getByRole("region", { name: "Equipo de La Serena" })).toBeInTheDocument();
  });

  it("CA-05: cada tarjeta muestra el nombre del barbero y abre su ficha", async () => {
    renderTeam("/la-serena");
    const first = snapshot.team[0];

    fireEvent.click(await screen.findByRole("button", { name: new RegExp(first.name) }));

    expect(await screen.findByRole("dialog")).toBeInTheDocument();
  });

  it("CA-05: con Coquimbo es el panal de siempre, sin carrusel", async () => {
    renderTeam("/coquimbo");

    await screen.findByRole("heading", { level: 1, name: "Nuestro equipo" });
    expect(screen.queryByRole("group", { name: /^Barbero \d+ de \d+$/ })).toBeNull();
    expect(screen.queryByRole("region", { name: "Equipo de La Serena" })).toBeNull();
  });

  it("CA-07: el carrusel se carga con lazy y TeamPage no lo importa de forma estática", () => {
    const page = read("pages/TeamPage.tsx");

    expect(page).toMatch(/lazy\(\(\) => import\("@\/components\/team\/TeamCarouselLaSerena"\)/);
    expect(page).not.toMatch(/^import .*TeamCarouselLaSerena/m);
  });

  it("CP-PERF-006: la vista no escucha el scroll ni guarda estado por él", () => {
    const view = read("components/team/TeamCarouselLaSerena.tsx");

    expect(view).not.toMatch(/addEventListener\(["']scroll|onScroll|useState/);
  });

  it("los botones son de vidrio gris semitransparente, con fondo sólido sin soporte o con menos transparencia", () => {
    const carousel = read("components/common/CardCarousel/CardCarousel.module.css");
    const tokens = read("styles/tokens/cards.css");

    expect(tokens).toMatch(/--glass-bg:/);
    expect(tokens).toMatch(/--glass-border:/);
    expect(carousel).toMatch(/\.glass \.arrow\s*\{[^}]*backdrop-filter:\s*blur\(/);
    expect(carousel).toMatch(/@supports not \(backdrop-filter/);
    expect(carousel).toMatch(/@media \(prefers-reduced-transparency: reduce\)/);
  });

  it("con «reducir movimiento» las tarjetas no cambian de escala", () => {
    const css = read("components/team/TeamCarouselLaSerena.module.css");

    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)[\s\S]*data-active="false"\]\s*\{\s*scale:\s*1;/);
  });
});
