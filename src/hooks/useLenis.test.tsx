import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";

const reducedMotion = vi.hoisted(() => ({ value: false }));
const created = vi.hoisted(() => ({ count: 0 }));

vi.mock("framer-motion", () => ({ useReducedMotion: () => reducedMotion.value }));
vi.mock("lenis", () => ({
  default: class FakeLenis {
    constructor() {
      created.count += 1;
    }
    raf() {}
    resize() {}
    scrollTo() {}
    destroy() {}
  },
}));

import { useLenis } from "./useLenis";

describe("useLenis y reducir movimiento (BR-017, CP-A11Y-003)", () => {
  beforeEach(() => {
    created.count = 0;
    reducedMotion.value = false;
    vi.stubGlobal(
      "ResizeObserver",
      class {
        observe() {}
        disconnect() {}
      },
    );
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("por defecto crea Lenis (smooth scroll)", () => {
    const { unmount } = renderHook(() => useLenis());

    expect(created.count).toBe(1);
    expect(window.lenis).toBeDefined();
    unmount();
  });

  it("con reducir movimiento no crea Lenis: queda el scroll nativo", () => {
    reducedMotion.value = true;

    const { result } = renderHook(() => useLenis());

    expect(created.count).toBe(0);
    expect(window.lenis).toBeUndefined();
    expect(result.current).toBeNull();
  });
});
