import { Link } from "react-router-dom";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";
import styles from "./PageError.module.css";

/**
 * Fallback de una página que falló al renderizar (BR-019, patrón de RadarOP).
 * Vive dentro del Layout: navbar y footer siguen funcionando.
 * "Reintentar" vuelve a montar la página sin recargar el sitio.
 * Nunca muestra el mensaje técnico del error (engineering-guidelines §15).
 */
export function PageError({ resetErrorBoundary }: FallbackProps) {
  return (
    <section className={styles.container} role="alert" aria-labelledby="page-error-title">
      <div className={styles.content}>
        <AlertCircle className={styles.icon} size={56} aria-hidden="true" />
        <h1 id="page-error-title" className={styles.title}>
          No pudimos mostrar esta página
        </h1>
        <p className={styles.description}>
          Algo falló al cargarla. Inténtalo de nuevo o vuelve al inicio.
        </p>

        <div className={styles.actions}>
          <button type="button" onClick={resetErrorBoundary} className={styles.primaryAction}>
            <RefreshCw size={20} aria-hidden="true" />
            Reintentar
          </button>
          <Link to="/" className={styles.secondaryAction}>
            <Home size={20} aria-hidden="true" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}
