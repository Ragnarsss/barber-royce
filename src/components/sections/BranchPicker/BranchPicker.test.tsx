import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { BranchPicker } from "./BranchPicker";

// BR-106 (HU-SUC-001 CA-01, CP-SUC-004): `/` muestra dos mitades con enlaces reales a cada portada.
const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "BranchPicker.module.css"), "utf8");

describe("BranchPicker (BR-106)", () => {
  it("CA-01: dos enlaces reales, uno a /coquimbo y otro a /la-serena, con el nombre de su sucursal", () => {
    renderWithProviders(<BranchPicker />);

    expect(screen.getByRole("link", { name: "Coquimbo" })).toHaveAttribute("href", "/coquimbo");
    expect(screen.getByRole("link", { name: "La Serena" })).toHaveAttribute("href", "/la-serena");
  });

  it("cada mitad dice solo el nombre de la sucursal: sin etiquetas, frases, direcciones ni «Entrar»", () => {
    renderWithProviders(<BranchPicker />);

    expect(screen.getByRole("link", { name: "Coquimbo" })).toHaveTextContent(/^Coquimbo$/);
    expect(screen.getByRole("link", { name: "La Serena" })).toHaveTextContent(/^La Serena$/);
  });

  it("hay un solo h1 y las mitades son h2", () => {
    renderWithProviders(<BranchPicker />);

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getAllByRole("heading", { level: 2 }).map((heading) => heading.textContent)).toEqual(["Coquimbo", "La Serena"]);
  });

  it("cada mitad lleva la foto de su local (decorativa, con tamaño) y sus figuras ocultas a los lectores de pantalla", () => {
    const { container } = renderWithProviders(<BranchPicker />);

    const photos = container.querySelectorAll("img");
    expect(photos).toHaveLength(2);
    photos.forEach((photo) => {
      expect(photo).toHaveAttribute("alt", "");
      expect(photo).toHaveAttribute("width");
      expect(photo).toHaveAttribute("height");
    });
    expect(container.querySelectorAll("svg")).toHaveLength(4);
    container.querySelectorAll("svg").forEach((svg) => expect(svg).toHaveAttribute("aria-hidden", "true"));
  });

  it("las fotos van en escala de grises y solo se iluminan con el cursor o el foco", () => {
    expect(css).toMatch(/\.photo\s*\{[^}]*filter:\s*grayscale\(1\)/);
    expect(css).toMatch(/\.half:hover \.photo,\s*\.half:focus-visible \.photo\s*\{[^}]*filter:\s*none/);
  });
});
