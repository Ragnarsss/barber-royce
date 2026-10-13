import { describe, expect, it, vi } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import type Lenis from "lenis";
import { LenisContext } from "@/contexts/lenisContextValue";
import { useLenisScrollActive } from "./useScrollActive";

function fakeLenis() {
  return { on: vi.fn(), off: vi.fn() } as unknown as Lenis & {
    on: ReturnType<typeof vi.fn>;
    off: ReturnType<typeof vi.fn>;
  };
}

const withLenis = (lenis: Lenis | null) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return <LenisContext value={lenis}>{children}</LenisContext>;
  };

const useHook = useLenisScrollActive;

describe("useLenisScrollActive (BR-014)", () => {
  it("se suscribe al scroll de la instancia del contexto", () => {
    const lenis = fakeLenis();

    renderHook(() => useHook(), { wrapper: withLenis(lenis) });

    expect(lenis.on).toHaveBeenCalledWith("scroll", expect.any(Function));
  });

  it("al desmontar se desuscribe con el mismo handler: no deja listeners colgados", () => {
    const lenis = fakeLenis();

    const { unmount } = renderHook(() => useHook(), { wrapper: withLenis(lenis) });
    const handler = lenis.on.mock.calls[0][1];
    unmount();

    expect(lenis.off).toHaveBeenCalledWith("scroll", handler);
  });

  it("sin Lenis no falla ni se suscribe a nada", () => {
    expect(() => renderHook(() => useHook(), { wrapper: withLenis(null) })).not.toThrow();
  });

  it("si Lenis llega después del montaje, se suscribe en ese momento", () => {
    const lenis = fakeLenis();
    let current: Lenis | null = null;
    function Wrapper({ children }: { children: ReactNode }) {
      return <LenisContext value={current}>{children}</LenisContext>;
    }

    const { rerender } = renderHook(() => useHook(), { wrapper: Wrapper });
    current = lenis;
    rerender();

    expect(lenis.on).toHaveBeenCalledWith("scroll", expect.any(Function));
  });
});
