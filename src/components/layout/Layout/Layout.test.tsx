import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LenisContext } from "@/contexts/lenisContextValue";
import { Layout } from "./Layout";

// BR-106: la portada para elegir sucursal (`/`) no lleva barra de navegación; las demás páginas sí.
const renderAt = (route: string) =>
  renderWithProviders(
    <LenisContext value={null}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<p>selector</p>} />
          <Route path="servicios" element={<p>servicios</p>} />
        </Route>
      </Routes>
    </LenisContext>,
    { route },
  );

describe("Layout (BR-106)", () => {
  it("en `/` no hay barra de navegación", () => {
    renderAt("/");

    expect(screen.getByText("selector")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Navegación principal" })).toBeNull();
  });

  it("en las demás páginas sí", () => {
    renderAt("/servicios");

    expect(screen.getByRole("navigation", { name: "Navegación principal" })).toBeInTheDocument();
  });
});
