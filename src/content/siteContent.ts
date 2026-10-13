import content from "virtual:site-content";

/**
 * Contenido editable del sitio (ADR-008). Lo genera `vite-plugins/siteContentPlugin.ts`: con la hoja de
 * Google configurada sale de ella (validado en el build); si no, es el respaldo de `./snapshot.ts`.
 * Las páginas leen de aquí; nunca importan los datos del respaldo directamente.
 */
export const siteContent = content;
