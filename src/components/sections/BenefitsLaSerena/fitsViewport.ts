/**
 * ¿La sección «encaja» en la ventana? (BR-117) Es cuando se ve entera o, si es más alta que la ventana (el celular, con las
 * tarjetas apiladas), cuando llena todo el espacio visible. La franja de fotos solo avanza mientras esto es verdad.
 *
 * `visible` es el alto de la sección que se ve; `section`, su alto total; `root`, el alto de la ventana sin la barra de
 * navegación; `tolerance`, los píxeles que se perdonan (un redondeo o un par de píxeles de scroll).
 */
export function fitsViewport(visible: number, section: number, root: number, tolerance = 24): boolean {
  if (section <= 0 || root <= 0) return false;
  return visible >= Math.min(section, root) - tolerance;
}
