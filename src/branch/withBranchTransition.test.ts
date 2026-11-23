import { afterEach, describe, expect, it, vi } from "vitest";
import { withBranchTransition } from "./withBranchTransition";

// BR-105 (HU-SUC-001 CA-08): con View Transitions y movimiento permitido, el cambio va dentro de la transición; sin
// soporte o con «reducir movimiento», corre directo.
type WithTransition = { startViewTransition?: unknown; };
const doc = document as unknown as WithTransition;

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal("matchMedia", (query: string) => ({ matches: reduce && query.includes("reduce"), addEventListener() {}, removeEventListener() {} }));
}

describe("withBranchTransition (BR-105)", () => {
  afterEach(() => {
    delete doc.startViewTransition;
    vi.unstubAllGlobals();
  });

  it("sin View Transitions, corre el cambio de inmediato", () => {
    mockReducedMotion(false);
    const update = vi.fn();

    withBranchTransition(update);

    expect(update).toHaveBeenCalledOnce();
  });

  it("con View Transitions y movimiento permitido, el cambio lo corre la transición y no antes", () => {
    mockReducedMotion(false);
    const start = vi.fn();
    doc.startViewTransition = start;
    const update = vi.fn();

    withBranchTransition(update);

    expect(start).toHaveBeenCalledWith(update);
    expect(update).not.toHaveBeenCalled();
  });

  it("con «reducir movimiento», no abre la transición aunque el navegador la soporte", () => {
    mockReducedMotion(true);
    const start = vi.fn();
    doc.startViewTransition = start;
    const update = vi.fn();

    withBranchTransition(update);

    expect(start).not.toHaveBeenCalled();
    expect(update).toHaveBeenCalledOnce();
  });
});
