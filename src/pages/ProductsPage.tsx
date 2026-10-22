import { useDeferredValue, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { BackToTop } from "@/components/common/BackToTop/BackToTop";
import { HoneycombPage } from "@/components/common/HoneycombPage/HoneycombPage";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { Search } from "lucide-react";
import { filterProducts } from "@/components/products/filterProducts";
import { ProductDialog } from "@/components/products/ProductDialog";
import { ProductsCatalog } from "@/components/products/ProductsCatalog";
import { ROUTES } from "@/config/routes";
import { useSiteContent } from "@/content/useSiteContent";
import { PRODUCT_CATEGORIES, type Product, type ProductCategory } from "@/types/product.types";
import styles from "./ProductsPage.module.css";

/**
 * Catálogo de productos (BR-067): el panal de hexágonos sobre las diagonales del hero, con buscador y filtros por
 * categoría. Cada producto abre su ficha en un diálogo. Sin botón de compra (`BR-009`).
 */
export function ProductsPage() {
  const products = useSiteContent().products;
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<ProductCategory>("Todos");
  const [selected, setSelected] = useState<Product | null>(null);

  // El texto del cuadro se actualiza al instante; el panal se reacomoda con el valor diferido, sin trabar la escritura.
  const deferredQuery = useDeferredValue(query);
  const filtered = filterProducts(products, deferredQuery, category);
  const isPending = query !== deferredQuery;

  const clearFilters = () => {
    setQuery("");
    setCategory("Todos");
  };

  return (
    <>
      <SEOHelmet route={ROUTES.products} />
      <HoneycombPage title="Productos premium" subtitle="Las mejores marcas para tu cuidado diario">
        <div className={styles.filters}>
          <div className={styles.search}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              className={`glass-field ${styles.searchInput}`}
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>

          <div className={styles.categories}>
            {PRODUCT_CATEGORIES.map((option) => (
              <button
                key={option}
                type="button"
                className={`glass-chip ${styles.category}`}
                aria-pressed={category === option}
                onClick={() => setCategory(option)}
              >
                {option}
              </button>
            ))}
          </div>

          <div className={`glass-divider ${styles.divider}`} aria-hidden="true" />
        </div>

        <div className={styles.results} data-pending={isPending || undefined}>
          {filtered.length === 0 ? (
            <div className={styles.empty} role="status">
              <p>No se encontraron productos que coincidan con tu búsqueda.</p>
              <button type="button" className={`glass-chip ${styles.clear}`} onClick={clearFilters}>
                Limpiar filtros
              </button>
            </div>
          ) : (
            <ProductsCatalog key={`${category}|${deferredQuery}`} products={filtered} onSelect={setSelected} />
          )}
        </div>
      </HoneycombPage>

      <BackToTop />

      <AnimatePresence>
        {selected && <ProductDialog key={selected.id} product={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
}
