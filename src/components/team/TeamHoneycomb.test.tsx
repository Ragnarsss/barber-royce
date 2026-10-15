import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import type { TeamMember } from "@/types/team.types";
import { renderWithProviders } from "@/test/renderWithProviders";
import { TeamHoneycomb } from "./TeamHoneycomb";

// BR-060 (HU-EXP-004 CA-12): el panal del equipo.
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "TeamHoneycomb.module.css"), "utf8");
const pageCss = readFileSync(resolve(here, "../../pages/TeamPage.module.css"), "utf8");

const team: TeamMember[] = [
  { name: "Ana Rojas", role: "Barber", experience: "3 años", image: "/ana.jpg", isLead: false, specialties: [], description: "", bookingUrl: "", instagram: "", works: [], quote: "", workDays: [], branchIds: [] },
  { name: "Carlos Mendoza", role: "Master Barber", experience: "15 años", image: "/carlos.jpg", isLead: true, specialties: [], description: "", bookingUrl: "", instagram: "", works: [], quote: "", workDays: [], branchIds: [] },
  { name: "Juan Pérez", role: "Barber", experience: "5 años", image: "/juan.jpg", isLead: false, specialties: [], description: "", bookingUrl: "", instagram: "", works: [], quote: "", workDays: [], branchIds: [] },
];

describe("TeamHoneycomb (BR-060, HU-EXP-004 CA-12)", () => {
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

  it("cada barbero es un botón con su nombre y cargo como nombre accesible", () => {
    renderWithProviders(<TeamHoneycomb team={team} />);
    for (const member of team) {
      expect(screen.getByRole("button", { name: `${member.name}, ${member.role}` })).toBeInTheDocument();
    }
  });

  it("el líder va primero y marcado como líder", () => {
    renderWithProviders(<TeamHoneycomb team={team} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveAttribute("data-lead", "true");
    expect(items[0]).toHaveTextContent("Carlos Mendoza");
    expect(items.slice(1).every((item) => !item.hasAttribute("data-lead"))).toBe(true);
  });

  it("cada foto tiene un alt con el nombre del barbero (CP-INFO-004)", () => {
    const { container } = renderWithProviders(<TeamHoneycomb team={team} />);
    const alts = [...container.querySelectorAll("img")].map((img) => img.getAttribute("alt"));
    expect(alts.sort()).toEqual(team.map((member) => member.name).sort());
  });

  it("activar un barbero avisa cuál fue", () => {
    const onSelect = vi.fn();
    renderWithProviders(<TeamHoneycomb team={team} onSelect={onSelect} />);
    fireEvent.click(screen.getByRole("button", { name: /Juan Pérez/ }));
    expect(onSelect).toHaveBeenCalledWith(team[2]);
  });

  it("el marco del líder es rojo y el del resto blanco, con tokens", () => {
    expect(css).toMatch(/--frame-color:\s*var\(--color-brand-white\)/);
    expect(css).toMatch(/--lead-frame-color:\s*var\(--color-brand-primary\)/);
  });

  it("el foco de teclado se ve igual que el cursor (neón)", () => {
    expect(css).toMatch(/\.hex:hover,\s*\.hex:focus-visible\s*\{\s*filter:\s*var\(--glow\)/);
  });

  it("con reducir movimiento no hay transiciones (CP-A11Y-003)", () => {
    const block = css.slice(css.indexOf("@media (prefers-reduced-motion: reduce)"));
    expect(block).toMatch(/transition:\s*none/);
  });

  it("ningún color escrito a mano en el panal ni en la página (ADR-002)", () => {
    for (const source of [css, pageCss]) {
      expect(source).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(source).not.toMatch(/rgba?\(/);
    }
  });
});
