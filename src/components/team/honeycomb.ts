import type { TeamMember } from "@/types/team.types";

/**
 * Panal del equipo (BR-060). La grilla tiene columnas de medio hexágono y filas de un cuarto de alto, así que un
 * hexágono de puntas arriba ocupa 2 columnas y 4 filas, y una fila del panal avanza 3 filas: la siguiente encaja en
 * los huecos que dejan las puntas. Las filas impares se corren una columna (medio hexágono).
 *
 * El líder ocupa una celda de 1,5 veces (3 × 6). En escritorio va a la izquierda y el resto se arma a su derecha,
 * con la fila de abajo corrida hacia él, como en el Figma; en móvil va arriba al centro y el resto en filas de 2.
 * Cada celda trae las dos posiciones y el CSS elige con una media query, sin JavaScript al cambiar el ancho.
 */
export const HEX_COLS = 2;
export const HEX_ROWS = 4;
export const LEAD_COLS = 3;
export const LEAD_ROWS = 6;
const ROW_STEP = 3;
const DESKTOP_MAX_PER_ROW = 4;
const MOBILE_PER_ROW = 2;

export interface CellPlacement {
  col: number;
  row: number;
  cols: number;
  rows: number;
}

export interface HoneycombCell {
  member: TeamMember;
  isLead: boolean;
  desktop: CellPlacement;
  mobile: CellPlacement;
}

export interface GridSize {
  cols: number;
  rows: number;
}

export interface Honeycomb {
  cells: HoneycombCell[];
  desktop: GridSize;
  mobile: GridSize;
}

/** Reparte `count` en `rows` filas lo más parejas posible, con las más cortas arriba. */
function splitRows(count: number, rows: number): number[] {
  const base = Math.floor(count / rows);
  const extra = count % rows;
  return Array.from({ length: rows }, (_, i) => base + (i >= rows - extra ? 1 : 0));
}

/** Coloca filas de hexágonos: las pares empiezan en `evenCol` y las impares una columna antes o después. */
function placeRows(sizes: number[], firstRow: number, evenCol: number, oddShift: number): CellPlacement[] {
  return sizes.flatMap((size, r) =>
    Array.from({ length: size }, (_, i) => ({
      col: evenCol + (r % 2 === 1 ? oddShift : 0) + i * HEX_COLS,
      row: firstRow + r * ROW_STEP,
      cols: HEX_COLS,
      rows: HEX_ROWS,
    })),
  );
}

function gridSize(placements: CellPlacement[]): GridSize {
  return {
    cols: Math.max(0, ...placements.map((p) => p.col + p.cols - 1)),
    rows: Math.max(0, ...placements.map((p) => p.row + p.rows - 1)),
  };
}

export function buildHoneycomb(team: TeamMember[]): Honeycomb {
  const lead = team.find((member) => member.isLead);
  const others = team.filter((member) => member !== lead);

  const desktopRowCount = others.length < 2 ? others.length : Math.max(2, Math.ceil(others.length / DESKTOP_MAX_PER_ROW));
  const desktopOthers = placeRows(
    splitRows(others.length, desktopRowCount),
    // Con líder, el panal baja medio hexágono: la fila de abajo, corrida hacia él, pasa bajo su punta sin pisarla.
    lead ? 3 : 1,
    lead ? LEAD_COLS + 1 : 2,
    -1,
  );

  const mobileOthers = placeRows(
    Array<number>(Math.ceil(others.length / MOBILE_PER_ROW)).fill(MOBILE_PER_ROW),
    lead ? LEAD_ROWS : 1,
    1,
    1,
  ).slice(0, others.length);
  const mobileWidth = others.length > 1 ? MOBILE_PER_ROW * HEX_COLS + 1 : LEAD_COLS;

  const cells: HoneycombCell[] = others.map((member, i) => ({
    member,
    isLead: false,
    desktop: desktopOthers[i],
    mobile: mobileOthers[i],
  }));
  if (lead) {
    cells.unshift({
      member: lead,
      isLead: true,
      desktop: { col: 1, row: 1, cols: LEAD_COLS, rows: LEAD_ROWS },
      mobile: { col: 1 + (mobileWidth - LEAD_COLS) / 2, row: 1, cols: LEAD_COLS, rows: LEAD_ROWS },
    });
  }

  return {
    cells,
    desktop: gridSize(cells.map((cell) => cell.desktop)),
    mobile: gridSize(cells.map((cell) => cell.mobile)),
  };
}
