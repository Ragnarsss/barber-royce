import { afterEach, describe, expect, it, vi } from "vitest";
import { BRANCH_STORAGE_KEY } from "@/config/branches";
import { readStoredBranch, writeStoredBranch } from "./branchStorage";

// BR-103 (HU-SUC-001 CA-09): la elección se guarda en `localStorage`, que puede estar bloqueado o traer un valor ajeno.
describe("branchStorage (BR-103)", () => {
  afterEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  it("guarda y lee la sucursal elegida", () => {
    writeStoredBranch("la-serena");

    expect(localStorage.getItem(BRANCH_STORAGE_KEY)).toBe("la-serena");
    expect(readStoredBranch()).toBe("la-serena");
  });

  it("sin nada guardado devuelve null", () => {
    expect(readStoredBranch()).toBeNull();
  });

  it("un valor guardado que no es una sucursal se ignora (CP-SUC-001)", () => {
    localStorage.setItem(BRANCH_STORAGE_KEY, "otra-ciudad");

    expect(readStoredBranch()).toBeNull();
  });

  it("con localStorage bloqueado no falla: no lee ni guarda", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("bloqueado", "SecurityError");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new DOMException("bloqueado", "SecurityError");
    });

    expect(readStoredBranch()).toBeNull();
    expect(() => writeStoredBranch("la-serena")).not.toThrow();
  });
});
