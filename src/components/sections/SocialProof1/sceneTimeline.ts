/**
 * Coreografía de SocialProof1 (BR-062, HU-EXP-004 CA-14; escena fija y revelado, BR-075, CA-26; lens flare, BR-076, CA-27).
 *
 * En escritorio la sección queda fija en pantalla y todo se mide sobre el avance de ese recorrido (0 al pegarse, 1 al
 * soltarse): primero los cortes que revelan la foto y la tarjeta, con un lens flare que viaja por el borde de cada uno y
 * el destello del marco; cuando termina, el subtítulo, la foto y el texto del testimonio, que se veían borrosos, se
 * enfocan uno tras otro. Es scrub: al subir, todo retrocede.
 */
// Sin `as const`: useTransform espera arreglos normales; con arreglos de solo lectura elige otra firma.
export const CUT: {
  PHOTO: number[];
  CARD: number[];
  FLASH: number[];
  UNDERLINE: number[];
  UNDERLINE_FREE: number[];
  EDGE: number[];
  EDGE_FREE: number[];
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
  /** Borde de los hexágonos de fondo que se dibuja (BR-096): empieza con el primer corte y termina con el de la tarjeta. */
  EDGE: [0.04, 0.34],
  /** El mismo borde sin la sección fija, sobre el avance de la sección al cruzar la pantalla. */
  EDGE_FREE: [0.1, 0.4],
  /** Cuánto se corre el panel (de su propio ancho) para dejar ver todo, contando su inclinación. */
  COVER_TRAVEL: "125%",
  /** El mismo recorrido hacia el lado contrario, para la tarjeta. */
  COVER_TRAVEL_BACK: "-125%",
};

/**
 * Lens flare que viaja por el borde de cada corte (BR-076): [aparece, brilla al máximo, se apaga]. Arranca con su corte
 * y se apaga un poco después de que termina, para que la luz no corte en seco.
 */
export const FLARE: { PHOTO: number[]; CARD: number[] } = {
  PHOTO: [0.04, 0.13, 0.25],
  CARD: [0.14, 0.24, 0.36],
};

/**
 * Cuándo se enfoca cada cosa, después de que los cortes terminan (en el recorrido fijo): primero el subtítulo, luego la
 * foto y por último el texto del testimonio. Hasta entonces, todo se ve borroso. Al final queda un tramo de pausa con
 * todo nítido antes de soltar la sección.
 */
export const REVEAL: { TITLE: number[]; PHOTO: number[]; QUOTE: number[] } = {
  /** Subtítulo (el título queda siempre nítido). */
  TITLE: [0.4, 0.56],
  PHOTO: [0.48, 0.68],
  /** Empieza cuando la foto ya terminó: el texto del testimonio no se enfoca a la vez que la foto. */
  QUOTE: [0.72, 0.92],
};
