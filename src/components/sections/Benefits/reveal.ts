/**
 * Funciones del revelado de «Estilo que te acompaña» ligado al scroll (BR-074, HU-EXP-004 CA-25). Todas reciben el
 * avance del scroll de 0 a 1 y devuelven el valor de una propiedad; se pasan a `useTransform` como funciones (y no como
 * rangos) para que framer no las acelere con la API de animaciones web, que jsdom no trae. Con el scroll hacia atrás,
 * todo se deshace: es un scrub, no una animación que corre una vez.
 *
 * La secuencia: los títulos y las tres tarjetas se ven borrosos; al bajar, los títulos se enfocan; luego la primera
 * tarjeta gira, se revela y su ícono late mientras las otras dos siguen borrosas; después la segunda; y al final, la
 * tercera. Cada tarjeta tiene su propio tramo del scroll, sin superponerse con el de las demás.
 */

/** Rampa de 0 a 1 entre dos puntos del avance; fuera de ellos queda en 0 o en 1. */
export const ramp = (from: number, to: number) => (value: number) => Math.min(1, Math.max(0, (value - from) / (to - from)));

/** Desaceleración suave: arranca rápido y se asienta. */
export const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Aceleración y desaceleración suaves: el giro arranca y frena con calma. */
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t ** 3 : 1 - (-2 * t + 2) ** 3 / 2);

/** Hasta dónde se ve solo la copia desenfocada del título y el subtítulo; desde ahí se cruzan con el texto nítido. */
export const TEXT_FOCUS_FROM = 0.5;

/**
 * Con la sección fija en pantalla (escritorio), el primer quinto del tiempo en que está fija es para enfocar los
 * títulos; el resto se reparte entre las tres tarjetas, una detrás de otra.
 */
export const PIN_TITLE_END = 0.2;

/**
 * Zoom de la foto de fondo: parte un 50 % más grande y se asienta a su tamaño en el primer 60 % del tiempo en que la
 * sección está fija, con una desaceleración marcada: el alejamiento es brusco al comienzo y se nota cómo se asienta.
 */
export const PHOTO_ZOOM = 0.5;
export const PHOTO_SETTLE_END = 0.6;
/** Cuánto sube la foto (en % de su alto) al partir; baja a 0 junto con el zoom. */
export const PHOTO_LIFT = 6;

/** Cuánto falta para que la foto termine de asentarse: 1 al comienzo, 0 cuando ya está en su tamaño. */
const photoRemaining = (progress: number) => 1 - easeOut(ramp(0, PHOTO_SETTLE_END)(progress));

/** Escala de la foto con la sección fija: de 1,5 a 1. */
export const photoScale = (progress: number) => 1 + PHOTO_ZOOM * photoRemaining(progress);

/** Desplazamiento vertical de la foto con la sección fija, en %: de -6 % a 0. */
export const photoLift = (progress: number) => `${-PHOTO_LIFT * photoRemaining(progress)}%`;

/** Número de tarjetas de la grilla: cada una recibe un tercio del avance, uno detrás de otro y sin superponerse. */
const CARDS = 3;

/** Avance propio de la tarjeta `index` (0 antes de su tramo, 1 después), a partir del avance de toda la grilla. */
export const cardProgress = (progress: number, index: number) => ramp(index / CARDS, (index + 1) / CARDS)(progress);

/**
 * Dentro de su tramo, la tarjeta gira hasta aquí (70 %), y luego el ícono late. Antes de su tramo está de frente y
 * borrosa; después, de frente y nítida: 360° es la misma posición que 0°.
 */
export const SPIN_END = 0.7;

/** Giro de 360° sobre el eje vertical, como una moneda: parte y termina de frente. */
export const spinAngle = (t: number) => 360 * easeInOut(ramp(0, SPIN_END)(t));

/** Tamaño de la tarjeta: parte un poco más chica y se asienta durante el giro. */
export const cardScale = (t: number) => 0.95 + 0.05 * easeOut(ramp(0, SPIN_END)(t));

/** Nitidez del contenido de la tarjeta: 0 desenfocado, 1 nítido, en la segunda mitad del giro. La copia usa el complemento. */
export const sharpness = (t: number) => ramp(0.35, SPIN_END)(t);

/** Avance del trazo del ícono: se dibuja mientras el contenido se enfoca. */
export const drawProgress = (t: number) => ramp(0.4, 0.75)(t);

/** Desde dónde late el ícono: cuando el giro terminó y el contenido ya es nítido. */
export const BEAT_FROM = SPIN_END;
export const BEAT_SCALE = 0.22;

/** Latido del ícono: dos pulsos de acercarse y alejarse en el último tramo, y vuelve a su tamaño. */
export const heartbeatScale = (t: number) =>
  t <= BEAT_FROM ? 1 : 1 + BEAT_SCALE * Math.abs(Math.sin((2 * Math.PI * (t - BEAT_FROM)) / (1 - BEAT_FROM)));
