import { resolveContent, formatReports } from "./resolveContent";
import { fetchSheetTabs, type SheetSource } from "./sheetSource";
import type { SiteContent } from "./types";

/**
 * Vuelve a leer la hoja desde el navegador (BR-047, ADR-008). Parte del contenido del build: una pestaña
 * que no responde o no valida conserva lo que el sitio ya tenía, y las demás se actualizan.
 *
 * Devuelve `undefined` si ninguna pestaña se pudo usar (no hay nada que cambiar). Nunca lanza.
 */
export async function refreshContent(
  source: SheetSource,
  base: SiteContent,
  fetchImpl: typeof fetch = fetch,
): Promise<SiteContent | undefined> {
  try {
    const { sheet, problems } = await fetchSheetTabs(source, fetchImpl);
    const { content, reports } = resolveContent(sheet, base);

    // Una pestaña sin `gid` configurado no se pidió: no es un problema que no venga de la hoja.
    const asked = reports.filter((report) => report.tab in source.gids);
    if (problems.length > 0 || asked.some((report) => report.source === "respaldo")) {
      console.warn(["[contenido] la hoja no se pudo usar completa:", ...problems.map((p) => `  - ${p}`), ...formatReports(asked)].join("\n"));
    }
    return reports.some((report) => report.source === "hoja") ? content : undefined;
  } catch (error) {
    console.warn(`[contenido] se conserva el contenido del sitio: ${error instanceof Error ? error.message : String(error)}`);
    return undefined;
  }
}
