import { describe, expect, it } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { LenisContext } from "@/contexts/lenisContextValue";
import { SITE } from "@/config/constants";
import { Navbar } from "./Navbar";

const renderNavbar = () =>
  renderWithProviders(
    <LenisContext value={null}>
      <Navbar />
    </LenisContext>,
  );

// El menú que controla el botón de la hamburguesa (aria-controls)
const getMobileMenu = () => {
  const button = screen.getByRole("button", { name: /menú/i });
  return document.getElementById(button.getAttribute("aria-controls") ?? "");
};

describe("Navbar: menú móvil (BR-085, RNF-A11Y-002)", () => {
  it("cerrado, el menú es inerte: sus enlaces no reciben foco ni los lee un lector de pantalla", () => {
    renderNavbar();

    expect(getMobileMenu()).toHaveAttribute("inert");
  });

  it("abierto deja de ser inerte, y al cerrarlo de nuevo vuelve a serlo", () => {
    renderNavbar();
    const button = screen.getByRole("button", { name: "Abrir menú" });

    fireEvent.click(button);
    expect(getMobileMenu()).not.toHaveAttribute("inert");

    fireEvent.click(screen.getByRole("button", { name: "Cerrar menú" }));
    expect(getMobileMenu()).toHaveAttribute("inert");
  });

  it("el menú no declara role=menu: sus enlaces no son menuitem y un lector de pantalla lo leería vacío", () => {
    renderNavbar();

    expect(getMobileMenu()).not.toHaveAttribute("role", "menu");
  });

  it("el alt del logo sale de SITE.name (RNF-DATOS-001)", () => {
    renderNavbar();

    expect(screen.getByAltText(SITE.name)).toBeInTheDocument();
  });
});
