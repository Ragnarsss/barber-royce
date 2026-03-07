import { AlertTriangle } from "lucide-react";
import styles from "./CatastrophicError.module.css";

/**
 * Componente de fallback para errores catastróficos globales
 * 
 * Usado como último recurso cuando:
 * - El error no fue capturado por boundaries específicos
 * - Hay problemas con React Router, Lenis, o core libraries
 * - Error en el Layout o componentes críticos
 * 
 * Diseño minimalista porque no podemos confiar en nada del sistema.
 */
export function CatastrophicError() {
    const handleReload = () => {
        window.location.href = "/";
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                <AlertTriangle className={styles.icon} size={80} />

                <h1 className={styles.title}>
                    Error Crítico
                </h1>

                <p className={styles.description}>
                    Lo sentimos, la aplicación encontró un error inesperado.
                </p>

                <button
                    onClick={handleReload}
                    className={styles.button}
                >
                    Recargar Aplicación
                </button>

                <p className={styles.footer}>
                    Si el problema persiste, limpia la caché del navegador
                    (Ctrl+Shift+Delete) y vuelve a intentarlo.
                </p>
            </div>
        </div>
    );
}
