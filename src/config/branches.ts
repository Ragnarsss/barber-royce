/**
 * Sucursales del sitio (ADR-010, BR-103). Fuente única de la lista, el valor por defecto y la clave de almacenamiento:
 * el script de arranque de `index.html` repite estos tres valores y un test los compara.
 */

/** El slug de cada sucursal es también el prefijo de su portada (`/coquimbo`, `/la-serena`). */
export const BRANCHES = ["coquimbo", "la-serena"] as const;
export type Branch = (typeof BRANCHES)[number];

/** La sucursal que se ve si la URL no dice cuál y el visitante nunca eligió una. */
export const DEFAULT_BRANCH: Branch = "coquimbo";

/** Dónde se recuerda la elección en el navegador. */
export const BRANCH_STORAGE_KEY = "royce:branch";

/**
 * Color de la barra del navegador en el móvil (`<meta name="theme-color">`): el fondo del tema de cada sucursal.
 * Una etiqueta `meta` no puede leer un token CSS, así que se repite aquí; un test lo compara con `colors.css` (BR-104).
 */
export const BRANCH_THEME_COLOR = {
  coquimbo: "#1a1a1a",
  "la-serena": "#f7f3ec",
} as const satisfies Record<Branch, string>;

/** `id` de la fila de cada sucursal en la pestaña `sucursales` (y en `src/data/locationsData.ts`). */
export const BRANCH_LOCATION_ID = {
  coquimbo: "barberia-royce-coquimbo",
  "la-serena": "barberia-royce-la-serena",
} as const satisfies Record<Branch, string>;

export function isBranch(value: unknown): value is Branch {
  return typeof value === "string" && (BRANCHES as readonly string[]).includes(value);
}
