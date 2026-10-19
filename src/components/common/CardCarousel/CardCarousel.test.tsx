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
    // Mobile-first (BR-083): la pantalla es de escritorio cuando cumple `(min-width: 769px)`; móvil, cuando no
    matches: !mobile && query === "(min-width: 769px)",
    addEventListener: () => {},
    removeEventListener: () => {},
  }));
};

const renderCarousel = ({ desktopVisible, cards = 3 }: { desktopVisible?: number; cards?: number } = {}) =>
  render(
    <CardCarousel label="Reseñas de clientes" desktopVisible={desktopVisible}>
      <div data-testid="track">
        {Array.from({ length: cards }, (_, index) => (
          <article key={index}>{`Tarjeta ${index + 1}`}</article>
        ))}
      </div>
    </CardCarousel>,
  );

/** El observador avisa de todas las tarjetas al empezar: las indicadas, visibles; las demás, no. */
const showCards = (...visible: number[]) =>
  act(() => {
    const { callback, targets } = observers.at(-1)!;
    callback(targets.map((target, i) => ({ target, isIntersecting: visible.includes(i) })));
  });
const showCard = (index: number) => showCards(index);

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
  // Mobile-first (BR-083, ADR-009): la fila con snap es de la clase `.snap`, que el componente pone solo en móvil
  const mobile = css;

  it("en escritorio, sin desktopVisible, el envoltorio no existe (display: contents)", () => {
    expect(css).toMatch(/\n\.carousel\s*\{[^}]*display:\s*contents/);
  });

  it("en móvil la grilla pasa a ser una fila con snap obligatorio y sin barra de desplazamiento", () => {
    expect(mobile).toMatch(/\.snap > :first-child\s*\{[^}]*overflow-x:\s*auto/);
    expect(mobile).toMatch(/\.snap > :first-child\s*\{[^}]*scroll-snap-type:\s*x mandatory/);
    expect(mobile).toMatch(/\.snap > :first-child\s*\{[^}]*scrollbar-width:\s*none/);
  });

  it("la clase .snap solo se pone en móvil: en escritorio la grilla de la sección no se toca", () => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
    mockViewport(true);
    const { container, unmount } = renderCarousel();
    expect(container.firstElementChild?.className).toMatch(/snap/);
    unmount();

    mockViewport(false);
    const desktop = renderCarousel();
    expect(desktop.container.firstElementChild?.className).not.toMatch(/snap/);
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
    expect(css).toMatch(/\n\.dot\s*\{[^}]*width:\s*1\.5rem/);
    expect(css).toMatch(/\.dot\[aria-current="true"\]::before\s*\{[^}]*scale:\s*3 1/);
  });

  it("CP-A11Y-003: con reducir movimiento, sin transiciones", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*transition:\s*none/);
  });

  it("ADR-002: sin colores escritos a mano", () => {
    expect(css).not.toMatch(/#[0-9a-fA-F]{3,6}\b|rgba?\(/);
  });
});

