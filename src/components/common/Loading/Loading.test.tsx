import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { render, screen } from "@testing-library/react";
import { Loading } from "./Loading";

// BR-123: la espera entre páginas usa el lenguaje del letrero de neón, sin spinner ni barra de progreso inventada.
const css = readFileSync(resolve(__dirname, "Loading.module.css"), "utf8");

describe("Loading (BR-123)", () => {
  it("anuncia la espera a los lectores de pantalla, con el ícono decorativo", () => {
    const { container } = render(<Loading />);

    expect(screen.getByRole("status")).toHaveTextContent("Cargando…");
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("no finge un progreso: sin barra ni porcentaje", () => {
    render(<Loading />);

    expect(screen.queryByRole("progressbar")).toBeNull();
  });

  it("aparece con retraso, para no destellar cuando la página llega enseguida", () => {
    expect(css).toMatch(/\.loadingContainer\s*\{[^}]*opacity:\s*0;[^}]*animation:[^;]*\d+ms[^;]*\d+ms/);
  });

  it("CP-A11Y-003: con reducir movimiento se muestra quieto", () => {
    const reduced = css.match(/@media \(prefers-reduced-motion: reduce\)\s*\{([\s\S]*)\}\s*$/)?.[1] ?? "";

    expect(reduced).toMatch(/\.loadingContainer\s*\{[^}]*animation:\s*none/);
    expect(reduced).toMatch(/\.icon\s*\{[^}]*animation:\s*none/);
  });
});
