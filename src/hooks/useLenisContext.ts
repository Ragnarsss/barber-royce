import { useContext } from 'react';
import type Lenis from 'lenis';
import { LenisContext, type LenisContextType } from '@/contexts/lenisContextValue';

const useLenisContextValue = (hookName: string): LenisContextType => {
    const context = useContext(LenisContext);
    if (!context) {
        throw new Error(`${hookName} must be used within a LenisProvider`);
    }
    return context;
};

export const useLenisInstance = (): Lenis | null =>
    useLenisContextValue('useLenisInstance').lenis;

export const useLenisReady = (): boolean =>
    useLenisContextValue('useLenisReady').isReady;

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
