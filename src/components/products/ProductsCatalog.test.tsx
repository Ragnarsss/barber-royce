import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen, within } from "@testing-library/react";
import type { Product } from "@/types/product.types";
import { PLACEHOLDER_COUNT, PRODUCTS_PER_BATCH } from "./catalog";
import { ProductsCatalog } from "./ProductsCatalog";

// BR-068 (HU-EXP-004 CA-19): carga progresiva del catálogo, con hexágonos grises de relleno.
interface FakeObserver {
  callback: IntersectionObserverCallback;
  targets: Element[];
  disconnected: boolean;
}
let observers: FakeObserver[] = [];

/** Avisa que el centinela entró (o no) en pantalla, como haría el navegador al desplazarse. */
const reachSentinel = (isIntersecting = true) => {
  const live = observers.filter((observer) => !observer.disconnected && observer.targets.some((target) => target.hasAttribute("data-sentinel")));
  const observer = live[live.length - 1];
  if (!observer) throw new Error("No hay un observador activo sobre el centinela");
  const target = observer.targets.find((candidate) => candidate.hasAttribute("data-sentinel")) as Element;
  act(() => observer.callback([{ isIntersecting, target } as IntersectionObserverEntry], {} as IntersectionObserver));
};

const products = (count: number): Product[] =>
  Array.from({ length: count }, (_, i) => ({
    id: `producto-${i + 1}`,
    name: `Producto ${i + 1}`,
    description: "Descripción",
    price: `$${(i + 1) * 1000}`,
    image: "",
    category: "Styling",
  }));

const renderCatalog = (count: number, onSelect = vi.fn()) => {
  const view = render(<ProductsCatalog products={products(count)} onSelect={onSelect} />);
  return { ...view, onSelect };
};
const shown = () => screen.queryAllByRole("button").filter((button) => button.getAttribute("aria-label")?.startsWith("Producto "));
const placeholders = (container: HTMLElement) => container.querySelectorAll("li[aria-hidden='true']");

