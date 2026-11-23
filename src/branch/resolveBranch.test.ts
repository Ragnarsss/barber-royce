import { describe, expect, it } from "vitest";
import { BRANCHES, DEFAULT_BRANCH, isBranch } from "@/config/branches";
import { branchFromPath, resolveBranch, swapBranchInPath } from "./resolveBranch";

// BR-103 (ADR-010, RF-SUC-001): la sucursal activa sale del prefijo de la URL, luego de la elección guardada y, si no
// hay ninguna, de Coquimbo. Es lógica pura: se prueba sin React.
describe("branches (BR-103)", () => {
  it("hay dos sucursales y Coquimbo es la de por defecto", () => {
    expect(BRANCHES).toEqual(["coquimbo", "la-serena"]);
    expect(DEFAULT_BRANCH).toBe("coquimbo");
  });

  it("isBranch solo acepta un slug de sucursal", () => {
    expect(isBranch("la-serena")).toBe(true);
    expect(isBranch("coquimbo")).toBe(true);
    expect(isBranch("la-serena-x")).toBe(false);
    expect(isBranch("")).toBe(false);
    expect(isBranch(null)).toBe(false);
    expect(isBranch(undefined)).toBe(false);
  });
});

describe("branchFromPath (HU-SUC-001 CA-10)", () => {
  it.each([
    ["/la-serena", "la-serena"],
    ["/coquimbo", "coquimbo"],
    ["/la-serena/", "la-serena"],
    ["/coquimbo/algo", "coquimbo"],
  ])("%s lleva el prefijo de %s", (pathname, branch) => {
    expect(branchFromPath(pathname)).toBe(branch);
  });

  it.each(["/", "", "/servicios", "/la-serena-x", "/x/la-serena", "/LA-SERENA"])("%s no lleva prefijo de sucursal", (pathname) => {
    expect(branchFromPath(pathname)).toBeNull();
  });
});

describe("resolveBranch (CP-SUC-001)", () => {
  it("el prefijo de la URL manda aunque haya otra sucursal guardada", () => {
    expect(resolveBranch("/la-serena", "coquimbo")).toEqual({ branch: "la-serena", source: "url" });
    expect(resolveBranch("/coquimbo", "la-serena")).toEqual({ branch: "coquimbo", source: "url" });
  });

  it("sin prefijo usa la elección guardada (CA-03)", () => {
    expect(resolveBranch("/servicios", "la-serena")).toEqual({ branch: "la-serena", source: "stored" });
    expect(resolveBranch("/", "coquimbo")).toEqual({ branch: "coquimbo", source: "stored" });
  });

  it("sin prefijo y sin elección guardada usa Coquimbo (CA-04)", () => {
    expect(resolveBranch("/servicios", null)).toEqual({ branch: "coquimbo", source: "default" });
  });
});

describe("swapBranchInPath (HU-SUC-001 CA-06)", () => {
  it("cambia el prefijo de la portada por el de la otra sucursal", () => {
    expect(swapBranchInPath("/coquimbo", "la-serena")).toBe("/la-serena");
    expect(swapBranchInPath("/la-serena", "coquimbo")).toBe("/coquimbo");
  });

  it("conserva lo que viene después del prefijo", () => {
    expect(swapBranchInPath("/coquimbo/algo", "la-serena")).toBe("/la-serena/algo");
  });

  it("una ruta sin prefijo no se toca", () => {
    expect(swapBranchInPath("/servicios", "la-serena")).toBe("/servicios");
  });
});
