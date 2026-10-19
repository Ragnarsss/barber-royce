import { useCallback, useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product.types";
import { LOAD_MARGIN, PLACEHOLDER_COUNT, PRODUCTS_PER_BATCH } from "./catalog";
import { ProductsHoneycomb } from "./ProductsHoneycomb";
import styles from "./ProductsCatalog.module.css";

interface ProductsCatalogProps {
  products: Product[];
  /** Se llama al activar un producto (clic, Enter o Espacio). */
  onSelect?: (product: Product) => void;
}

/** Aviso para lectores de pantalla: cuántos productos llegaron y cuántos se ven de cuántos hay. */
const announce = (loaded: number, shown: number, total: number) =>
  `${loaded === 1 ? "Se cargó 1 producto más." : `Se cargaron ${loaded} productos más.`} Ves ${shown} de ${total}.`;

/**
 * Catálogo con carga progresiva (BR-068, HU-EXP-004 CA-19). Muestra un lote y, mientras queden productos, una fila de
 * hexágonos grises de relleno; al acercarse al final suma el siguiente. Se vuelve a un lote al cambiar de lista: el
 * padre lo monta con una `key` distinta para cada filtro.
 *
 * El estado cambia solo cuando el centinela cruza el borde de la pantalla (`IntersectionObserver`), nunca por cada
 * evento de scroll. «Ver más productos» hace lo mismo sin desplazarse, para quien navega con teclado o lector de
 * pantalla, y una región `aria-live` anuncia lo que llegó.
 */
export const ProductsCatalog = ({ products, onSelect }: ProductsCatalogProps) => {
  const [visible, setVisible] = useState(PRODUCTS_PER_BATCH);
  const [announcement, setAnnouncement] = useState("");
  // Desde qué producto llegó el último lote: esos hexágonos se encienden en ola (BR-089). El primer lote no.
  const [igniteFrom, setIgniteFrom] = useState<number>();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasMore = visible < products.length;

  const loadMore = useCallback(() => {
    const next = Math.min(visible + PRODUCTS_PER_BATCH, products.length);
    setIgniteFrom(visible);
    setVisible(next);
    setAnnouncement(announce(next - visible, next, products.length));
  }, [visible, products.length]);

  // Se observa de nuevo tras cada lote: si el centinela sigue a la vista, el navegador avisa otra vez y se pide el siguiente.
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!hasMore || !sentinel) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) loadMore();
      },
      { rootMargin: LOAD_MARGIN },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      <ProductsHoneycomb
        products={products.slice(0, visible)}
        placeholders={hasMore ? PLACEHOLDER_COUNT : 0}
        onSelect={onSelect}
        igniteFrom={igniteFrom}
      />

      {/* Cuántos se ven y cuántos hay: solo si la lista no cabe en un lote. Para lectores de pantalla, el aviso aria-live. */}
      {products.length > PRODUCTS_PER_BATCH && (
        <div className={styles.progress} aria-hidden="true">
          <p className={styles.progressText}>
            {hasMore ? `Ves ${visible} de ${products.length}` : `Viste los ${products.length} productos`}
          </p>
          <span className={styles.progressTrack}>
            <span className={styles.progressFill} style={{ transform: `scaleX(${visible / products.length})` }} />
          </span>
        </div>
      )}

      {hasMore && (
        <>
          <div ref={sentinelRef} className={styles.sentinel} data-sentinel aria-hidden="true" />
          <button type="button" className={styles.more} onClick={loadMore}>
            Ver más productos
          </button>
        </>
      )}

      <div className="sr-only" aria-live="polite">
        {announcement}
      </div>
    </>
  );
};
