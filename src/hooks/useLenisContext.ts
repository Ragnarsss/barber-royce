import { useContext } from 'react';
import type Lenis from 'lenis';
import { LenisContext } from '@/contexts/lenisContextValue';

const useLenisContextValue = (hookName: string): Lenis | null => {
    const lenis = useContext(LenisContext);
    if (lenis === undefined) {
        throw new Error(`${hookName} must be used within a LenisContext`);
    }
    return lenis;
};

export const useLenisInstance = (): Lenis | null =>
    useLenisContextValue('useLenisInstance');

/** Lenis está listo en cuanto existe la instancia: `useCreateLenis` la publica ya inicializada. */
export const useLenisReady = (): boolean =>
    useLenisContextValue('useLenisReady') !== null;

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
