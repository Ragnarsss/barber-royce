import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type Lenis from "lenis";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-067 (HU-EXP-004 CA-18, HU-INFO-004 CA-01 y CA-02): el catálogo de productos en panal, con ficha y filtros.
vi.mock("virtual:site-content", async () => {
  const { snapshot } = await import("@/content/snapshot");
  return {
    default: {
      ...snapshot,
      products: [
        { id: "pomada-mate", name: "Pomada Mate", description: "Fijación fuerte sin brillo", price: "$12.990", image: "/pomada.jpg", category: "Styling" },
        { id: "aceite-barba", name: "Aceite para barba", description: "Suaviza y da brillo", price: "$9.990", image: "/aceite.jpg", category: "Barba" },
        { id: "shampoo-diario", name: "Shampoo diario", description: "Limpieza suave", price: "$7.490", image: "/shampoo.jpg", category: "Cuidado" },
        { id: "kit-navidad", name: "Kit de navidad", description: "Pomada y aceite", price: "$24.990", image: "/kit.jpg", category: "Kits" },
      ],
    },
  };
});
vi.mock("virtual:site-sheet", () => ({ default: null }));

import { ProductsPage } from "./ProductsPage";

const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "ProductsPage.module.css"), "utf8");
const dialogCss = readFileSync(resolve(here, "../components/products/ProductDialog.module.css"), "utf8");

const renderPage = () => {
  const lenis = { stop: vi.fn(), start: vi.fn() };
  renderWithProviders(
    <LenisContext value={lenis as unknown as Lenis}>
      <ProductsPage />
    </LenisContext>,
    { route: "/productos" },
  );
  return lenis;
};
const hexagons = () => screen.getAllByRole("listitem").map((item) => within(item).getByRole("button").getAttribute("aria-label"));

describe("ProductsPage en panal (BR-067)", () => {
  beforeAll(() => {
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
      },
    );
  });

  it("CA-18: muestra cada producto como un hexágono con su nombre y su precio", () => {
    renderPage();
    expect(hexagons()).toEqual(["Pomada Mate, $12.990", "Aceite para barba, $9.990", "Shampoo diario, $7.490", "Kit de navidad, $24.990"]);
    expect(screen.getByRole("heading", { level: 1, name: "Productos premium" })).toBeInTheDocument();
  });

  it("BR-009: no hay botón «Comprar» en la página ni en la ficha", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.queryByText(/comprar/i)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: /Pomada Mate/ }));
    expect(screen.queryByText(/comprar/i)).not.toBeInTheDocument();
  });

  it("CA-02: filtrar por categoría deja solo esos productos y marca el botón activo", async () => {
    const user = userEvent.setup();
    renderPage();
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");

    await user.click(screen.getByRole("button", { name: "Barba" }));

    expect(hexagons()).toEqual(["Aceite para barba, $9.990"]);
    expect(screen.getByRole("button", { name: "Barba" })).toHaveAttribute("aria-pressed", "true");
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "false");
  });

  it("CA-02: buscar por texto filtra por nombre y descripción, y el cuadro se actualiza al escribir", async () => {
    const user = userEvent.setup();
    renderPage();
    const search = screen.getByRole("textbox", { name: "Buscar productos" });

    await user.type(search, "pomada");

    expect(search).toHaveValue("pomada");
    await waitFor(() => expect(hexagons()).toEqual(["Pomada Mate, $12.990", "Kit de navidad, $24.990"]));
  });

  it("sin resultados muestra el estado vacío y «Limpiar filtros» devuelve todo el catálogo", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.type(screen.getByRole("textbox", { name: "Buscar productos" }), "zzz");

    expect(await screen.findByRole("status")).toHaveTextContent("No se encontraron productos");
    expect(screen.queryAllByRole("listitem")).toHaveLength(0);

    await user.click(screen.getByRole("button", { name: "Limpiar filtros" }));

    await waitFor(() => expect(hexagons()).toHaveLength(4));
    expect(screen.getByRole("textbox", { name: "Buscar productos" })).toHaveValue("");
    expect(screen.getByRole("button", { name: "Todos" })).toHaveAttribute("aria-pressed", "true");
  });

  it("CA-18: activar un producto abre su ficha con categoría, nombre, descripción y precio", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Aceite para barba/ }));

    const dialog = screen.getByRole("dialog", { name: "Aceite para barba" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(within(dialog).getByText("Barba")).toBeInTheDocument();
    expect(dialog).toHaveAccessibleDescription("Suaviza y da brillo");
    expect(within(dialog).getByText("$9.990")).toBeInTheDocument();
    expect(within(dialog).getByText(/Precio:/)).toBeInTheDocument();
    expect(within(dialog).getByRole("img", { name: "Aceite para barba" })).toHaveAttribute("src", "/aceite.jpg");
  });

  it("la ficha atrapa el foco, Escape la cierra, el foco vuelve al hexágono y Lenis se detiene y se reanuda", async () => {
    const user = userEvent.setup();
    const lenis = renderPage();
    const hexagon = screen.getByRole("button", { name: /Shampoo diario/ });
    hexagon.focus();
    await user.click(hexagon);

    expect(screen.getByRole("button", { name: "Cerrar ficha" })).toHaveFocus();
    expect(lenis.stop).toHaveBeenCalled();
    await user.tab();
    expect(screen.getByRole("button", { name: "Cerrar ficha" })).toHaveFocus();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
    await waitFor(() => expect(hexagon).toHaveFocus());
    await waitFor(() => expect(lenis.start).toHaveBeenCalled());
  });

  it("un clic en el fondo oscuro cierra la ficha", async () => {
    const user = userEvent.setup();
    renderPage();
    await user.click(screen.getByRole("button", { name: /Kit de navidad/ }));
    await user.click(screen.getByTestId("dialog-backdrop"));

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("ningún color escrito a mano en los estilos de la página ni de la ficha (ADR-002)", () => {
    for (const source of [css, dialogCss]) {
      expect(source).not.toMatch(/#[0-9a-f]{3,8}\b/i);
      expect(source).not.toMatch(/rgba?\(/);
    }
  });
});
