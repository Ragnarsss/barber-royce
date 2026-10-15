/**
 * Coreografía del corte láser de SocialProof1 (BR-062, HU-EXP-004 CA-14).
 *
 * Los cortes se miden sobre el scroll de su propio elemento (0 cuando asoma por abajo, 1 cuando llega al centro de
 * la pantalla): así el corte ocurre a la vista, sea cual sea el alto de la sección. El subrayado y los haces usan el
 * avance de toda la sección. Es scrub: al subir, el corte retrocede.
 */
// Sin `as const`: useTransform espera arreglos normales; con arreglos de solo lectura elige otra firma.
export const LASER_CUT: {
  PHOTO: number[];
  CARD: number[];
  FLASH: number[];
  UNDERLINE: number[];
  COVER_TRAVEL: string;
  COVER_TRAVEL_BACK: string;
} = {
  /** Panel que cubre la foto: se retira en diagonal entre estos dos puntos del scroll de la foto. */
  PHOTO: [0.15, 0.75],
  /** Corte cruzado de la tarjeta, desde el lado contrario. */
  CARD: [0.3, 0.9],
  /** Encendido del marco rojo, también sobre el scroll de la foto: sube, llega al máximo al terminar el corte y baja. */
  FLASH: [0.7, 0.8, 0.95],
  /** Subrayado del título que se dibuja (sobre el avance de la sección). */
  UNDERLINE: [0.06, 0.26],
  /** Cuánto se corre el panel (de su propio ancho) para dejar ver todo, contando su inclinación. */
  COVER_TRAVEL: "125%",
  /** El mismo recorrido hacia el lado contrario, para la tarjeta. */
  COVER_TRAVEL_BACK: "-125%",
};

/** Haces que viajan por las pistas diagonales del fondo. */
export const BOLT: { TRACKS: number; WINDOW: number; STAGGER: number; TRAVEL: string[] } = {
  TRACKS: 3,
  /** Ventana de scroll en la que cada haz recorre su pista. */
  WINDOW: 0.6,
  /** Desfase entre el arranque de un haz y el del siguiente. */
  STAGGER: 0.2,
  /** Recorrido del haz en su pista, en % de su propio largo (el haz mide 1/8 de la pista). */
  TRAVEL: ["-100%", "800%"],
};

/** Tramo de scroll en el que el haz de la pista `index` recorre su pista. */
export function boltWindow(index: number): [number, number] {
  const start = index * BOLT.STAGGER;
  return [start, start + BOLT.WINDOW];
}
