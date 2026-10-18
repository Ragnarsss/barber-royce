/**
 * Zoom-in de la foto de CTA1 con el scroll (BR-079, HU-EXP-004 CA-30). La foto se acerca mientras la sección cruza la
 * pantalla: es un zoom hacia adentro, así que no deja huecos. En escritorio se acerca dentro de la figura blanca, que la
 * recorta; en móvil es la foto de fondo, cortada por el borde derecho.
 */
export const CTA_ZOOM = {
  DESKTOP: 1.35,
  MOBILE: 1.4,
};

/** Tramo del avance de la sección (0 al asomar por abajo, 1 al salir por arriba) en el que ocurre el zoom. */
export const CTA_ZOOM_WINDOW: number[] = [0.1, 0.85];

/** Punto de la foto desde donde se acerca (`transform-origin`): el rostro del modelo. */
export const CTA_ZOOM_ORIGIN = {
  DESKTOP: "35% 45%",
  MOBILE: "42% 45%",
};
