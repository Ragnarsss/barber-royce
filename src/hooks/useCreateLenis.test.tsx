import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";

const reducedMotion = vi.hoisted(() => ({ value: false }));
const lenisCalls = vi.hoisted(() => ({ created: 0, destroyed: 0, options: undefined as Record<string, unknown> | undefined }));

vi.mock("framer-motion", () => ({ useReducedMotion: () => reducedMotion.value }));
vi.mock("lenis", () => ({
  default: class FakeLenis {
    constructor(options: Record<string, unknown>) {
      lenisCalls.created += 1;
      lenisCalls.options = options;
    }
    scrollTo() {}
    destroy() {
      lenisCalls.destroyed += 1;
    }
  },
}));

import { useCreateLenis } from "./useCreateLenis";

describe("useCreateLenis (BR-014, BR-017, BR-049)", () => {
  beforeEach(() => {
    lenisCalls.created = 0;
    lenisCalls.destroyed = 0;
    lenisCalls.options = undefined;
    reducedMotion.value = false;
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("por defecto crea Lenis (smooth scroll) y lo publica cuando está listo", async () => {
    const { result, unmount } = renderHook(() => useCreateLenis());

    expect(lenisCalls.created).toBe(1);
    await waitFor(() => expect(result.current).not.toBeNull());
    unmount();
  });

  it("BR-049 CA-01: el suavizado dura lo suficiente para percibirse", () => {
    const { unmount } = renderHook(() => useCreateLenis());

    expect(lenisCalls.options?.duration).toBeGreaterThanOrEqual(1);
    unmount();
  });

  it("BR-077 CA-28: la rueda avanza más despacio que lo normal, pero no tan poco que se sienta trabada", () => {
    const { unmount } = renderHook(() => useCreateLenis());

    const multiplier = lenisCalls.options?.wheelMultiplier as number;
    expect(multiplier).toBeLessThan(1);
    expect(multiplier).toBeGreaterThanOrEqual(0.4);
    unmount();
  });

  it("BR-049: Lenis lleva su propio loop y su propio resize, sin loop ni observer del hook", () => {
    const resizeObserver = vi.fn();
    vi.stubGlobal("ResizeObserver", resizeObserver);

    const { unmount } = renderHook(() => useCreateLenis());

    expect(lenisCalls.options?.autoRaf).toBe(true);
    expect(lenisCalls.options?.autoResize).toBe(true);
    expect(resizeObserver).not.toHaveBeenCalled();
    unmount();
  });

  it("CP-A11Y-003: con reducir movimiento no crea Lenis y devuelve null", () => {
    reducedMotion.value = true;

    const { result } = renderHook(() => useCreateLenis());

    expect(lenisCalls.created).toBe(0);
    expect(result.current).toBeNull();
  });

  it("no deja instancia global en window", () => {
    const { unmount } = renderHook(() => useCreateLenis());

    expect("lenis" in window).toBe(false);
    unmount();
  });

  it("nunca usa un MutationObserver", () => {
    const mutationObserver = vi.fn();
    vi.stubGlobal("MutationObserver", mutationObserver);

    const { unmount } = renderHook(() => useCreateLenis());

    expect(mutationObserver).not.toHaveBeenCalled();
    unmount();
  });

  it("al desmontar destruye la instancia y cancela el frame pendiente", () => {
    const cancel = vi.spyOn(window, "cancelAnimationFrame");

    const { unmount } = renderHook(() => useCreateLenis());
    unmount();

    expect(lenisCalls.destroyed).toBe(1);
    expect(cancel).toHaveBeenCalledTimes(1);
  });

  it("al activar reducir movimiento destruye Lenis y deja de publicarlo", async () => {
    const { result, rerender } = renderHook(() => useCreateLenis());
    await waitFor(() => expect(result.current).not.toBeNull());

    reducedMotion.value = true;
    rerender();

    expect(lenisCalls.destroyed).toBe(1);
    await waitFor(() => expect(result.current).toBeNull());
  });

  it("no recrea Lenis en cada render", () => {
    const { rerender, unmount } = renderHook(() => useCreateLenis());

    rerender();
    rerender();

    expect(lenisCalls.created).toBe(1);
    unmount();
  });
});
