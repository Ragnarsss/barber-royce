import { useEffect, useState, type ReactNode } from "react";
import sheetSource from "virtual:site-sheet";
import { runAfterLoad } from "@/analytics/runAfterLoad";
import { ContentContext } from "./ContentContext";
import type { SheetSource } from "./sheetSource";
import { bakedContent } from "./siteContent";

interface Props {
  children: ReactNode;
  /** De dónde leer la hoja. Por defecto, la que se configuró al construir (`null` si no hay). */
  sheet?: SheetSource | null;
  fetchImpl?: typeof fetch;
}

/**
 * Entrega el contenido editable (BR-047, ADR-008). Empieza con el del build, así la página pinta de
 * inmediato; cuando termina de cargar pide la hoja de nuevo y, si responde, cambia al contenido nuevo. Así el
 * dueño ve sus cambios sin un despliegue. Sin hoja configurada no hace ninguna petición ni baja el código de lectura.
 */
export function ContentProvider({ children, sheet = sheetSource, fetchImpl }: Props) {
  const [content, setContent] = useState(bakedContent);

  useEffect(() => {
    if (!sheet) return;
    let cancelled = false;

    const cancelWait = runAfterLoad(() => {
      // El código de lectura y validación se baja recién ahora, fuera de la ruta crítica.
      void import("./refreshContent")
        .then(({ refreshContent }) => refreshContent(sheet, bakedContent, fetchImpl))
        .then((fresh) => {
          if (!cancelled && fresh) setContent(fresh);
        });
    });

    return () => {
      cancelled = true;
      cancelWait();
    };
  }, [sheet, fetchImpl]);

  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}
