/**
 * ¿Hay alguna analítica configurada? (BR-044, ADR-007)
 *
 * Sin analítica no hay nada que explicar, así que la página de privacidad (un borrador legal que el dueño aún
 * tiene que validar) no se publica ni se enlaza: el sitio sigue siendo "inerte por defecto". Se evalúa al
 * llamarla, no al cargar el módulo, para poder probarla cambiando las variables de entorno.
 */
export function analyticsEnabled(): boolean {
  return Boolean(import.meta.env.VITE_GA_MEASUREMENT_ID) || import.meta.env.VITE_VERCEL_ANALYTICS === "true";
}
