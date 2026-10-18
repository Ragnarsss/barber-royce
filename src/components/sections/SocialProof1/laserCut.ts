/**
 * Coreografía de SocialProof1 (BR-062, HU-EXP-004 CA-14; escena fija y revelado, BR-075, CA-26).
 *
 * En escritorio la sección queda fija en pantalla y todo se mide sobre el avance de ese recorrido (0 al pegarse, 1 al
 * soltarse): primero el láser (los haces, el subrayado y los cortes de la foto y la tarjeta, con el destello del marco);
 * cuando termina, el título, la foto y el texto del testimonio, que se veían borrosos, se enfocan uno tras otro. Es
 * scrub: al subir, todo retrocede.
 */
// Sin `as const`: useTransform espera arreglos normales; con arreglos de solo lectura elige otra firma.
export const LASER_CUT: {
  PHOTO: number[];
  CARD: number[];
  FLASH: number[];
  UNDERLINE: number[];
  UNDERLINE_FREE: number[];
  COVER_TRAVEL: string;
  COVER_TRAVEL_BACK: string;
} = {
  /** Panel que cubre la foto: se retira en diagonal entre estos dos puntos del recorrido. */
  PHOTO: [0.04, 0.22],
  /** Corte cruzado de la tarjeta, desde el lado contrario. */
  CARD: [0.14, 0.34],
  /** Encendido del marco rojo: sube, llega al máximo al terminar el corte de la foto y baja. */
  FLASH: [0.2, 0.26, 0.36],
  /** Subrayado del título que se dibuja, sobre el recorrido fijo. */
  UNDERLINE: [0, 0.1],
  /** El mismo subrayado sin la sección fija (móvil), sobre el avance de la sección al cruzar la pantalla, como en BR-062. */
  UNDERLINE_FREE: [0.06, 0.26],
  /** Cuánto se corre el panel (de su propio ancho) para dejar ver todo, contando su inclinación. */
  COVER_TRAVEL: "125%",
  /** El mismo recorrido hacia el lado contrario, para la tarjeta. */
  COVER_TRAVEL_BACK: "-125%",
};

/**
 * Cuándo se enfoca cada cosa, después de que el láser termina (en el recorrido fijo): primero el título y el subtítulo,
 * luego la foto y por último el texto del testimonio. Hasta entonces, todo se ve borroso. Al final queda un tramo de
 * pausa con todo nítido antes de soltar la sección.
 */
export const REVEAL: { TITLE: number[]; PHOTO: number[]; QUOTE: number[] } = {
  TITLE: [0.4, 0.58],
  PHOTO: [0.5, 0.72],
  QUOTE: [0.66, 0.88],
};

/** Haces que viajan por las pistas diagonales del fondo. */
export const BOLT: { TRACKS: number; WINDOW: number; STAGGER: number; TRAVEL: string[] } = {
  TRACKS: 3,
  /** Ventana del recorrido en la que cada haz recorre su pista. */
  WINDOW: 0.28,
  /** Desfase entre el arranque de un haz y el del siguiente. */
  STAGGER: 0.06,
  /** Recorrido del haz en su pista, en % de su propio largo (el haz mide 1/8 de la pista). */
  TRAVEL: ["-100%", "800%"],
};

/** Tramo del recorrido en el que el haz de la pista `index` recorre su pista. */
export function boltWindow(index: number): [number, number] {
  const start = index * BOLT.STAGGER;
  return [start, start + BOLT.WINDOW];
}
