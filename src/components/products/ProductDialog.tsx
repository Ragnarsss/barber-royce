import { useId } from "react";
import type { Product } from "@/types/product.types";
import { ModalDialog, ModalSplit } from "@/components/common/ModalDialog/ModalDialog";
import styles from "./ProductDialog.module.css";

interface ProductDialogProps {
  product: Product;
  onClose: () => void;
}

/**
 * Ficha de un producto (BR-067, HU-EXP-004 CA-18): la foto a un tercio, que se funde hacia el negro, y la categoría,
 * el nombre en grande, la descripción y el precio. No hay botón de compra: por ahora el sitio no vende (`BR-009`).
 * El comportamiento del diálogo (foco, Escape, fondo, Lenis) es el de `ModalDialog`.
 */
export const ProductDialog = ({ product, onClose }: ProductDialogProps) => {
  const titleId = useId();
  const descriptionId = useId();

  return (
    <ModalDialog onClose={onClose} titleId={titleId} descriptionId={product.description ? descriptionId : undefined} split>
      <ModalSplit image={product.image} alt={product.name} imageHeight={300}>
        <p className={styles.category}>{product.category}</p>
        <h2 id={titleId} className={styles.name}>
          {product.name}
        </h2>
        <div className="glass-divider" aria-hidden="true" />
        {product.description && (
          <p id={descriptionId} className={styles.description}>
            {product.description}
          </p>
        )}
        <p className={styles.price}>
          <span className="sr-only">Precio: </span>
          {product.price}
        </p>
      </ModalSplit>
    </ModalDialog>
  );
};
