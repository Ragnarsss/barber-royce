import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LenisContext } from "@/contexts/lenisContextValue";
import { Navbar } from "./Navbar";

const renderNavbar = () =>
  renderWithProviders(
    <LenisContext value={null}>
      <Navbar />
    </LenisContext>,
  );

describe("Navbar: menú móvil (BR-085, RNF-A11Y-002)", () => {
  it("cerrado, el menú es inerte: sus enlaces no reciben foco ni los lee un lector de pantalla", () => {
    renderNavbar();

    expect(document.getElementById("mobile-navigation")).toHaveAttribute("inert");
  });

  it("abierto, el menú deja de ser inerte", () => {
    renderNavbar();

    fireEvent.click(screen.getByRole("button", { name: "Abrir menú" }));

    expect(document.getElementById("mobile-navigation")).not.toHaveAttribute("inert");
  });
});
