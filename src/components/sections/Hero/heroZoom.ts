/**
 * Zoom-in de la foto del Hero con el scroll (BR-079, HU-EXP-004 CA-30). La foto se acerca mientras el Hero sale de la
 * pantalla: es un zoom hacia adentro, así que no deja huecos en los bordes. Es una capa propia del Hero y no la capa
 * «foreground» compartida del parallax (de 1 a 1,12), que usan otras secciones y es muy leve para que se note.
 */
export const HERO_ZOOM = {
  /** Escritorio: la foto del modelo, cortada en su silueta, a la derecha. */
  DESKTOP: 1.4,
  /** Móvil: la foto a pantalla completa de fondo. */
  MOBILE: 1.5,
};

/** Punto de la foto desde donde se acerca (`transform-origin`): el rostro, para que el zoom no lo saque de cuadro. */
export const HERO_ZOOM_ORIGIN = {
  DESKTOP: "70% 45%",
  MOBILE: "50% 32%",
};
