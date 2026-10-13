import { afterEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { Footer } from "./Footer";

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
