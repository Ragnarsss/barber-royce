import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import type Lenis from "lenis";
import { LenisContext } from "@/contexts/lenisContextValue";
import { BackToTop } from "./BackToTop";

// BR-089 (HU-EXP-004 CA-33): botón de volver arriba.
const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "BackToTop.module.css"), "utf8");

const renderButton = (lenis: Lenis | null = null) =>
  render(
    <LenisContext value={lenis}>
      <main id="main-content" tabIndex={-1}>
        <BackToTop />
      </main>
    </LenisContext>,
  );

describe("BackToTop (BR-089)", () => {
  afterEach(() => vi.restoreAllMocks());

  it("arriba del todo está oculto e inerte: el teclado no entra y el lector de pantalla no lo lee", () => {
    const { container } = renderButton();

    const dock = container.querySelector("[inert]");
    expect(dock).not.toBeNull();
    expect(dock?.hasAttribute("data-visible")).toBe(false);
  });

  it("tiene nombre accesible y el anillo es decorativo", () => {
    const { container } = renderButton();

    expect(screen.getByRole("button", { name: "Volver arriba", hidden: true })).toBeInTheDocument();
    expect(container.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true");
  });

  it("con Lenis sube con Lenis y deja el foco en el contenido principal", () => {
    const scrollTo = vi.fn();
    renderButton({ scrollTo } as unknown as Lenis);

    fireEvent.click(screen.getByRole("button", { name: "Volver arriba", hidden: true }));

    expect(scrollTo).toHaveBeenCalledWith(0, expect.objectContaining({ duration: expect.any(Number) }));
    expect(document.activeElement).toBe(document.getElementById("main-content"));
  });

  it("sin Lenis usa el scroll del navegador", () => {
    const scrollTo = vi.spyOn(window, "scrollTo").mockImplementation(() => {});
    renderButton(null);

    fireEvent.click(screen.getByRole("button", { name: "Volver arriba", hidden: true }));

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("mide al menos 44 px de lado y no lleva colores escritos a mano (ADR-002)", () => {
    expect(css).toMatch(/width:\s*3\.5rem/);
    expect(css).not.toMatch(/#[0-9a-f]{3,8}\b/i);
    expect(css).not.toMatch(/rgba?\(/);
    expect(css).toMatch(/prefers-reduced-motion/);
  });
});
