import { createContext, useContext, type ReactNode } from 'react';
import Lenis from 'lenis';

interface LenisContextType {
    lenis: Lenis | null;
}

const LenisContext = createContext<LenisContextType | undefined>(undefined);

export const LenisProvider = ({ lenis, children }: { lenis: Lenis | null; children: ReactNode }) => {
    return (
        <LenisContext.Provider value={{ lenis }}>
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
