import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HoneycombPage } from "./HoneycombPage";

// BR-060, BR-067 y BR-088: la página con panal, con la cabecera de todo el sitio y el contenido sobre fondo liso.
const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "HoneycombPage.module.css"), "utf8");

describe("HoneycombPage (BR-060, BR-067, BR-088)", () => {
  it("el título es el único h1, con su subtítulo y el contenido debajo", () => {
    render(
      <HoneycombPage title="Nuestro equipo" subtitle="Profesionales">
        <p>contenido</p>
      </HoneycombPage>,
    );
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("heading", { level: 1, name: "Nuestro equipo" })).toBeInTheDocument();
    expect(screen.getByText("Profesionales")).toBeInTheDocument();
    expect(screen.getByText("contenido")).toBeInTheDocument();
  });

  it("las diagonales son decorativas: están ocultas a los lectores de pantalla", () => {
    const { container } = render(
      <HoneycombPage title="T" subtitle="S">
        <span />
      </HoneycombPage>,
    );
    expect(container.querySelector('[aria-hidden="true"]')).not.toBeNull();
  });

  it("el fondo de la página es liso: las diagonales viven solo en la cabecera", () => {
    expect(css).not.toMatch(/clip-path/);
    expect(css).not.toMatch(/100svh|100vh\s*;\s*\n\s*height/);
  });

  it("ningún color escrito a mano (ADR-002)", () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/rgba?\(/);
  });
});
