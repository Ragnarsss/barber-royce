import type { ReactNode } from "react";
import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type Lenis from "lenis";
import { LenisContext } from "@/contexts/lenisContextValue";
import { useLenisInstance, useLenisReady } from "./useLenisContext";

const withLenis =
  (lenis: Lenis | null) =>
  ({ children }: { children: ReactNode }) => <LenisContext value={lenis}>{children}</LenisContext>;

describe("useLenisContext (BR-049)", () => {
  it("sin instancia, Lenis no está listo", () => {
    const { result } = renderHook(() => ({ lenis: useLenisInstance(), ready: useLenisReady() }), { wrapper: withLenis(null) });

    expect(result.current).toEqual({ lenis: null, ready: false });
  });

  it("con instancia, Lenis está listo sin esperar nada más", () => {
    const lenis = {} as Lenis;

    const { result } = renderHook(() => ({ lenis: useLenisInstance(), ready: useLenisReady() }), { wrapper: withLenis(lenis) });

    expect(result.current).toEqual({ lenis, ready: true });
  });

  it("fuera de un proveedor lanza un error claro", () => {
    expect(() => renderHook(() => useLenisReady())).toThrow("useLenisReady must be used within a LenisContext");
  });
});
