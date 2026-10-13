import { CONTENT_TABS, type ContentTab } from "./types";

/**
 * Descarga de la hoja de cálculo (BR-040, BR-047, ADR-008): la usan el plugin al construir y el navegador
 * al refrescar el contenido. Solo texto y red: no conoce Vite ni el esquema del contenido, así que se puede
 * probar con un `fetch` falso.
 *
 * La hoja se "publica en la web" desde Google Sheets (Archivo → Compartir → Publicar en la web, por
 * pestaña, como CSV). Eso da un identificador de publicación (`2PACX-…`) y un `gid` por pestaña, y no
 * requiere claves ni cuentas de servicio. Las variables NO llevan el prefijo `VITE_`: las lee el plugin y
 * entrega al navegador solo el identificador y los gid (`SheetSource`), que son públicos de todos modos.
 */
export interface SheetEnv {
  /** Identificador de publicación de la hoja (`2PACX-…`). Sin él, no se hace ninguna petición. */
  CONTENT_SHEET_ID?: string;
  /** `pestaña:gid` separados por comas, por ejemplo `servicios:0,productos:1234`. */
  CONTENT_SHEET_GIDS?: string;
  /** Tiempo máximo por pestaña en milisegundos (por defecto 10000). */
  CONTENT_FETCH_TIMEOUT_MS?: string;
  /** Solo para pruebas: base distinta de la de Google. */
  CONTENT_SHEET_BASE_URL?: string;
}

export type SheetCsv = Partial<Record<ContentTab, string>>;

export interface SheetFetchOutcome {
  /** `false` si no hay `CONTENT_SHEET_ID`: el sitio usa el respaldo y no se pidió nada. */
  configured: boolean;
  /** CSV de cada pestaña que se pudo descargar. */
  sheet: SheetCsv;
  /** Qué falló, en lenguaje claro, para el log del build. */
  problems: string[];
}

export const DEFAULT_BASE_URL = "https://docs.google.com/spreadsheets/d/e";
export const DEFAULT_TIMEOUT_MS = 10_000;
/** Tope de tamaño por pestaña: un CSV de contenido pesa unos KB; algo mucho mayor no es lo que se espera. */
export const MAX_CSV_BYTES = 1_000_000;

/** `servicios:0,productos:123` → `{ servicios: "0", productos: "123" }`, más lo que no se pudo entender. */
export function parseGids(text: string | undefined): { gids: Partial<Record<ContentTab, string>>; problems: string[] } {
  const gids: Partial<Record<ContentTab, string>> = {};
  const problems: string[] = [];

  for (const entry of (text ?? "").split(",").map((part) => part.trim()).filter(Boolean)) {
    const [tab, gid, ...rest] = entry.split(":").map((part) => part.trim());
    if (rest.length > 0 || gid === undefined || gid === "") {
      problems.push(`CONTENT_SHEET_GIDS: "${entry}" no tiene el formato pestaña:gid`);
    } else if (!(CONTENT_TABS as readonly string[]).includes(tab)) {
      problems.push(`CONTENT_SHEET_GIDS: la pestaña "${tab}" no existe (usa: ${CONTENT_TABS.join(", ")})`);
    } else if (!/^\d+$/.test(gid)) {
      problems.push(`CONTENT_SHEET_GIDS: el gid de "${tab}" debe ser un número, no "${gid}"`);
    } else {
      gids[tab as ContentTab] = gid;
    }
  }
  return { gids, problems };
}

export function sheetUrl(baseUrl: string, sheetId: string, gid: string): string {
  return `${baseUrl.replace(/\/$/, "")}/${encodeURIComponent(sheetId)}/pub?gid=${encodeURIComponent(gid)}&single=true&output=csv`;
}

