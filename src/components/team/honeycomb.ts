import type { TeamMember } from "@/types/team.types";

/**
 * Panal del equipo (BR-060). La grilla tiene columnas de un cuarto de hexágono de ancho y filas de un octavo de su
 * alto: un hexágono de puntas arriba ocupa 4 columnas y 8 filas, y una fila del panal avanza 6 filas (3/4 de su alto),
 * así que la siguiente encaja en los huecos que dejan las puntas. Las filas impares se corren media celda (2 columnas).
 *
 * El líder mide 1,5 veces (6 × 12). Con columnas de medio hexágono su borde diagonal caería a media unidad de los
 * del vecino y quedaría más lejos que los demás entre sí; con cuartos y octavos cabe justo, y cada par de hexágonos
 * vecinos comparte un borde entero (lo comprueba `honeycomb.test.ts`). Los hexágonos son regulares (alto = 2/√3 del
 * ancho), así que separarlos todos igual se hace encogiéndolos por igual en el CSS.
 *
 * En escritorio el líder va a la izquierda y el resto se arma a su derecha, con la fila de abajo corrida hacia él,
 * como en el Figma; en móvil va arriba y su punta baja a la hendidura de la primera fila. Cada celda trae las dos
 * posiciones y el CSS elige con una media query, sin JavaScript al cambiar el ancho.
 */
export const HEX_COLS = 4;
export const HEX_ROWS = 8;
export const LEAD_COLS = 6;
export const LEAD_ROWS = 12;
export const ROW_STEP = (HEX_ROWS * 3) / 4;
const HALF_HEX = HEX_COLS / 2;
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

/** Coloca filas de hexágonos: las filas impares se corren `shift` columnas respecto de las pares. */
function placeRows(sizes: number[], firstCol: number, firstRow: number, shift: number): CellPlacement[] {
  return sizes.flatMap((size, r) =>
    Array.from({ length: size }, (_, i) => ({
      col: firstCol + (r % 2 === 1 ? shift : 0) + i * HEX_COLS,
      row: firstRow + r * ROW_STEP,
      cols: HEX_COLS,
      rows: HEX_ROWS,
    })),
  );
}

/** Corre todo hacia la izquierda hasta que la primera columna ocupada sea la 1: la grilla no deja columnas vacías. */
function toFirstColumn(placements: CellPlacement[]): CellPlacement[] {
  if (placements.length === 0) return placements;
  const shift = Math.min(...placements.map((p) => p.col)) - 1;
  return placements.map((p) => ({ ...p, col: p.col - shift }));
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
  const hasLead = lead !== undefined;

  // Escritorio. El primer barbero queda a ras de la arista derecha del líder y un cuarto de su alto más abajo, que es
  // donde la fila de abajo, corrida hacia el líder, también queda a ras de su diagonal.
  const desktopRows = others.length < 2 ? others.length : Math.max(2, Math.ceil(others.length / DESKTOP_MAX_PER_ROW));
  const desktopLead: CellPlacement = { col: 1, row: 1, cols: LEAD_COLS, rows: LEAD_ROWS };
  const desktopAll = toFirstColumn([
    ...(hasLead ? [desktopLead] : []),
    ...placeRows(
      splitRows(others.length, desktopRows),
      hasLead ? LEAD_COLS + 1 : 1 + HALF_HEX,
      hasLead ? 1 + LEAD_ROWS / 4 : 1,
      -HALF_HEX,
    ),
  ]);

  // Móvil. Filas de 2: la punta del líder baja justo a la hendidura que dejan los dos de la primera fila.
  const mobileLead: CellPlacement = { col: 1 + HEX_COLS - LEAD_COLS / 2, row: 1, cols: LEAD_COLS, rows: LEAD_ROWS };
  const mobileAll = toFirstColumn([
    ...(hasLead ? [mobileLead] : []),
    ...placeRows(
      Array<number>(Math.ceil(others.length / MOBILE_PER_ROW)).fill(MOBILE_PER_ROW),
      hasLead ? mobileLead.col + LEAD_COLS / 2 - HEX_COLS : 1,
      hasLead ? 1 + LEAD_ROWS - HEX_ROWS / 4 : 1,
      HALF_HEX,
    ).slice(0, others.length),
  ]);

  const offset = hasLead ? 1 : 0;
  const cells: HoneycombCell[] = others.map((member, i) => ({
    member,
    isLead: false,
    desktop: desktopAll[i + offset],
    mobile: mobileAll[i + offset],
  }));
  if (hasLead) cells.unshift({ member: lead, isLead: true, desktop: desktopAll[0], mobile: mobileAll[0] });

  return { cells, desktop: gridSize(desktopAll), mobile: gridSize(mobileAll) };
}
