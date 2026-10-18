/**
 * Piezas comunes de los revelados ligados al scroll (BR-074, BR-075). Todas son funciones puras sobre el avance del
 * scroll de 0 a 1; se pasan a `useTransform` como funciones (y no como rangos) para que framer no las acelere con la API
 * de animaciones web, que jsdom no trae.
 */

/** Rampa de 0 a 1 entre dos puntos del avance; fuera de ellos queda en 0 o en 1. */
export const ramp = (from: number, to: number) => (value: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));

/** Desaceleración suave: arranca rápido y se asienta. */
export const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Aceleración y desaceleración suaves: arranca y frena con calma. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Hasta dónde se ve solo la copia desenfocada de un texto; desde ahí se cruza con el texto nítido. */
export const TEXT_FOCUS_FROM = 0.5;
