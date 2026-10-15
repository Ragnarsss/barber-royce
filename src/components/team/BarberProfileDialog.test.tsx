import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, screen, waitFor, within } from "@testing-library/react";
import type Lenis from "lenis";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-063: la ficha de cada barbero en un diálogo (HU-INFO-003 CA-07, HU-EXP-004 CA-15, CP-INFO-010).
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return {
    default: {
      ...snapshot,
      team: [
        {
          name: "Carlos Mendoza",
          role: "Master Barber",
          experience: "15 años",
          image: "/carlos.jpg",
          isLead: true,
          specialties: ["Fade", "Barba"],
          description: "Fundó la barbería.",
        },
        { name: "Juan Pérez", role: "Barber", experience: "5 años", image: "/juan.jpg", isLead: false, specialties: [], description: "" },
      ],
    },
  };
});
vi.mock("virtual:site-sheet", () => ({ default: null }));

import { TeamPage } from "@/pages/TeamPage";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "BarberProfileDialog.module.css"), "utf8");

const renderPage = () => {
  const lenis = { stop: vi.fn(), start: vi.fn() };
  renderWithProviders(
    <LenisContext value={lenis as unknown as Lenis}>
      <TeamPage />
    </LenisContext>,
    { route: "/equipo" },
  );
  return lenis;
};

describe("ficha del barbero (BR-063)", () => {
  beforeAll(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  it("CA-07: al activar un barbero se abre su ficha con nombre, cargo, especialidades y descripción", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Carlos Mendoza, Master Barber" }));

    const dialog = screen.getByRole("dialog", { name: "Carlos Mendoza" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(within(dialog).getByRole("heading", { level: 2, name: "Carlos Mendoza" })).toBeInTheDocument();
    expect(within(dialog).getByText(/Master Barber/)).toBeInTheDocument();
    const chips = within(dialog).getByRole("list", { name: "Especialidades" });
    expect(within(chips).getAllByRole("listitem").map((chip) => chip.textContent)).toEqual(["Fade", "Barba"]);
    expect(dialog).toHaveAccessibleDescription("Fundó la barbería.");
    expect(within(dialog).getByRole("img", { name: "Carlos Mendoza" })).toBeInTheDocument();
  });

  it("CA-07: sin especialidades ni descripción, la ficha no deja huecos", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: "Juan Pérez, Barber" }));

    const dialog = screen.getByRole("dialog", { name: "Juan Pérez" });
    expect(within(dialog).queryByRole("list")).not.toBeInTheDocument();
    expect(dialog).not.toHaveAttribute("aria-describedby");
  });

  it("CA-15: al abrir, el foco va a cerrar; Tab no sale de la ficha", () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Carlos Mendoza/ }));

    const close = screen.getByRole("button", { name: "Cerrar ficha" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: "Tab" });
    expect(close).toHaveFocus();
    fireEvent.keyDown(close, { key: "Tab", shiftKey: true });
    expect(close).toHaveFocus();
  });

  it("CA-15: Escape cierra la ficha y el foco vuelve al barbero que la abrió", async () => {
    renderPage();
    const trigger = screen.getByRole("button", { name: /Carlos Mendoza/ });
    trigger.focus();
    fireEvent.click(trigger);

    fireEvent.keyDown(screen.getByRole("dialog"), { key: "Escape" });

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(trigger).toHaveFocus();
  });

  it("CA-15: el fondo no se desplaza mientras está abierta (Lenis se detiene y se reanuda)", async () => {
    const lenis = renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Carlos Mendoza/ }));

    expect(lenis.stop).toHaveBeenCalled();
    expect(document.documentElement.style.overflow).toBe("hidden");

    fireEvent.click(screen.getByRole("button", { name: "Cerrar ficha" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    expect(lenis.start).toHaveBeenCalled();
    expect(document.documentElement.style.overflow).toBe("");
  });

  it("un clic en el fondo oscuro cierra la ficha", async () => {
    renderPage();
    fireEvent.click(screen.getByRole("button", { name: /Juan Pérez/ }));
    fireEvent.click(screen.getByTestId("barber-dialog-backdrop"));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("colores con tokens y sin transición con reducir movimiento (ADR-002, CP-A11Y-003)", () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/rgba?\(/);
    expect(css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"))).toMatch(/transition:\s*none/);
  });
});
