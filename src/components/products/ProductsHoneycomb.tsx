import type { Product } from "@/types/product.types";
import { Honeycomb } from "@/components/common/Honeycomb/Honeycomb";
import { buildFixedHoneycomb, PRODUCT_DESKTOP_PER_ROW } from "@/components/common/Honeycomb/honeycombLayout";

interface ProductsHoneycombProps {
  products: Product[];
  /** Se llama al activar un producto (clic, Enter o Espacio). */
  onSelect?: (product: Product) => void;
}

/** Las fotos de los productos son apaisadas (400 × 300): se recortan al hexágono con `object-fit: cover`. */
const PHOTO_HEIGHT = 300;

/**
 * Panal del catálogo de productos (BR-067, HU-EXP-004 CA-18): todos del mismo tamaño y con marco blanco; al pasar el
 * cursor o enfocar uno se ilumina y se ven su nombre y su precio. La primera fila trae sus fotos con prioridad, porque
 * una de ellas decide el LCP de la página.
 */
export const ProductsHoneycomb = ({ products, onSelect }: ProductsHoneycombProps) => {
  const { cells, desktop, mobile } = buildFixedHoneycomb(products.length);

  return (
    <Honeycomb
      desktop={desktop}
      mobile={mobile}
      items={products.map((product, index) => ({
        key: `${product.name}|${product.category}`,
        image: product.image,
        imageAlt: product.name,
        imageHeight: PHOTO_HEIGHT,
        label: `${product.name}, ${product.price}`,
        title: product.name,
        subtitle: product.price,
        eager: index < PRODUCT_DESKTOP_PER_ROW,
        desktop: cells[index].desktop,
        mobile: cells[index].mobile,
        onSelect: () => onSelect?.(product),
      }))}
    />
  );
};
