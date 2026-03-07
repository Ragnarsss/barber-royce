import { Component } from "react";
import type { ErrorInfo, ReactNode } from "react";

interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
    onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error?: Error;
    errorInfo?: ErrorInfo;
}

/**
 * Error Boundary para capturar errores en componentes hijos
 * 
 * React 19 requiere class components para Error Boundaries.
 * Captura errores de renderizado y lifecycle, pero NO:
 * - Event handlers (usar try/catch)
 * - Async code (usar try/catch)
 * - Server-side rendering
 * - Errores en el boundary mismo
 * 
 * @example
 * <ErrorBoundary fallback={<ErrorPage />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false };
    }

    /**
     * Actualiza el estado cuando se captura un error
     */
    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return {
            hasError: true,
            error
        };
    }

    /**
     * Callback cuando se captura un error
     * Útil para logging/monitoring (Sentry, etc.)
     */
    componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        // Log error para debugging
        console.error("Error capturado por ErrorBoundary:", error);
        console.error("Component stack:", errorInfo.componentStack);

        // Callback opcional (para enviar a Sentry, etc.)
        this.props.onError?.(error, errorInfo);

        // Guardar errorInfo en estado
        this.setState({ errorInfo });
    }

    /**
     * Método para resetear el error (útil para retry)
     */
    private resetError = () => {
        this.setState({ hasError: false, error: undefined, errorInfo: undefined });
    };

    render() {
        if (this.state.hasError) {
            // Si hay fallback personalizado, usarlo
            if (this.props.fallback) {
                return this.props.fallback;
            }

            // Fallback default simple
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '400px',
                    padding: '2rem',
                    textAlign: 'center',
                }}>
                    <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>
                        Algo salió mal
                    </h2>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>
                        Lo sentimos, hubo un error al cargar esta sección.
                    </p>
                    <button
                        onClick={this.resetError}
                        style={{
                            padding: '0.75rem 1.5rem',
                            backgroundColor: 'var(--color-accent)',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            fontSize: '1rem',
                        }}
                    >
                        Intentar de nuevo
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
