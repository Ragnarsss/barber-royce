import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { BRANCH_STORAGE_KEY, BRANCHES, DEFAULT_BRANCH, type Branch } from "@/config/branches";
import { resolveBranch } from "@/branch/resolveBranch";

// BR-103 (RNF-PERF-008, CP-PERF-008, ADR-010 punto 7): el script de arranque de index.html repite la regla de
// `resolveBranch` para fijar data-branch antes de pintar. Como está escrito dos veces, aquí se ejecuta de verdad y se
// compara con la función pura; así una sola copia no puede cambiar sin que falle este test.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const indexHtml = readFileSync(resolve(root, "index.html"), "utf8");
const script = indexHtml.match(/<script id="branch-init">([^<]*)<\/script>/)?.[1] ?? "";

function runAt(pathname: string, stored: string | null, storageThrows = false): string | undefined {
  window.history.pushState({}, "", pathname);
  localStorage.clear();
  if (stored !== null) localStorage.setItem(BRANCH_STORAGE_KEY, stored);
  if (storageThrows) {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new DOMException("bloqueado", "SecurityError");
    });
  }
  delete document.documentElement.dataset.branch;
  new Function(script)();
  return document.documentElement.dataset.branch;
}

describe("script de arranque de la sucursal (BR-103)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    window.history.pushState({}, "", "/");
    delete document.documentElement.dataset.branch;
  });

  it("está en index.html antes del módulo de la app", () => {
    expect(script).not.toBe("");
    expect(indexHtml.indexOf('id="branch-init"')).toBeLessThan(indexHtml.indexOf('type="module"'));
  });

  it("repite la lista, la clave y el valor por defecto de src/config/branches.ts", () => {
    const list = JSON.parse(script.match(/var b=(\[[^\]]*\])/)![1]) as string[];

    expect(list).toEqual([...BRANCHES]);
    expect(script).toContain(`localStorage.getItem("${BRANCH_STORAGE_KEY}")`);
    expect(script.endsWith(`:"${DEFAULT_BRANCH}"})();`)).toBe(true);
  });

  const cases: Array<[string, Branch | null]> = [
    ["/", null],
    ["/", "la-serena"],
    ["/servicios", null],
    ["/servicios", "la-serena"],
    ["/servicios", "coquimbo"],
    ["/la-serena", "coquimbo"],
    ["/coquimbo", "la-serena"],
    ["/la-serena/", null],
    ["/la-serena-x", "la-serena"],
    ["/LA-SERENA", "la-serena"],
  ];
  it.each(cases)("en %s con %s guardada da lo mismo que resolveBranch", (pathname, stored) => {
    expect(runAt(pathname, stored)).toBe(resolveBranch(pathname, stored).branch);
  });

  it("ignora un valor guardado que no es una sucursal", () => {
    expect(runAt("/servicios", "otra-ciudad")).toBe(resolveBranch("/servicios", null).branch);
  });

  it("con localStorage bloqueado no falla y aplica la regla sin elección guardada", () => {
    expect(runAt("/servicios", null, true)).toBe(DEFAULT_BRANCH);
    expect(runAt("/la-serena", null, true)).toBe("la-serena");
  });
});
