import styles from "./PageBackdrop.module.css";

interface PageBackdropProps {
  /** Clase de quien lo usa, para acotar su alto o el tamaño de los triángulos con las variables del módulo. */
  className?: string;
}

/**
 * Las diagonales del hero (BR-055, BR-060, BR-088): un triángulo charcoal arriba a la izquierda y uno rojo abajo a la
 * derecha, con filo de luz. Llena a su contenedor posicionado; lo usan `HoneycombPage` (la pantalla entera o una
 * banda) y `PageHero` (solo la cabecera). Es decorativo: no entra en el árbol de accesibilidad.
 */
export const PageBackdrop = ({ className }: PageBackdropProps) => (
  <div className={className ? `${styles.backdrop} ${className}` : styles.backdrop} aria-hidden="true">
    <span className={styles.shadeTriangle} />
    <span className={styles.redTriangle} />
  </div>
);
