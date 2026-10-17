import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { HoneycombPage } from "./HoneycombPage";

// BR-060 y BR-067: la página con panal y su fondo de diagonales.
const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "HoneycombPage.module.css"), "utf8");

describe("HoneycombPage (BR-060, BR-067)", () => {
  it("el título es el único h1, con su subtítulo y el contenido debajo", () => {
    render(
      <HoneycombPage title="Nuestro equipo" subtitle="Profesionales">
        <p>contenido</p>
      </HoneycombPage>,
    );
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

  it("la variante en banda agrega su clase y la normal no", () => {
    const normal = render(<HoneycombPage title="T" subtitle="S"><span /></HoneycombPage>);
    const band = render(<HoneycombPage title="T" subtitle="S" band><span /></HoneycombPage>);
    expect((normal.container.firstChild as HTMLElement).className).not.toMatch(/band/);
    expect((band.container.firstChild as HTMLElement).className).toMatch(/band/);
  });

  it("la banda mide una pantalla y no un porcentaje de la página (así el fondo no se mueve al crecer el contenido: CLS)", () => {
    const block = css.slice(css.indexOf(".band .backdrop"));
    expect(block).toMatch(/height:\s*100vh/);
    expect(block).toMatch(/height:\s*100svh/);
    expect(block).toMatch(/bottom:\s*auto/);
  });

  it("ningún color escrito a mano (ADR-002)", () => {
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/rgba?\(/);
  });
});