describe("ProductsCatalog: carga progresiva (BR-068)", () => {
  beforeEach(() => {
    observers = [];
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        private readonly state: FakeObserver;
        constructor(callback: IntersectionObserverCallback) {
          this.state = { callback, targets: [], disconnected: false };
          observers.push(this.state);
        }
        observe(target: Element) {
          this.state.targets.push(target);
        }
        unobserve() {}
        disconnect() {
          this.state.disconnected = true;
        }
      },
    );
  });
  afterEach(() => vi.unstubAllGlobals());

  it("el lote y el relleno completan filas enteras en escritorio (3) y en móvil (2)", () => {
    expect(PRODUCTS_PER_BATCH % 3).toBe(0);
    expect(PRODUCTS_PER_BATCH % 2).toBe(0);
    expect(PLACEHOLDER_COUNT % 3).toBe(0);
    expect(PLACEHOLDER_COUNT % 2).toBe(0);
  });

  it("con un lote o menos se ven todos y no hay relleno, centinela ni botón", () => {
    const { container } = renderCatalog(PRODUCTS_PER_BATCH);

    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH);
    expect(placeholders(container)).toHaveLength(0);
    expect(container.querySelector("[data-sentinel]")).toBeNull();
    expect(screen.queryByRole("button", { name: "Ver más productos" })).not.toBeInTheDocument();
  });

  it("con más de un lote se ve el primero, con una fila de relleno gris y un centinela debajo", () => {
    const { container } = renderCatalog(30);

    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH);
    expect(placeholders(container)).toHaveLength(PLACEHOLDER_COUNT);
    expect(container.querySelector("[data-sentinel]")).not.toBeNull();
    expect(screen.getByRole("button", { name: "Ver más productos" })).toBeInTheDocument();
  });

  it("el relleno es decorativo: no es un botón ni entra en el orden del teclado", () => {
    const { container } = renderCatalog(30);

    for (const ghost of placeholders(container)) {
      expect(within(ghost as HTMLElement).queryByRole("button")).toBeNull();
      expect(ghost.textContent).toBe("");
    }
    expect(screen.getAllByRole("button", { name: /^Producto / })).toHaveLength(PRODUCTS_PER_BATCH);
  });

  it("al llegar al centinela se suma el siguiente lote, y al terminar desaparecen relleno, centinela y botón", () => {
    const { container } = renderCatalog(30);

    reachSentinel();
    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH * 2);
    expect(placeholders(container)).toHaveLength(PLACEHOLDER_COUNT);

    reachSentinel();
    expect(shown()).toHaveLength(30);
    expect(placeholders(container)).toHaveLength(0);
    expect(container.querySelector("[data-sentinel]")).toBeNull();
    expect(screen.queryByRole("button", { name: "Ver más productos" })).not.toBeInTheDocument();
  });

  // BR-089 (HU-EXP-004 CA-33): contador de avance y encendido en ola de cada lote nuevo.
  it("con más de un lote muestra «Ves 12 de 30» y «Viste los 30 productos» al llegar al final, solo en el texto visual", () => {
    const { container } = renderCatalog(30);
    const progress = () => container.querySelector("[aria-hidden='true'] p");

    expect(progress()?.textContent).toBe(`Ves ${PRODUCTS_PER_BATCH} de 30`);
    reachSentinel();
    expect(progress()?.textContent).toBe(`Ves ${PRODUCTS_PER_BATCH * 2} de 30`);
    reachSentinel();
    expect(progress()?.textContent).toBe("Viste los 30 productos");
    // El lector de pantalla oye el aviso aria-live, no este texto repetido.
    expect(progress()?.closest("[aria-hidden='true']")).not.toBeNull();
  });

  it("con un lote o menos no hay contador", () => {
    const { container } = renderCatalog(PRODUCTS_PER_BATCH);

    expect(container.textContent).not.toMatch(/Ves \d+ de/);
  });

  it("el primer lote no se enciende; el que llega después sí, y los anteriores se quedan en reposo", () => {
    const { container } = renderCatalog(30);
    const igniting = () => container.querySelectorAll("li[data-ignite]");

    expect(igniting()).toHaveLength(0);

    reachSentinel();
    expect(igniting()).toHaveLength(PRODUCTS_PER_BATCH);
    const first = container.querySelector("li[data-ignite]") as HTMLElement;
    expect(first.getAttribute("aria-hidden")).toBeNull();
    expect(within(first).getByRole("button").getAttribute("aria-label")).toBe(`Producto ${PRODUCTS_PER_BATCH + 1}, $${(PRODUCTS_PER_BATCH + 1) * 1000}`);
  });

  it("la ola avanza en diagonal: el retraso crece por columna y por fila, y el primer hexágono sale antes que el resto", () => {
    const { container } = renderCatalog(30);
    reachSentinel();

    const delays = [...container.querySelectorAll<HTMLElement>("li[data-ignite]")].map((cell) =>
      Number.parseInt(cell.style.getPropertyValue("--ignite-delay"), 10),
    );

    expect(delays).toHaveLength(PRODUCTS_PER_BATCH);
    expect(delays[0]).toBeLessThan(delays[1]);
    expect(delays[1]).toBeLessThan(delays[2]);
    // Primer hexágono de la segunda fila: tan lejos de la esquina como el segundo de la primera.
    expect(delays[3]).toBe(delays[1]);
    expect(Math.min(...delays)).toBe(delays[0]);
  });

  it("si el centinela todavía no está a la vista no se carga nada (el desplazamiento solo cambia el estado al cruzarlo)", () => {
    renderCatalog(30);

    reachSentinel(false);

    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH);
  });

  it("«Ver más productos» carga el siguiente lote sin necesidad de desplazarse (teclado y lectores de pantalla)", () => {
    renderCatalog(30);

    fireEvent.click(screen.getByRole("button", { name: "Ver más productos" }));

    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH * 2);
  });

  it("una región en vivo anuncia cuántos productos llegaron y cuántos se ven", () => {
    const { container } = renderCatalog(30);
    const live = container.querySelector("[aria-live='polite']") as HTMLElement;
    expect(live).not.toBeNull();
    expect(live).toHaveTextContent("");

    reachSentinel();
    expect(live).toHaveTextContent(`Se cargaron ${PRODUCTS_PER_BATCH} productos más. Ves ${PRODUCTS_PER_BATCH * 2} de 30.`);

    reachSentinel();
    expect(live).toHaveTextContent("Se cargaron 6 productos más. Ves 30 de 30.");
  });

  it("el último lote puede ser más corto y el anuncio dice la cantidad exacta", () => {
    const { container } = renderCatalog(PRODUCTS_PER_BATCH + 1);

    fireEvent.click(screen.getByRole("button", { name: "Ver más productos" }));

    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH + 1);
    expect(container.querySelector("[aria-live='polite']")).toHaveTextContent("Se cargó 1 producto más.");
  });

  it("al cambiar de lista (otro filtro) vuelve a un lote", () => {
    const { rerender } = render(<ProductsCatalog key="todos" products={products(30)} onSelect={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Ver más productos" }));
    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH * 2);

    rerender(<ProductsCatalog key="styling" products={products(25)} onSelect={vi.fn()} />);

    expect(shown()).toHaveLength(PRODUCTS_PER_BATCH);
  });

  it("activar un producto avisa cuál fue", () => {
    const { onSelect } = renderCatalog(30);

    fireEvent.click(screen.getByRole("button", { name: "Producto 3, $3000" }));

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ id: "producto-3" }));
  });

  it("sin productos no dibuja nada", () => {
    const { container } = renderCatalog(0);

    expect(shown()).toHaveLength(0);
    expect(placeholders(container)).toHaveLength(0);
  });
});
