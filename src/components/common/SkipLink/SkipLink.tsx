import styles from "./SkipLink.module.css";

/**
 * ✅ Accesibilidad: Skip Link para lectores de pantalla y navegación por teclado
 * Permite saltar directamente al contenido principal sin navegar por todo el header
 */
export const SkipLink = () => {
    return (
        <a href="#main-content" className={styles.skipLink}>
            Saltar al contenido principal
        </a>
    );
};
