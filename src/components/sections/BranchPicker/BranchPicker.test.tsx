import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { locationsList as locations } from "@/data/locationsData";
import { BranchPicker } from "./BranchPicker";

// BR-106 (HU-SUC-001 CA-01, CP-SUC-004): `/` muestra dos mitades con enlaces reales a cada portada.
describe("BranchPicker (BR-106)", () => {
  it("CA-01: dos enlaces reales, uno a /coquimbo y otro a /la-serena, con el nombre de su sucursal", () => {
    renderWithProviders(<BranchPicker />);

    expect(screen.getByRole("link", { name: /Coquimbo/ })).toHaveAttribute("href", "/coquimbo");
    expect(screen.getByRole("link", { name: /La Serena/ })).toHaveAttribute("href", "/la-serena");
  });

  it("cada mitad muestra la dirección de su sucursal, tomada de los datos del sitio", () => {
    renderWithProviders(<BranchPicker />);
    const [coquimbo, serena] = [
      locations.find((location) => location.id === "barberia-royce-coquimbo")!,
      locations.find((location) => location.id === "barberia-royce-la-serena")!,
    ];

    expect(screen.getByRole("link", { name: /Coquimbo/ })).toHaveTextContent(coquimbo.address);
    expect(screen.getByRole("link", { name: /La Serena/ })).toHaveTextContent(serena.address);
  });

  it("hay un solo h1 y las mitades son h2", () => {
    renderWithProviders(<BranchPicker />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual(["Coquimbo", "La Serena"]);
  });

  it("las figuras son decorativas: ocultas a los lectores de pantalla", () => {
    const { container } = renderWithProviders(<BranchPicker />);

    expect(container.querySelectorAll("svg")).toHaveLength(4);
    container.querySelectorAll("svg").forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
  });
});
