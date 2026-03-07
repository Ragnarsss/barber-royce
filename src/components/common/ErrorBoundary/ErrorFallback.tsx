import { useNavigate } from "react-router-dom";
import { AlertCircle, Home, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./ErrorFallback.module.css";

interface ErrorFallbackProps {
    /**
     * Título de la página que falló (opcional)
     * @example "Productos"
     */
    pageName?: string;

    /**
     * Callback opcional para reintentar
     */
    onRetry?: () => void;
}

/**
 * Componente de fallback elegante para errores de carga de página
 * 
 * Usado cuando:
 * - Lazy loaded chunks fallan
 * - Componentes de página crashean
 * - API calls explotan
 * 
 * @example
 * <ErrorBoundary fallback={<ErrorFallback pageName="Productos" />}>
 *   <ProductsPage />
 * </ErrorBoundary>
 */
export function ErrorFallback({ pageName, onRetry }: ErrorFallbackProps) {
    const navigate = useNavigate();

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        } else {
            // Recargar la página actual
            window.location.reload();
        }
    };

    const handleGoHome = () => {
        navigate("/");
    };

    return (
        <div className={styles.container}>
            <div className={styles.content}>
                {/* Icono de error */}
                <div className={styles.iconContainer}>
                    <AlertCircle className={styles.icon} size={64} />
                </div>

                {/* Mensaje principal */}
                <h1 className={styles.title}>
                    {pageName ? `Error al cargar ${pageName}` : "Algo salió mal"}
                </h1>

                <p className={styles.description}>
                    Lo sentimos, hubo un problema al cargar esta página.
                    Esto puede deberse a un problema temporal de conexión o del servidor.
                </p>

                {/* Acciones */}
                <div className={styles.actions}>
                    <Button
                        onClick={handleRetry}
                        size="lg"
                        className={styles.retryButton}
                    >
                        <RefreshCw size={20} />
                        Intentar de nuevo
                    </Button>

                    <Button
                        onClick={handleGoHome}
                        variant="outline"
                        size="lg"
                        className={styles.homeButton}
                    >
                        <Home size={20} />
                        Volver al inicio
                    </Button>
                </div>

                {/* Info adicional */}
                <p className={styles.hint}>
                    Si el problema persiste, intenta recargar la página o vuelve más tarde.
                </p>
            </div>
        </div>
    );
}
