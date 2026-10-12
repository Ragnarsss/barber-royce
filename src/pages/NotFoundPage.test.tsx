import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/renderWithProviders";
import { BOOKING } from "@/config/constants";
import { NotFoundPage } from "./NotFoundPage";

// Reproduce la ruta comodín de App.tsx sin cargar Lenis ni el layout.
const renderAt = (route: string) =>
  renderWithProviders(
    <Routes>
      <Route path="/" element={<p>Inicio</p>} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>,
    { route },
  );

describe("NotFoundPage (BR-003, CP-NAV-002)", () => {
  it("HU-EXP-003 CA-02: una ruta inexistente muestra la página no encontrada", () => {
    renderAt("/esta-ruta-no-existe");

    expect(screen.getByRole("heading", { level: 1, name: "Esta página no existe" })).toBeInTheDocument();
  });

  it("HU-EXP-003 CA-02: ofrece volver al inicio con un enlace interno", () => {
    renderAt("/no-existe");

    expect(screen.getByRole("link", { name: /volver al inicio/i })).toHaveAttribute("href", "/");
  });

  it("RF-RES-001: el botón de reserva abre AgendaPro en pestaña nueva con rel seguro", () => {
    renderAt("/no-existe");

    const booking = screen.getByRole("link", { name: /reservar hora/i });
    expect(booking).toHaveAttribute("href", BOOKING.url);
    expect(booking).toHaveAttribute("target", "_blank");
    expect(booking).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("no se muestra en una ruta que sí existe", () => {
    renderAt("/");

    expect(screen.getByText("Inicio")).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: "Esta página no existe" })).not.toBeInTheDocument();
  });
});
