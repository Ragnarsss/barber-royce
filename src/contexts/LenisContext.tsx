import { useEffect, useState, type ReactNode } from 'react';
import type Lenis from 'lenis';
import { LenisContext } from './lenisContextValue';

export const LenisProvider = ({ lenis, children }: { lenis: Lenis | null; children: ReactNode }) => {
    // Guarda qué instancia ya terminó de inicializarse; "lista" se deriva
    // comparándola con la actual, así un cambio de instancia (o null) deja
    // de estar lista sin un setState síncrono dentro del efecto.
    const [readyLenis, setReadyLenis] = useState<Lenis | null>(null);

    useEffect(() => {
        if (!lenis) return;

        // Esperar a que Lenis esté completamente inicializado
        // Se sincroniza después del primer frame render
        const timer = setTimeout(() => {
            lenis.resize(); // Asegurar que tiene las dimensiones correctas
            setReadyLenis(lenis);
        }, 100);
        return () => clearTimeout(timer);
    }, [lenis]);

    const isReady = lenis !== null && readyLenis === lenis;

    return (
        <LenisContext.Provider value={{ lenis, isReady }}>
            {children}
        </LenisContext.Provider>
    );
};