async function fetchTab(url: string, timeoutMs: number, fetchImpl: typeof fetch): Promise<{ csv?: string; problem?: string }> {
  try {
    const response = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), headers: { accept: "text/csv" } });
    if (!response.ok) return { problem: `la hoja respondió HTTP ${response.status}` };

    const type = response.headers.get("content-type") ?? "";
    // Google responde HTML (una página de error o de inicio de sesión) si la pestaña no está publicada.
    if (!type.includes("csv")) return { problem: `la respuesta no es CSV sino "${type || "sin tipo"}" (¿la pestaña está publicada en la web?)` };

    const declared = Number(response.headers.get("content-length") ?? 0);
    if (declared > MAX_CSV_BYTES) return { problem: `la respuesta pesa ${declared} bytes y el máximo es ${MAX_CSV_BYTES}` };

    const csv = await response.text();
    if (csv.length > MAX_CSV_BYTES) return { problem: `la respuesta pesa más de ${MAX_CSV_BYTES} caracteres` };
    return { csv };
  } catch (error) {
    const timedOut = error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError");
    return { problem: timedOut ? `no respondió en ${timeoutMs / 1000} s` : `no se pudo conectar: ${error instanceof Error ? error.message : String(error)}` };
  }
}

/**
 * Lo mínimo que el navegador necesita para volver a leer la hoja (BR-047). Es público: el identificador de
 * una hoja "publicada en la web" no da acceso de edición, y cualquiera que tenga el enlace puede leer el CSV.
 */
export interface SheetSource {
  id: string;
  gids: Partial<Record<ContentTab, string>>;
  baseUrl: string;
  timeoutMs: number;
}

function timeoutFrom(env: SheetEnv): number {
  return Number(env.CONTENT_FETCH_TIMEOUT_MS) > 0 ? Number(env.CONTENT_FETCH_TIMEOUT_MS) : DEFAULT_TIMEOUT_MS;
}

/** La fuente configurada en las variables, o `null` si falta el identificador o no hay ninguna pestaña válida. */
export function sheetSourceFromEnv(env: SheetEnv): SheetSource | null {
  const id = env.CONTENT_SHEET_ID?.trim();
  if (!id) return null;
  const { gids } = parseGids(env.CONTENT_SHEET_GIDS);
  if (Object.keys(gids).length === 0) return null;
  return { id, gids, baseUrl: env.CONTENT_SHEET_BASE_URL?.trim() || DEFAULT_BASE_URL, timeoutMs: timeoutFrom(env) };
}

/** Descarga en paralelo las pestañas de una fuente. Nunca lanza: cada falla queda en `problems`. */
export async function fetchSheetTabs(source: SheetSource, fetchImpl: typeof fetch = fetch): Promise<{ sheet: SheetCsv; problems: string[] }> {
  const sheet: SheetCsv = {};
  const problems: string[] = [];
  await Promise.all(
    (Object.entries(source.gids) as [ContentTab, string][]).map(async ([tab, gid]) => {
      const { csv, problem } = await fetchTab(sheetUrl(source.baseUrl, source.id, gid), source.timeoutMs, fetchImpl);
      if (csv !== undefined) sheet[tab] = csv;
      else problems.push(`${tab}: ${problem}`);
    }),
  );
  return { sheet, problems };
}

/** Descarga las pestañas configuradas en las variables de entorno (el build). Nunca lanza. */
export async function fetchSheet(env: SheetEnv, fetchImpl: typeof fetch = fetch): Promise<SheetFetchOutcome> {
  const sheetId = env.CONTENT_SHEET_ID?.trim();
  if (!sheetId) return { configured: false, sheet: {}, problems: [] };

  const { gids, problems } = parseGids(env.CONTENT_SHEET_GIDS);
  if (Object.keys(gids).length === 0) problems.push("CONTENT_SHEET_GIDS no define ninguna pestaña: se usa el respaldo");

  const source: SheetSource = { id: sheetId, gids, baseUrl: env.CONTENT_SHEET_BASE_URL?.trim() || DEFAULT_BASE_URL, timeoutMs: timeoutFrom(env) };
  const fetched = await fetchSheetTabs(source, fetchImpl);
  return { configured: true, sheet: fetched.sheet, problems: [...problems, ...fetched.problems] };
}
