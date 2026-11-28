import { Scissors } from "lucide-react";
import styles from "./Loading.module.css";

/**
 * Espera de una página que todavía se descarga (fallback del Suspense de las rutas).
 *
 * BR-123: en la primera carga lo tapa el letrero de neón de index.html, así que solo se ve al navegar a una página
 * que aún no se descargó. Es una tijera de neón que respira, con el lenguaje del letrero y no un spinner genérico.
 * Aparece con un retraso, para no destellar cuando la página llega enseguida, y no cambia de estado mientras espera.
 */
export function Loading() {
  return (
    <div className={styles.loadingContainer} role="status">
      <Scissors className={styles.icon} size={48} strokeWidth={1.25} aria-hidden="true" />
      <p className={styles.loadingText}>Cargando…</p>
    </div>
  );
}
