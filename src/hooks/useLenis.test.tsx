import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const reducedMotion = vi.hoisted(() => ({ value: false }));
const lenisCalls = vi.hoisted(() => ({ created: 0, destroyed: 0 }));

vi.mock("framer-motion", () => ({ useReducedMotion: () => reducedMotion.value }));
vi.mock("lenis", () => ({
  default: class FakeLenis {
    constructor() {
      lenisCalls.created += 1;
    }
    raf() {}
    resize() {}
    scrollTo() {}
    destroy() {
      lenisCalls.destroyed += 1;
    }
  },
}));

import { useLenis } from "./useLenis";

const observers = { resizeObserved: 0, resizeDisconnected: 0 };

describe("useLenis (BR-014, BR-017)", () => {
  beforeEach(() => {
    lenisCalls.created = 0;
    lenisCalls.destroyed = 0;
    observers.resizeObserved = 0;
    observers.resizeDisconnected = 0;
    reducedMotion.value = false;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {
          observers.resizeObserved += 1;
        }
        disconnect() {
          observers.resizeDisconnected += 1;
        }
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("por defecto crea Lenis (smooth scroll)", () => {
    const { unmount } = renderHook(() => useLenis());

    expect(lenisCalls.created).toBe(1);
    unmount();
  });

  it("CP-A11Y-003: con reducir movimiento no crea Lenis y devuelve null", () => {
    reducedMotion.value = true;

    const { result } = renderHook(() => useLenis());

    expect(lenisCalls.created).toBe(0);
    expect(result.current).toBeNull();
  });

  it("no deja instancia global en window", () => {
    const { unmount } = renderHook(() => useLenis());

    expect("lenis" in window).toBe(false);
    unmount();
  });

  it("observa el body con un ResizeObserver y nunca con un MutationObserver", () => {
    const mutationObserver = vi.fn();
    vi.stubGlobal("MutationObserver", mutationObserver);

    const { unmount } = renderHook(() => useLenis());

    expect(observers.resizeObserved).toBe(1);
    expect(mutationObserver).not.toHaveBeenCalled();
    unmount();
  });

  it("al desmontar libera todo: observer desconectado, instancia destruida, frames cancelados", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = renderHook(() => useLenis());
    unmount();

    expect(observers.resizeDisconnected).toBe(1);
    expect(lenisCalls.destroyed).toBe(1);
    // loop de animación + frame de "listo" pendiente
    expect(cancel).toHaveBeenCalledTimes(2);
  });

  it("no recrea Lenis en cada render", () => {
    const { rerender, unmount } = renderHook(() => useLenis());

    rerender();
    rerender();

    expect(lenisCalls.created).toBe(1);
    unmount();
  });
});
