import content from "virtual:site-content";
import { textOf, type TextKey } from "./texts";

/**
 * Contenido editable del sitio (ADR-008). Lo genera `vite-plugins/siteContentPlugin.ts`: con la hoja de
 * Google configurada sale de ella (validado en el build); si no, es el respaldo de `./snapshot.ts`.
 * Las páginas leen de aquí; nunca importan los datos del respaldo directamente.
 */
export const siteContent = content;

/** Un texto editable: el de la hoja si lo definió, si no el que trae el código (`./texts.ts`). */
export const siteText = (key: TextKey): string => textOf(siteContent.texts, key);
