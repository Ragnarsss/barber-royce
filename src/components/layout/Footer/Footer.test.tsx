import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { Footer } from "./Footer";
import { SITE } from "@/config/constants";
import { snapshot } from "@/content/snapshot";

describe("Footer: marca (BR-084, RNF-DATOS-001)", () => {
  it("el título, el copyright y el alt del logo salen de SITE.name, no de un literal", () => {
    renderWithProviders(<Footer />);

    expect(screen.getByRole("heading", { level: 3, name: SITE.name })).toBeInTheDocument();
    expect(screen.getByText(/Todos los derechos reservados/)).toHaveTextContent(SITE.name);
    expect(screen.getByRole("img", { name: `Logo de ${SITE.name}` })).toBeInTheDocument();
  });
});

describe("Footer: franja de cierre (BR-098, RNF-DATOS-001)", () => {
  it("fuera de la portada ofrece «Agendar Sesión» con el enlace de reserva del negocio", () => {
    renderWithProviders(<Footer />, { route: "/servicios" });

    const link = screen.getByRole("link", { name: "Agendar Sesión" });
    expect(link).toHaveAttribute("href", snapshot.business.booking.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("heading", { level: 2, name: "Reserva tu sesión" })).toBeInTheDocument();
  });

  it("en la portada no se monta: ya termina con CTA2", () => {
    renderWithProviders(<Footer />, { route: "/" });

    expect(screen.queryByRole("link", { name: "Agendar Sesión" })).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { level: 2 })).not.toBeInTheDocument();
  });
});

describe("Footer: privacidad (BR-037, BR-044)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("con analítica configurada enlaza a la política de privacidad", () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");

    renderWithProviders(<Footer />);

    expect(screen.getByRole("link", { name: "PRIVACIDAD" })).toHaveAttribute("href", "/privacidad");
  });

  it("sin analítica no enlaza a la política de privacidad: esa página no se publica (BR-044)", () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
    vi.stubEnv("VITE_VERCEL_ANALYTICS", "");

    renderWithProviders(<Footer />);

    expect(screen.queryByRole("link", { name: "PRIVACIDAD" })).not.toBeInTheDocument();
  });

  it("sin ID de medición no ofrece «Preferencias de privacidad»: no hay nada que configurar", () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");

    renderWithProviders(<Footer />);

    expect(screen.queryByRole("button", { name: "Preferencias de privacidad" })).not.toBeInTheDocument();
  });

  it("RF-MED-005: con ID de medición ofrece «Preferencias de privacidad»", () => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", "G-TEST123");

    renderWithProviders(<Footer />);

    expect(screen.getByRole("button", { name: "Preferencias de privacidad" })).toBeInTheDocument();
  });
});
