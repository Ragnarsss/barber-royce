import { afterEach, describe, expect, it } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import { BRANCH_STORAGE_KEY } from "@/config/branches";
import { BranchProvider } from "./BranchProvider";
import { useBranch } from "./useBranch";

// BR-103 (RF-SUC-001, HU-SUC-001 CA-02 .. CA-06, CA-09): el provider resuelve la sucursal, la deja en <html> y cambia de
// sucursal navegando (portada con prefijo) o solo guardando la elección (página común).
function Probe() {
  const { branch, source, setBranch } = useBranch();
  const { pathname } = useLocation();
  return (
    <div>
      <p data-testid="state">{`${branch}|${source}|${pathname}`}</p>
      <button onClick={() => setBranch("la-serena")}>a-la-serena</button>
      <button onClick={() => setBranch("coquimbo")}>a-coquimbo</button>
    </div>
  );
}

const renderAt = (route: string) =>
  render(
    <MemoryRouter initialEntries={[route]}>
      <BranchProvider>
        <Probe />
      </BranchProvider>
    </MemoryRouter>,
  );
const state = () => screen.getByTestId("state").textContent;
const click = (name: string) => act(() => screen.getByRole("button", { name }).click());

describe("BranchProvider (BR-103)", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.branch;
  });

  it("sin prefijo ni elección guardada, la sucursal es Coquimbo y queda en <html data-branch> (CA-04)", () => {
    renderAt("/servicios");

    expect(state()).toBe("coquimbo|default|/servicios");
    expect(document.documentElement.dataset.branch).toBe("coquimbo");
  });

  it("sin prefijo usa la elección guardada (CA-03)", () => {
    localStorage.setItem(BRANCH_STORAGE_KEY, "la-serena");

    renderAt("/servicios");

    expect(state()).toBe("la-serena|stored|/servicios");
    expect(document.documentElement.dataset.branch).toBe("la-serena");
  });

  it("el prefijo de la URL manda sobre lo guardado y pasa a ser lo guardado (CA-02)", () => {
    localStorage.setItem(BRANCH_STORAGE_KEY, "coquimbo");

    renderAt("/la-serena");

    expect(state()).toBe("la-serena|url|/la-serena");
    expect(localStorage.getItem(BRANCH_STORAGE_KEY)).toBe("la-serena");
  });

  it("en una página común, cambiar de sucursal no navega y guarda la elección (CA-05)", () => {
    renderAt("/servicios");

    click("a-la-serena");

    expect(state()).toBe("la-serena|stored|/servicios");
    expect(localStorage.getItem(BRANCH_STORAGE_KEY)).toBe("la-serena");
    expect(document.documentElement.dataset.branch).toBe("la-serena");
  });

  it("en una portada, cambiar de sucursal navega a la portada de la otra (CA-06)", () => {
    renderAt("/coquimbo");

    click("a-la-serena");

    expect(state()).toBe("la-serena|url|/la-serena");
    expect(document.documentElement.dataset.branch).toBe("la-serena");
  });

  it("elegir la sucursal que ya está activa no cambia nada", () => {
    renderAt("/coquimbo");

    click("a-coquimbo");

    expect(state()).toBe("coquimbo|url|/coquimbo");
  });
});

describe("BranchProvider: color de la barra del navegador (BR-104)", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.branch;
    document.head.querySelector('meta[name="theme-color"]')?.remove();
  });

  const addMeta = () => {
    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = "#000000";
    document.head.append(meta);
    return meta;
  };

  it("deja en el meta theme-color el fondo de la sucursal activa", () => {
    const meta = addMeta();

    renderAt("/la-serena");

    expect(meta.content).toBe("#f7f3ec");
  });

  it("lo cambia al cambiar de sucursal", () => {
    const meta = addMeta();
    renderAt("/servicios");
    expect(meta.content).toBe("#1a1a1a");

    click("a-la-serena");

    expect(meta.content).toBe("#f7f3ec");
  });

  it("si la página no tiene el meta, no falla", () => {
    expect(() => renderAt("/la-serena")).not.toThrow();
  });
});
