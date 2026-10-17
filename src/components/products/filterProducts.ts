import type { Product, ProductCategory } from "@/types/product.types";

/** Productos que cumplen la categoría («Todos» las admite todas) y contienen el texto en el nombre o la descripción. */
export function filterProducts(products: Product[], query: string, category: ProductCategory): Product[] {
  const text = query.trim().toLowerCase();
  return products.filter((product) => {
    const matchesText = text === "" || product.name.toLowerCase().includes(text) || product.description.toLowerCase().includes(text);
    const matchesCategory = category === "Todos" || product.category === category;
    return matchesText && matchesCategory;
  });
}
