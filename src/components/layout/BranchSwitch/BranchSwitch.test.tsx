import { afterEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { BranchProvider } from "@/branch/BranchProvider";
import { BranchSwitch } from "./BranchSwitch";

// BR-105 (HU-SUC-001 CA-05 a CA-08, RNF-A11Y-002): un grupo de opciones con los nombres de las sucursales, operable con
// teclado; en una página común no navega y en una portada sí. jsdom no tiene View Transitions: el cambio es directo.
function Where() {
  return <p data-testid="where">{useLocation().pathname}</p>;
}

const renderAt = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <BranchProvider>
        <BranchSwitch />
        <Where />
      </BranchProvider>
    </MemoryRouter>,
  );
const option = (name: string) => screen.getByRole("radio", { name });

describe("BranchSwitch (BR-105)", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.branch;
  });

  it("CA-07: se anuncia como grupo «Sucursal» con las dos sucursales y la activa marcada", () => {
    renderAt("/servicios");

    expect(screen.getByRole("radiogroup", { name: "Sucursal" })).toBeInTheDocument();
    expect(option("Coquimbo")).toHaveAttribute("aria-checked", "true");
    expect(option("La Serena")).toHaveAttribute("aria-checked", "false");
  });

  it("CA-07: solo la opción activa entra en el orden de tabulación", () => {
    renderAt("/servicios");

    expect(option("Coquimbo")).toHaveAttribute("tabindex", "0");
    expect(option("La Serena")).toHaveAttribute("tabindex", "-1");
  });

  it("CA-05, CP-SUC-003: en una página común cambia el tema y guarda la elección, sin cambiar la URL", async () => {
    renderAt("/servicios");

    await act(async () => option("La Serena").click());

    expect(document.documentElement.dataset.branch).toBe("la-serena");
    expect(localStorage.getItem("royce:branch")).toBe("la-serena");
    expect(screen.getByTestId("where")).toHaveTextContent("/servicios");
    expect(option("La Serena")).toHaveAttribute("aria-checked", "true");
  });

  it("CA-06: en /coquimbo, elegir La Serena navega a /la-serena", async () => {
    renderAt("/coquimbo");

    await act(async () => option("La Serena").click());

    expect(screen.getByTestId("where")).toHaveTextContent("/la-serena");
    expect(option("La Serena")).toHaveAttribute("aria-checked", "true");
  });

  it("CA-07: las flechas cambian de opción, con vuelta al principio, y llevan el foco a la nueva", async () => {
    renderAt("/servicios");
    option("Coquimbo").focus();

    await act(async () => fireEvent.keyDown(option("Coquimbo"), { key: "ArrowRight" }));
    expect(option("La Serena")).toHaveAttribute("aria-checked", "true");
    expect(option("La Serena")).toHaveFocus();

    await act(async () => fireEvent.keyDown(option("La Serena"), { key: "ArrowRight" }));
    expect(option("Coquimbo")).toHaveAttribute("aria-checked", "true");
    expect(option("Coquimbo")).toHaveFocus();

    await act(async () => fireEvent.keyDown(option("Coquimbo"), { key: "ArrowLeft" }));
    expect(option("La Serena")).toHaveAttribute("aria-checked", "true");
  });

  it("otras teclas no cambian de sucursal", async () => {
    renderAt("/servicios");

    await act(async () => fireEvent.keyDown(option("Coquimbo"), { key: "a" }));

    expect(option("Coquimbo")).toHaveAttribute("aria-checked", "true");
  });
});
