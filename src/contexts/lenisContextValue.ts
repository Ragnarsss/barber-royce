import { createContext } from 'react';
import type Lenis from 'lenis';

/** La instancia de Lenis, o null si aún no existe o el usuario pidió reducir el movimiento. `undefined` es "sin proveedor". */
export const LenisContext = createContext<Lenis | null | undefined>(undefined);
