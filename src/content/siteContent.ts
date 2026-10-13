import content from "virtual:site-content";
import type { SiteContent } from "./types";

/**
 * Contenido editable del sitio tal como quedó al construir (ADR-008). Lo genera
 * `vite-plugins/siteContentPlugin.ts`: con la hoja de Google configurada sale de ella (validado en el
 * build); si no, es el respaldo de `./snapshot.ts`.
 *
 * Es el punto de partida y el respaldo en el navegador (BR-047): las páginas no lo leen directo, sino con
 * `useSiteContent()` / `useSiteText()`, que además ven lo que la hoja diga después de cargar la página.
 */
export const bakedContent: SiteContent = content;
