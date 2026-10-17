import { beforeAll, describe, expect, it, vi } from "vitest";
import { fireEvent, screen } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { Honeycomb, type HoneycombItem } from "./Honeycomb";
import { buildFixedHoneycomb } from "./honeycombLayout";

// BR-067: el panal genérico, con la foto que puede faltar o fallar (las de Unsplash a veces dan 404).
const names = ["Pomada", "Cera", "Aceite"];
const layout = buildFixedHoneycomb(names.length);
const items = (images: string[]): HoneycombItem[] =>
  names.map((name, index) => ({
    key: name,
    image: images[index],
    imageAlt: name,
    label: `${name}, $10`,
    title: name,
    subtitle: "$10",
    desktop: layout.cells[index].desktop,
    mobile: layout.cells[index].mobile,
  }));
const renderPanal = (images: string[], onSelect?: () => void) =>
  renderWithProviders(
    <Honeycomb desktop={layout.desktop} mobile={layout.mobile} items={items(images).map((item) => ({ ...item, onSelect }))} />,
  );

describe("Honeycomb (BR-067)", () => {
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

  it("cada hexágono es un botón con su nombre accesible y su foto", () => {
    const { container } = renderPanal(["/a.jpg", "/b.jpg", "/c.jpg"]);
    expect(screen.getAllByRole("button").map((button) => button.getAttribute("aria-label"))).toEqual(["Pomada, $10", "Cera, $10", "Aceite, $10"]);
    expect(container.querySelectorAll("img")).toHaveLength(3);
    expect(container.querySelectorAll("[data-empty]")).toHaveLength(0);
  });

  it("sin dirección de foto no hay <img> y el título queda a la vista", () => {
    const { container } = renderPanal(["/a.jpg", "", "/c.jpg"]);
    const empty = container.querySelectorAll("[data-empty]");
    expect(empty).toHaveLength(1);
    expect(empty[0]).toHaveAttribute("aria-label", "Cera, $10");
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });

  it("si la foto falla al cargar, se quita y el hexágono pasa a mostrar su título", () => {
    const { container } = renderPanal(["/a.jpg", "/rota.jpg", "/c.jpg"]);
    fireEvent.error(container.querySelector('img[src="/rota.jpg"]') as HTMLImageElement);

    expect(container.querySelector('img[src="/rota.jpg"]')).toBeNull();
    expect(container.querySelectorAll("img")).toHaveLength(2);
    expect(screen.getByRole("button", { name: "Cera, $10" })).toHaveAttribute("data-empty");
    expect(screen.getByRole("button", { name: "Pomada, $10" })).not.toHaveAttribute("data-empty");
  });

  it("activar un hexágono llama a su acción", () => {
    const onSelect = vi.fn();
    renderPanal(["/a.jpg", "/b.jpg", "/c.jpg"], onSelect);
    fireEvent.click(screen.getByRole("button", { name: "Aceite, $10" }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
