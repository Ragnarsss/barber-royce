import { CONTENT_TABS, type ContentTab } from "../src/content/types";

/**
 * Descarga de la hoja de cálculo al construir (BR-040, ADR-008). Solo texto y red: no conoce Vite ni el
 * esquema del contenido, así que se puede probar con un `fetch` falso.
 *
 * La hoja se "publica en la web" desde Google Sheets (Archivo → Compartir → Publicar en la web, por
 * pestaña, como CSV). Eso da un identificador de publicación (`2PACX-…`) y un `gid` por pestaña, y no
 * requiere claves ni cuentas de servicio. Las variables NO llevan el prefijo `VITE_`: son del build y no
 * llegan al navegador.
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

/** Descarga las pestañas configuradas en paralelo. Nunca lanza: cada falla queda en `problems`. */
export async function fetchSheet(env: SheetEnv, fetchImpl: typeof fetch = fetch): Promise<SheetFetchOutcome> {
  const sheetId = env.CONTENT_SHEET_ID?.trim();
  if (!sheetId) return { configured: false, sheet: {}, problems: [] };

  const { gids, problems } = parseGids(env.CONTENT_SHEET_GIDS);
  const timeoutMs = Number(env.CONTENT_FETCH_TIMEOUT_MS) > 0 ? Number(env.CONTENT_FETCH_TIMEOUT_MS) : DEFAULT_TIMEOUT_MS;
  const baseUrl = env.CONTENT_SHEET_BASE_URL?.trim() || DEFAULT_BASE_URL;

  if (Object.keys(gids).length === 0) problems.push("CONTENT_SHEET_GIDS no define ninguna pestaña: se usa el respaldo");

  const sheet: SheetCsv = {};
  await Promise.all(
    (Object.entries(gids) as [ContentTab, string][]).map(async ([tab, gid]) => {
      const { csv, problem } = await fetchTab(sheetUrl(baseUrl, sheetId, gid), timeoutMs, fetchImpl);
      if (csv !== undefined) sheet[tab] = csv;
      else problems.push(`${tab}: ${problem}`);
    }),
  );

  return { configured: true, sheet, problems };
}
