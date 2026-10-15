import { parseCsv, toTable } from "./csv";
import { buildBusiness } from "./business";
import { readBusiness, readFaq, readLocations, readProducts, readServices, readTeam, readTexts, type TabResult } from "./schemas";
import { CONTENT_TABS, type ContentIssue, type ContentTab, type SiteContent, type TabReport } from "./types";

/** Hoja descargada: el texto CSV de cada pestaña. Una pestaña ausente significa "no se pudo obtener". */
export type SheetCsv = Partial<Record<ContentTab, string>>;

export interface ResolvedContent {
  content: SiteContent;
  reports: TabReport[];
}

/** Aplica el contenido de una pestaña sobre el resultado. Cada pestaña toca una sola clave de `SiteContent`. */
const APPLY: Record<ContentTab, (content: SiteContent, items: never[]) => void> = {
  servicios: (content, items) => void (content.services = items),
  productos: (content, items) => void (content.products = items),
  equipo: (content, items) => void (content.team = items),
  preguntas: (content, items) => void (content.faq = items),
  textos: (content, items) => void (content.texts = Object.fromEntries(items as [string, string][])),
  negocio: (content, items) => void (content.business = buildBusiness(Object.fromEntries(items as [string, string][]), content.business)),
  sucursales: (content, items) => void (content.locations = items),
};

/** `content` es lo resuelto hasta ese momento: el equipo valida sus sucursales contra las que usará el sitio. */
const READERS: Record<ContentTab, (table: ReturnType<typeof toTable>, content: SiteContent) => TabResult<unknown>> = {
  servicios: readServices,
  productos: readProducts,
  equipo: (table, content) => readTeam(table, content.locations.map((location) => location.id)),
  preguntas: readFaq,
  textos: readTexts,
  negocio: readBusiness,
  sucursales: readLocations,
};

function backup(tab: ContentTab, reason: string, issues: ContentIssue[] = [], warnings: ContentIssue[] = []): TabReport {
  return { tab, source: "respaldo", reason, issues, warnings };
}

/**
 * Decide, pestaña por pestaña, si el sitio usa la hoja o el respaldo (HU-CNT-001, RNF-CONF-003).
 *
 * - Pestaña ausente (hoja sin configurar o que no respondió), vacía, con encabezados que faltan o con
 *   una sola fila inválida → **se usa el respaldo de esa pestaña** y se informa por qué.
 * - Una pestaña inválida no afecta a las demás (RN-03).
 * - Nunca lanza: lo que sea que venga de la hoja se trata como dato no confiable.
 * - Es una función pura: no lee la red ni el disco, así que se puede probar entera.
 */
export function resolveContent(sheet: SheetCsv, snapshot: SiteContent): ResolvedContent {
  const content: SiteContent = structuredClone(snapshot);
  const reports: TabReport[] = [];

  // Las sucursales van primero: el equipo revisa contra ellas dónde atiende cada barbero (BR-063).
  const order = [...CONTENT_TABS].sort((a, b) => Number(b === "sucursales") - Number(a === "sucursales"));
  for (const tab of order) {
    const csv = sheet[tab];
    if (csv === undefined) {
      reports.push(backup(tab, "no se obtuvo de la hoja"));
      continue;
    }

    let table;
    try {
      table = toTable(parseCsv(csv));
    } catch (error) {
      reports.push(backup(tab, `no se pudo leer el CSV: ${error instanceof Error ? error.message : String(error)}`));
      continue;
    }

    if (table.headers.length === 0) {
      reports.push(backup(tab, "la pestaña está vacía"));
      continue;
    }

    const { items, issues, warnings } = READERS[tab](table, content);
    if (issues.length > 0) {
      reports.push(backup(tab, `${issues.length} problema${issues.length === 1 ? "" : "s"} en la hoja`, issues, warnings));
    } else if (items.length === 0 && tab !== "textos" && tab !== "negocio") {
      // Una pestaña sin filas activas dejaría el sitio sin servicios, productos, equipo, preguntas o sucursales.
      reports.push(backup(tab, "no tiene ninguna fila activa", [], warnings));
    } else {
      APPLY[tab](content, items as never[]);
      reports.push({ tab, source: "hoja", count: items.length, issues: [], warnings });
    }
  }

  reports.sort((a, b) => CONTENT_TABS.indexOf(a.tab) - CONTENT_TABS.indexOf(b.tab));
  return { content, reports };
}

/** Líneas legibles para el log del build: una por pestaña, más una por cada problema con su fila y campo. */
export function formatReports(reports: TabReport[]): string[] {
  return reports.flatMap((report) => {
    const head =
      report.source === "hoja" ? `${report.tab}: hoja (${report.count} fila${report.count === 1 ? "" : "s"})` : `${report.tab}: respaldo (${report.reason})`;
    const details = report.issues.map((issue) => `  - ${issue.tab} fila ${issue.row}, ${issue.field}: ${issue.message}`);
    const notices = report.warnings.map((warning) => `  ! ${warning.tab} fila ${warning.row}, ${warning.field}: ${warning.message}`);
    return [head, ...details, ...notices];
  });
}
