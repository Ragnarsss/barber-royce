import { useCallback, useContext, useMemo } from "react";
import { useBranch } from "@/branch/useBranch";
import { ContentContext } from "./ContentContext";
import { textOf, type TextKey } from "./texts";
import type { SiteContent } from "./types";

/** El contenido editable vigente: el del build y, si la hoja respondió, lo que ella diga (BR-047). */
export function useSiteContent(): SiteContent {
  return useContext(ContentContext);
}

/**
 * Un texto editable (BR-110): el de la pestaña de la sucursal activa si lo definió, si no el de la base común
 * (`textos`) y, si tampoco, el que trae el código (`./texts.ts`). Sin pestaña de la sucursal, vale la base.
 */
export function useSiteText(): (key: TextKey) => string {
  const { texts, textsByBranch } = useContext(ContentContext);
  const { branch } = useBranch();
  const merged = useMemo(() => ({ ...texts, ...textsByBranch?.[branch] }), [texts, textsByBranch, branch]);
  return useCallback((key: TextKey) => textOf(merged, key), [merged]);
}