// BR-073 (HU-EXP-004 CA-24): el carrusel también existe en escritorio, con 3 tarjetas visibles.
describe("CardCarousel en escritorio (BR-073, HU-EXP-004 CA-24)", () => {
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
    Element.prototype.setPointerCapture = vi.fn();
    Element.prototype.releasePointerCapture = vi.fn();
    Element.prototype.hasPointerCapture = vi.fn(() => true);
    // jsdom no trae PointerEvent: una versión mínima para probar el arrastre
    vi.stubGlobal(
      "PointerEvent",
      class extends MouseEvent {
        pointerType: string;
        pointerId: number;
        constructor(type: string, init: MouseEventInit & { pointerType?: string; pointerId?: number } = {}) {
          super(type, init);
          this.pointerType = init.pointerType ?? "mouse";
          this.pointerId = init.pointerId ?? 1;
        }
      },
    );
    mockViewport(false);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("con desktopVisible, en escritorio la fila es una región con nombre", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });

    const track = screen.getByTestId("track");
    expect(track.getAttribute("role")).toBe("region");
    expect(track.getAttribute("aria-label")).toBe("Reseñas de clientes");
    expect(track.tabIndex).toBe(0);
  });

  it("con 5 tarjetas y 3 visibles hay 3 posiciones: un punto por cada una, con su rango", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });
    showCards(0, 1, 2);

    const dots = screen.getAllByRole("button").filter((button) => button.getAttribute("aria-label")?.startsWith("Ver las tarjetas"));
    expect(dots).toHaveLength(3);
    expect(dots[0].getAttribute("aria-label")).toBe("Ver las tarjetas 1 a 3 de 5");
    expect(dots[2].getAttribute("aria-label")).toBe("Ver las tarjetas 3 a 5 de 5");
    expect(dots[0].getAttribute("aria-current")).toBe("true");
  });

  it("la posición actual es la de la primera tarjeta visible", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });
    showCards(1, 2, 3);

    const dots = screen.getAllByRole("button").filter((button) => button.getAttribute("aria-label")?.startsWith("Ver las tarjetas"));
    expect(dots[1].getAttribute("aria-current")).toBe("true");
    expect(dots[0].hasAttribute("aria-current")).toBe(false);
  });

  it("hay flechas anterior y siguiente; la anterior está deshabilitada al comienzo", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });
    showCards(0, 1, 2);

    expect((screen.getByRole("button", { name: "Tarjeta anterior" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Tarjeta siguiente" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("la flecha siguiente está deshabilitada en el último extremo", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });
    showCards(2, 3, 4);

    expect((screen.getByRole("button", { name: "Tarjeta siguiente" }) as HTMLButtonElement).disabled).toBe(true);
    expect((screen.getByRole("button", { name: "Tarjeta anterior" }) as HTMLButtonElement).disabled).toBe(false);
  });

  it("las flechas y los puntos mueven solo la fila (scrollBy)", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });
    showCards(0, 1, 2);

    fireEvent.click(screen.getByRole("button", { name: "Tarjeta siguiente" }));
    fireEvent.click(screen.getByRole("button", { name: "Ver las tarjetas 3 a 5 de 5" }));

    expect(Element.prototype.scrollBy).toHaveBeenCalledTimes(2);
  });

  it("con 3 tarjetas o menos y 3 visibles no hay nada que desplazar: sin flechas ni puntos", () => {
    renderCarousel({ desktopVisible: 3, cards: 3 });
    showCards(0, 1, 2);

    expect(screen.queryByRole("button")).toBeNull();
  });

  it("en móvil, con desktopVisible, sigue siendo un punto por tarjeta y sin flechas", () => {
    mockViewport(true);
    renderCarousel({ desktopVisible: 3, cards: 5 });
    showCard(0);

    expect(screen.queryByRole("button", { name: "Tarjeta siguiente" })).toBeNull();
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(screen.getAllByRole("button")[0].getAttribute("aria-label")).toBe("Ir a la tarjeta 1 de 5");
  });

  it("arrastre con el ratón: sin snap mientras se arrastra, y la fila se mueve con el puntero", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });
    const track = screen.getByTestId("track");
    track.scrollLeft = 100;

    fireEvent(track, new PointerEvent("pointerdown", { clientX: 300, button: 0, pointerType: "mouse", bubbles: true }));
    expect(track.dataset.dragging).toBe("true");
    expect(track.style.scrollSnapType).toBe("none");

    fireEvent(track, new PointerEvent("pointermove", { clientX: 250, pointerType: "mouse", bubbles: true }));
    expect(track.scrollLeft).toBe(150);

    fireEvent(track, new PointerEvent("pointerup", { clientX: 250, pointerType: "mouse", bubbles: true }));
    expect(track.dataset.dragging).toBeUndefined();
    expect(track.style.scrollSnapType).toBe("");
  });

  it("el dedo y el trackpad no se tratan como arrastre: desplazan por sí solos", () => {
    renderCarousel({ desktopVisible: 3, cards: 5 });
    const track = screen.getByTestId("track");

    fireEvent(track, new PointerEvent("pointerdown", { clientX: 300, button: 0, pointerType: "touch", bubbles: true }));

    expect(track.dataset.dragging).toBeUndefined();
  });

  it("regla 6: los únicos oyentes son los del puntero, no el scroll", () => {
    expect(source).not.toMatch(/addEventListener\(\s*["']scroll["']/);
  });
});

describe("CardCarousel en escritorio: estilos (BR-073)", () => {
  const desktop = css.match(/@media \(min-width: 769px\)\s*\{([\s\S]*?)\n\}/)?.[1] ?? "";

  it("la fila de escritorio es horizontal, con snap y sin barra, y deja aire arriba y abajo para el hover", () => {
    expect(desktop).toMatch(/\.desktop > :first-child\s*\{[^}]*overflow-x:\s*auto/);
    expect(desktop).toMatch(/\.desktop > :first-child\s*\{[^}]*scroll-snap-type:\s*x mandatory/);
    expect(desktop).toMatch(/\.desktop > :first-child\s*\{[^}]*scrollbar-width:\s*none/);
    expect(desktop).toMatch(/\.desktop > :first-child\s*\{[^}]*padding-block:/);
  });

  it("cada tarjeta mide un tercio (o 1/N) de la fila, descontando los espacios", () => {
    expect(desktop).toMatch(/flex:\s*0 0 calc\(\(100% - \(var\(--carousel-visible, 3\) - 1\) \* var\(--carousel-gap\)\) \/ var\(--carousel-visible, 3\)\)/);
  });

  it("las flechas solo existen en escritorio (ocultas por defecto) y son rojas con la flecha blanca", () => {
    expect(css).toMatch(/\n\.arrow\s*\{[^}]*display:\s*none/);
    expect(desktop).toMatch(/\.arrow\s*\{[^}]*display:\s*grid/);
    expect(desktop).toMatch(/\.arrow\s*\{[^}]*background:\s*var\(--color-brand-primary\)/);
    expect(desktop).toMatch(/\.arrow\s*\{[^}]*color:\s*var\(--color-brand-white\)/);
  });

  it("al arrastrar, el cursor cambia y no se selecciona el texto", () => {
    expect(desktop).toMatch(/\[data-dragging="true"\]\s*\{[^}]*cursor:\s*grabbing/);
    expect(desktop).toMatch(/\[data-dragging="true"\]\s*\{[^}]*user-select:\s*none/);
  });

  it("CP-A11Y-003: con reducir movimiento, las flechas no animan", () => {
    expect(css).toMatch(/@media \(prefers-reduced-motion: reduce\)\s*\{[^@]*\.arrow[^{]*\{[^}]*transition:\s*none/);
  });
});
