/**
 * Lector de CSV para el contenido de la hoja (BR-039, RF-CNT-002).
 *
 * Google Sheets publica cada pestaña como CSV (RFC 4180): campos separados por coma, entre
 * comillas dobles cuando contienen comas, saltos de línea o comillas (que se duplican: `""`).
 * No es un lector general: no soporta otros separadores ni comillas simples.
 */

/** Convierte el texto CSV en filas de celdas. Ignora el BOM inicial y las filas totalmente vacías. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  const source = text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;

  const endCell = () => {
    row.push(cell);
    cell = "";
  };
  const endRow = () => {
    endCell();
    if (row.some((value) => value.trim() !== "")) rows.push(row);
    row = [];
  };

  for (let index = 0; index < source.length; index++) {
    const char = source[index];

    if (inQuotes) {
      if (char === '"' && source[index + 1] === '"') {
        cell += '"';
        index++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        cell += char;
      }
      continue;
    }

    if (char === '"') inQuotes = true;
    else if (char === ",") endCell();
    else if (char === "\n") endRow();
    else if (char === "\r") {
      if (source[index + 1] === "\n") index++;
      endRow();
    } else cell += char;
  }

  // Última fila sin salto de línea final.
  if (cell !== "" || row.length > 0) endRow();

  return rows;
}

/** Normaliza un encabezado: sin tildes, en minúsculas y sin espacios (`Descripción ` → `descripcion`). */
export function normalizeHeader(header: string): string {
  return header
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

export interface CsvTable {
  /** Encabezados normalizados, en el orden de la hoja. */
  headers: string[];
  /** Una entrada por fila de datos. `row` es el número de fila en la hoja (el encabezado es la 1). */
  records: { row: number; values: Record<string, string> }[];
}

/** Separa el encabezado de los datos y arma un objeto por fila. Las celdas se recortan (`trim`). */
export function toTable(rows: string[][]): CsvTable {
  const [headerRow = [], ...dataRows] = rows;
  const headers = headerRow.map(normalizeHeader);

  return {
    headers,
    records: dataRows.map((cells, index) => ({
      row: index + 2,
      values: Object.fromEntries(headers.map((header, column) => [header, (cells[column] ?? "").trim()])),
    })),
  };
}

/** Inversa de `parseCsv`: entrecomilla las celdas que llevan comas, comillas o saltos de línea. */
export function toCsv(rows: string[][]): string {
  const quote = (cell: string) => (/[",\r\n]/.test(cell) ? `"${cell.replaceAll('"', '""')}"` : cell);
  return rows.map((row) => row.map(quote).join(",")).join("\n") + "\n";
}
