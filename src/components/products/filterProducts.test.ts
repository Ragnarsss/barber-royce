import { describe, expect, it } from "vitest";
import type { Product } from "@/types/product.types";
import { filterProducts } from "./filterProducts";

// BR-067 (HU-INFO-004 CA-02): buscar por texto y filtrar por categoría.
const product = (name: string, description: string, category: Product["category"]): Product => ({
  id: name.toLowerCase().replace(/s+/g, "-"),
  name,
  description,
  price: "$10.000",
  image: "",
  category,
});
const catalog = [
  product("Pomada Mate", "Fijación fuerte sin brillo", "Styling"),
  product("Aceite para barba", "Suaviza y da brillo", "Barba"),
  product("Shampoo Cuidado Diario", "Limpieza suave", "Cuidado"),
  product("Kit de Navidad", "Pomada y aceite", "Kits"),
];

describe("filterProducts (BR-067, HU-INFO-004 CA-02)", () => {
  it("«Todos» y sin texto devuelve el catálogo completo, en su orden", () => {
    expect(filterProducts(catalog, "", "Todos")).toEqual(catalog);
  });

  it("filtra por categoría", () => {
    expect(filterProducts(catalog, "", "Barba").map((p) => p.name)).toEqual(["Aceite para barba"]);
    expect(filterProducts(catalog, "", "Kits").map((p) => p.name)).toEqual(["Kit de Navidad"]);
  });

  it("busca en el nombre y en la descripción, sin distinguir mayúsculas", () => {
    expect(filterProducts(catalog, "POMADA", "Todos").map((p) => p.name)).toEqual(["Pomada Mate", "Kit de Navidad"]);
    expect(filterProducts(catalog, "brillo", "Todos").map((p) => p.name)).toEqual(["Pomada Mate", "Aceite para barba"]);
  });

  it("ignora los espacios al inicio y al final del texto", () => {
    expect(filterProducts(catalog, "  shampoo ", "Todos").map((p) => p.name)).toEqual(["Shampoo Cuidado Diario"]);
  });

  it("combina categoría y texto: tienen que cumplirse las dos", () => {
    expect(filterProducts(catalog, "pomada", "Styling").map((p) => p.name)).toEqual(["Pomada Mate"]);
    expect(filterProducts(catalog, "pomada", "Barba")).toEqual([]);
  });

  it("sin coincidencias devuelve una lista vacía", () => {
    expect(filterProducts(catalog, "zzz", "Todos")).toEqual([]);
  });
});
