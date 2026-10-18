/**
 * Conjunto cerrado de puntos de corte (BR-024, ADR-009). El CSS es mobile-first: la base es el móvil y cada corte suma
 * estilos con `min-width`. En los `.css` se escriben como literal (las variables CSS no funcionan dentro de `@media`);
 * en TypeScript, siempre desde aquí. `breakpoints.test.ts` falla con cualquier otro valor o con un `max-width` de ancho.
 */
export const BREAKPOINTS = {
  /** Móvil grande. */
  SM: 640,
  /** Escritorio: el corte principal del sitio. */
  DESKTOP: 769,
  /** Escritorio amplio. */
  LG: 1025,
  /** Escritorio grande. */
  XL: 1280,
} as const;

/** Las queries con nombre, para `useMediaQuery`. */
export const MEDIA = {
  sm: `(min-width: ${BREAKPOINTS.SM}px)`,
  desktop: `(min-width: ${BREAKPOINTS.DESKTOP}px)`,
  lg: `(min-width: ${BREAKPOINTS.LG}px)`,
  xl: `(min-width: ${BREAKPOINTS.XL}px)`,
} as const;
