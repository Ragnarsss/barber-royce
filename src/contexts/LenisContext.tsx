import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import Lenis from 'lenis';

interface LenisContextType {
    lenis: Lenis | null;
    isReady: boolean;
}

const LenisContext = createContext<LenisContextType | undefined>(undefined);

export const LenisProvider = ({ lenis, children }: { lenis: Lenis | null; children: ReactNode }) => {
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (lenis) {
            // Esperar a que Lenis esté completamente inicializado
            // Se sincroniza después del primer frame render
            const timer = setTimeout(() => {
                lenis.resize(); // Asegurar que tiene las dimensiones correctas
                setIsReady(true);
            }, 100);
            return () => clearTimeout(timer);
        } else {
            setIsReady(false);
        }
    }, [lenis]);

    return (
        <LenisContext.Provider value={{ lenis, isReady }}>
            {children}
        </LenisContext.Provider>
    );
};

export const useLenisContext = (): Lenis => {
    const context = useContext(LenisContext);
    if (!context) {
        throw new Error('useLenisContext must be used within a LenisProvider');
    }
    if (!context.lenis) {
        throw new Error('Lenis instance is not initialized');
    }
    return context.lenis;
};

export const useLenisInstance = (): Lenis | null => {
    const context = useContext(LenisContext);
    if (!context) {
        throw new Error('useLenisInstance must be used within a LenisProvider');
    }
    return context.lenis;
};

export const useLenisReady = (): boolean => {
    const context = useContext(LenisContext);
    if (!context) {
        throw new Error('useLenisReady must be used within a LenisProvider');
    }
    return context.isReady;
};

/**
 * Hook para refrescar Lenis manualmente cuando sea necesario
 * Útil después de cargar contenido dinámico
 */
export const useRefreshLenis = () => {
    const lenis = useLenisInstance();

    return () => {
        if (lenis) {
            lenis.resize();
        }
    };
};
