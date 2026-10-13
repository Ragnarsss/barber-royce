import { useCallback, useContext } from "react";
import { ContentContext } from "./ContentContext";
import { textOf, type TextKey } from "./texts";
import type { SiteContent } from "./types";

/** El contenido editable vigente: el del build y, si la hoja respondió, lo que ella diga (BR-047). */
export function useSiteContent(): SiteContent {
  return useContext(ContentContext);
}

/** Un texto editable: el de la hoja si lo definió, si no el que trae el código (`./texts.ts`). */
export function useSiteText(): (key: TextKey) => string {
  const { texts } = useContext(ContentContext);
  return useCallback((key: TextKey) => textOf(texts, key), [texts]);
}
