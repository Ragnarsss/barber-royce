import type { Product } from "@/types/product.types";
import { Honeycomb } from "@/components/common/Honeycomb/Honeycomb";
import { buildFixedHoneycomb } from "@/components/common/Honeycomb/honeycombLayout";

interface ProductsHoneycombProps {
  products: Product[];
  /** Hexágonos grises de relleno que se suman al final mientras llegan más productos (BR-068). */
  placeholders?: number;
  /** Se llama al activar un producto (clic, Enter o Espacio). */
  onSelect?: (product: Product) => void;
}

/** Las fotos de los productos son apaisadas (400 × 300): se recortan al hexágono con `object-fit: cover`. */
const PHOTO_HEIGHT = 300;

/** Fotos que se piden con prioridad y sin animación de entrada: las dos primeras filas de escritorio (tres de móvil). */
const EAGER_PHOTOS = 6;

/**
 * Panal del catálogo de productos (BR-067, HU-EXP-004 CA-18): todos del mismo tamaño y con marco blanco; al pasar el
 * cursor o enfocar uno se ilumina y se ven su nombre y su precio. Las dos primeras filas traen sus fotos con prioridad:
 * una de ellas decide el LCP de la página y todas se ven sin bajar.
 */
export const ProductsHoneycomb = ({ products, placeholders = 0, onSelect }: ProductsHoneycombProps) => {
  const { cells, desktop, mobile } = buildFixedHoneycomb(products.length + placeholders);

  return (
    <Honeycomb
      desktop={desktop}
      mobile={mobile}
      items={[
        ...products.map((product, index) => ({
          key: product.id,
          image: product.image,
          imageAlt: product.name,
          imageHeight: PHOTO_HEIGHT,
          label: `${product.name}, ${product.price}`,
          title: product.name,
          subtitle: product.price,
          eager: index < EAGER_PHOTOS,
          desktop: cells[index].desktop,
          mobile: cells[index].mobile,
          onSelect: () => onSelect?.(product),
        })),
        ...Array.from({ length: placeholders }, (_, i) => ({
          key: `relleno-${i}`,
          placeholder: true as const,
          desktop: cells[products.length + i].desktop,
          mobile: cells[products.length + i].mobile,
        })),
      ]}
    />
  );
};
