import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { CardCarousel } from "./CardCarousel";

// BR-070 (HU-EXP-004 CA-21): carrusel con snap solo en móvil, sin setState por scroll.
const state = vi.hoisted(() => ({ reducedMotion: false }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useReducedMotion: () => state.reducedMotion,
}));

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "CardCarousel.module.css"), "utf8");
const source = readFileSync(resolve(here, "CardCarousel.tsx"), "utf8");

/** Observador de intersección simulado: guarda su callback y lo que observa, para dispararlo a mano. */
type ObserverCallback = (entries: Array<{ target: Element; isIntersecting: boolean }>) => void;
const observers: Array<{ callback: ObserverCallback; targets: Element[]; options?: IntersectionObserverInit }> = [];

const mockViewport = (mobile: boolean) => {
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: mobile && query === "(max-width: 768px)",
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};

const renderCarousel = () =>
  render(
    <CardCarousel label="Reseñas de clientes">
      <div data-testid="track">
        <article>Uno</article>
        <article>Dos</article>
        <article>Tres</article>
      </div>
    </CardCarousel>,
  );

/** El observador avisa de todas las tarjetas al empezar: la primera visible, las demás no. */
const showCard = (index: number) =>
  act(() => {
    const { callback, targets } = observers.at(-1)!;
    callback(targets.map((target, i) => ({ target, isIntersecting: i === index })));
  });

describe("CardCarousel (BR-070, HU-EXP-004 CA-21)", () => {
  beforeEach(() => {
    observers.length = 0;
    state.reducedMotion = false;
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        callback: ObserverCallback;
        targets: Element[] = [];
        options?: IntersectionObserverInit;
        constructor(callback: ObserverCallback, options?: IntersectionObserverInit) {
          this.callback = callback;
          this.options = options;
          observers.push(this);
        }
        observe(target: Element) {
          this.targets.push(target);
        }
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
    Element.prototype.scrollBy = vi.fn() as unknown as Element["scrollBy"];
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("en escritorio no monta nada: sin puntos, sin región y sin observador", () => {
    mockViewport(false);
    renderCarousel();

    expect(screen.queryByRole("button")).toBeNull();
    expect(screen.getByTestId("track").getAttribute("role")).toBeNull();
    expect(screen.getByTestId("track").hasAttribute("tabindex")).toBe(false);
    expect(observers).toHaveLength(0);
  });

  it("en móvil, la fila es una región con nombre y se puede enfocar para recorrerla con las flechas", () => {
    mockViewport(true);
    renderCarousel();

    const track = screen.getByTestId("track");
    expect(track.getAttribute("role")).toBe("region");
    expect(track.getAttribute("aria-label")).toBe("Reseñas de clientes");
    expect(track.getAttribute("aria-roledescription")).toBe("carrusel");
    expect(track.tabIndex).toBe(0);
  });

  it("en móvil, un punto por tarjeta y el de la tarjeta visible marcado como actual", () => {
    mockViewport(true);
    renderCarousel();
    showCard(1);

    const dots = screen.getAllByRole("button");
    expect(dots).toHaveLength(3);
    expect(dots[0].getAttribute("aria-label")).toBe("Ir a la tarjeta 1 de 3");
    expect(dots[1].getAttribute("aria-current")).toBe("true");
    expect(dots[0].hasAttribute("aria-current")).toBe(false);
  });

  it("la tarjeta visible queda marcada con data-active y las demás, no", () => {
    mockViewport(true);
    renderCarousel();
    showCard(2);

    const cards = screen.getByTestId("track").children;
    expect([...cards].map((card) => (card as HTMLElement).dataset.active)).toEqual(["false", "false", "true"]);
  });

  it("el observador mide cuánto se ve cada tarjeta dentro de la fila, no de la página", () => {
    mockViewport(true);
    renderCarousel();

    expect(observers[0].options?.root).toBe(screen.getByTestId("track"));
    expect(observers[0].options?.threshold).toBe(0.6);
    expect(observers[0].targets).toHaveLength(3);
  });

  it("un punto mueve solo la fila (scrollBy), con desplazamiento suave", () => {
    mockViewport(true);
    renderCarousel();
    showCard(0);

    fireEvent.click(screen.getAllByRole("button")[2]);

    expect(Element.prototype.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "smooth" }));
  });

  it("CP-A11Y-003: con reducir movimiento, el punto salta sin desplazamiento suave", () => {
    state.reducedMotion = true;
    mockViewport(true);
    renderCarousel();
    showCard(0);

    fireEvent.click(screen.getAllByRole("button")[1]);

    expect(Element.prototype.scrollBy).toHaveBeenCalledWith(expect.objectContaining({ behavior: "auto" }));
  });

  it("al pasar a escritorio se desmonta lo que se agregó: atributos y marcas de la tarjeta", () => {
    mockViewport(true);
    const { unmount } = renderCarousel();
    showCard(0);
    const track = screen.getByTestId("track");
    unmount();

    expect(track.getAttribute("role")).toBeNull();
    expect(track.hasAttribute("tabindex")).toBe(false);
    expect((track.children[0] as HTMLElement).dataset.active).toBeUndefined();
  });

  it("regla 6: no escucha el scroll ni cambia el estado por cada evento de desplazamiento", () => {
    expect(source).not.toMatch(/addEventListener\(\s*["']scroll["']/);
    expect(source).not.toMatch(/onScroll=|useScroll\(/);
  });
});

describe("CardCarousel: estilos (BR-070)", () => {
  const mobile = css.match(/@media \(max-width: 768px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  it("en escritorio el envoltorio no existe (display: contents) y no hay puntos", () => {
    expect(css).toMatch(/\n\.carousel\s*\{[^}]*display:\s*contents/);
    expect(css).toMatch(/\n\.dots\s*\{[^}]*display:\s*none/);
  });

  it("en móvil la grilla pasa a ser una fila con snap obligatorio y sin barra de desplazamiento", () => {
    expect(mobile).toMatch(/\.carousel > :first-child\s*\{[^}]*overflow-x:\s*auto/);
    expect(mobile).toMatch(/\.carousel > :first-child\s*\{[^}]*scroll-snap-type:\s*x mandatory/);
    expect(mobile).toMatch(/\.carousel > :first-child\s*\{[^}]*scrollbar-width:\s*none/);
  });

  it("cada tarjeta es un paso del snap y deja asomar la siguiente", () => {
    expect(mobile).toMatch(/scroll-snap-align:\s*start/);
    expect(mobile).toMatch(/flex:\s*0 0 calc\(100% - [\d.]+rem\)/);
  });

  it("la tarjeta no visible se reduce con `scale`: framer escribe el transform en línea y pisaría el del CSS", () => {
    expect(mobile).toMatch(/\[data-active="false"\]\s*\{[^}]*scale:\s*0\.94/);
    expect(mobile).not.toMatch(/\[data-active="false"\]\s*\{[^}]*transform:/);
  });

  it("los puntos miden 24 px de área táctil y se animan con `scale`, sin tocar el layout", () => {
    expect(mobile).toMatch(/\.dot\s*\{[^}]*width:\s*1\.5rem/);
    expect(mobile).toMatch(/\.dot\[aria-current="true"\]::before\s*\{[^}]*scale:\s*3 1/);
  });

  it("CP-A11Y-003: con reducir movimiento, sin transiciones", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*transition:\s*none/);
  });

  it("ADR-002: sin colores escritos a mano", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});
