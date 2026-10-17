import { describe, expect, it } from "vitest";
import type { TeamMember } from "@/types/team.types";
import { buildFixedHoneycomb, buildHoneycomb, HEX_COLS, HEX_ROWS, LEAD_COLS, LEAD_ROWS, ROW_STEP, type CellPlacement } from "./honeycombLayout";

// BR-060 (HU-EXP-004 CA-12): el panal se arma en una grilla de cuartos de ancho y octavos de alto de un hexágono.
const member = (name: string, isLead = false): TeamMember => ({
  name,
  role: "Barber",
  experience: "",
  image: "",
  isLead,
  specialties: [],
  description: "",
  bookingUrl: "",
  instagram: "",
  works: [],
  quote: "",
  workDays: [],
  branchIds: [],
});
const team = (others: number, withLead = true) => [
  ...(withLead ? [member("Líder", true)] : []),
  ...Array.from({ length: others }, (_, i) => member(`B${i + 1}`)),
];

type Point = [number, number];
type Polygon = Point[];

/** Vértices del hexágono de una celda, en anchos de hexágono (1 columna = 1/4 de ancho; 1 fila = 1/8 de su alto). */
const COL = 1 / HEX_COLS;
const ROW = 2 / Math.sqrt(3) / HEX_ROWS;
function polygon({ col, row, cols, rows }: CellPlacement): Polygon {
  const x = (col - 1) * COL;
  const y = (row - 1) * ROW;
  const w = cols * COL;
  const h = rows * ROW;
  return [
    [x + w / 2, y],
    [x + w, y + h / 4],
    [x + w, y + (3 * h) / 4],
    [x + w / 2, y + h],
    [x, y + (3 * h) / 4],
    [x, y + h / 4],
  ];
}

function pointToSegment(p: Point, a: Point, b: Point): number {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const t = Math.max(0, Math.min(1, ((p[0] - a[0]) * dx + (p[1] - a[1]) * dy) / (dx * dx + dy * dy)));
  return Math.hypot(p[0] - a[0] - t * dx, p[1] - a[1] - t * dy);
}

/** Distancia mínima entre dos hexágonos que no se montan (0 si comparten un borde o un vértice). */
function gap(a: Polygon, b: Polygon): number {
  const edges = (poly: Polygon) => poly.map((from, i) => [from, poly[(i + 1) % poly.length]] as const);
  const distances = [
    ...edges(a).flatMap(([from, to]) => b.map((p) => pointToSegment(p, from, to))),
    ...edges(b).flatMap(([from, to]) => a.map((p) => pointToSegment(p, from, to))),
  ];
  return Math.min(...distances);
}

describe("buildHoneycomb (BR-060, HU-EXP-004 CA-12)", () => {
  it("pone al líder primero y más grande, aunque venga en otra posición", () => {
    const members = [member("A"), member("Líder", true), member("B")];
    const { cells } = buildHoneycomb(members);
    expect(cells[0].member.name).toBe("Líder");
    expect(cells[0].isLead).toBe(true);
    expect(cells[0].desktop).toMatchObject({ col: 1, row: 1, cols: LEAD_COLS, rows: LEAD_ROWS });
    expect(cells.slice(1).every((cell) => cell.desktop.cols === HEX_COLS && cell.desktop.rows === HEX_ROWS)).toBe(true);
  });

  it("el líder mide 1,5 veces el ancho de los demás", () => {
    expect(LEAD_COLS / HEX_COLS).toBe(1.5);
    expect(LEAD_ROWS / HEX_ROWS).toBe(1.5);
  });

  it("CA-12, equipo de hoy (líder + 4): dos filas de 2 junto al líder, la de abajo corrida medio hexágono hacia él", () => {
    const { cells } = buildHoneycomb(team(4));
    const top = cells.slice(1, 3).map((cell) => cell.desktop);
    const bottom = cells.slice(3).map((cell) => cell.desktop);
    expect(top.map((p) => p.col)).toEqual([LEAD_COLS + 1, LEAD_COLS + 1 + HEX_COLS]);
    expect(bottom.map((p) => p.col)).toEqual([LEAD_COLS + 1 - HEX_COLS / 2, LEAD_COLS + 1 + HEX_COLS / 2]);
    // Las filas avanzan 3 cuartos de hexágono: la segunda encaja en los huecos de la primera.
    expect(bottom[0].row - top[0].row).toBe(ROW_STEP);
    expect(ROW_STEP).toBe((HEX_ROWS * 3) / 4);
  });

  it("CA-12, diseño de Figma (líder + 5): la fila de abajo lleva el barbero de más", () => {
    const { cells } = buildHoneycomb(team(5));
    const rows = new Map<number, number>();
    for (const cell of cells.slice(1)) rows.set(cell.desktop.row, (rows.get(cell.desktop.row) ?? 0) + 1);
    expect([...rows.values()]).toEqual([2, 3]);
  });

  it("un equipo grande se reparte en más filas de hasta 4, sin pasar del ancho", () => {
    const { cells, desktop } = buildHoneycomb(team(10));
    const perRow = new Map<number, number>();
    for (const cell of cells.slice(1)) perRow.set(cell.desktop.row, (perRow.get(cell.desktop.row) ?? 0) + 1);
    expect([...perRow.values()]).toEqual([3, 3, 4]);
    for (const { desktop: p } of cells) expect(p.col + p.cols - 1).toBeLessThanOrEqual(desktop.cols);
  });

  it("sin líder, el panal empieza en la primera columna y la fila de arriba va medio hexágono a su derecha", () => {
    const { cells } = buildHoneycomb(team(4, false));
    expect(cells.some((cell) => cell.isLead)).toBe(false);
    expect(cells.map((cell) => cell.desktop.col)).toEqual([1 + HEX_COLS / 2, 1 + HEX_COLS / 2 + HEX_COLS, 1, 1 + HEX_COLS]);
    expect(cells[0].desktop.row).toBe(1);
  });

  it("un solo barbero queda pegado al borde izquierdo: no deja columnas vacías", () => {
    const { cells, desktop, mobile } = buildHoneycomb([member("Solo")]);
    expect(cells).toHaveLength(1);
    expect(cells[0].desktop.col).toBe(1);
    expect(cells[0].mobile.col).toBe(1);
    expect(desktop.cols).toBe(HEX_COLS);
    expect(mobile.rows).toBe(HEX_ROWS);
  });

  it("en móvil: el líder arriba, centrado sobre la primera fila, y el resto en filas de 2 que se alternan", () => {
    const { cells, mobile } = buildHoneycomb(team(4));
    const lead = cells[0].mobile;
    const others = cells.slice(1).map((cell) => cell.mobile);
    expect(others.map((p) => p.col - others[0].col)).toEqual([0, HEX_COLS, HEX_COLS / 2, HEX_COLS / 2 + HEX_COLS]);
    expect(others[2].row - others[0].row).toBe(ROW_STEP);
    expect(others[0].row).toBeGreaterThan(lead.row);
    // El centro del líder coincide con el centro de la primera fila: su punta baja a la hendidura entre los dos.
    const leadCenter = lead.col - 1 + LEAD_COLS / 2;
    const firstRowCenter = (others[0].col - 1 + others[1].col - 1 + HEX_COLS) / 2;
    expect(leadCenter).toBe(firstRowCenter);
    expect(mobile.cols).toBe(HEX_COLS * 2 + HEX_COLS / 2);
  });

  it("ninguna celda se sale de la grilla en escritorio ni en móvil", () => {
    for (const size of [0, 1, 4, 5, 7, 10]) {
      const layout = buildHoneycomb(team(size));
      for (const cell of layout.cells) {
        for (const key of ["desktop", "mobile"] as const) {
          const p = cell[key];
          expect(p.col, `${size} ${key}`).toBeGreaterThanOrEqual(1);
          expect(p.col + p.cols - 1).toBeLessThanOrEqual(layout[key].cols);
          expect(p.row + p.rows - 1).toBeLessThanOrEqual(layout[key].rows);
        }
      }
    }
  });

  // El reclamo del usuario (2026-10-14): el líder se veía más lejos de la fila de abajo que los demás entre sí.
  describe("distancia pareja: cada par de hexágonos vecinos va a ras, sin huecos de más", () => {
    const NEAR = 0.2; // en anchos de hexágono: a menos que eso son vecinos, y entonces tienen que tocarse

    for (const size of [1, 2, 3, 4, 5, 6, 7, 10]) {
      for (const key of ["desktop", "mobile"] as const) {
        it(`${key}, líder + ${size}`, () => {
          const { cells } = buildHoneycomb(team(size));
          const polygons = cells.map((cell) => polygon(cell[key]));
          const offenders: string[] = [];
          for (let i = 0; i < polygons.length; i++) {
            for (let j = i + 1; j < polygons.length; j++) {
              const distance = gap(polygons[i], polygons[j]);
              if (distance > 1e-9 && distance < NEAR) {
                offenders.push(`${cells[i].member.name} – ${cells[j].member.name}: ${distance.toFixed(3)}`);
              }
            }
          }
          expect(offenders).toEqual([]);
        });
      }
    }

    it("el líder toca a la vez al de arriba a su derecha y al de abajo (el caso del reclamo)", () => {
      const { cells } = buildHoneycomb(team(4));
      const [lead, topLeft, , bottomLeft] = cells.map((cell) => polygon(cell.desktop));
      expect(gap(lead, topLeft)).toBeCloseTo(0, 9);
      expect(gap(lead, bottomLeft)).toBeCloseTo(0, 9);
    });

    it("en móvil el líder toca a los dos de la primera fila", () => {
      const { cells } = buildHoneycomb(team(4));
      const [lead, left, right] = cells.map((cell) => polygon(cell.mobile));
      expect(gap(lead, left)).toBeCloseTo(0, 9);
      expect(gap(lead, right)).toBeCloseTo(0, 9);
    });
  });
});

// BR-067 (HU-EXP-004 CA-18): el catálogo de productos es un panal sin líder, de filas fijas.
describe("buildFixedHoneycomb (BR-067, HU-EXP-004 CA-18)", () => {
  const rowsOf = (placements: CellPlacement[]) => {
    const rows = new Map<number, number[]>();
    for (const p of placements) rows.set(p.row, [...(rows.get(p.row) ?? []), p.col]);
    return [...rows.values()];
  };

  it("reparte en filas de 3 en escritorio y de 2 en móvil, la última con los que sobran", () => {
    const { cells } = buildFixedHoneycomb(7);
    expect(rowsOf(cells.map((cell) => cell.desktop)).map((row) => row.length)).toEqual([3, 3, 1]);
    expect(rowsOf(cells.map((cell) => cell.mobile)).map((row) => row.length)).toEqual([2, 2, 2, 1]);
  });

  it("la fila de abajo se corre medio hexágono a la izquierda, y las filas avanzan 3/4 de su alto", () => {
    const { cells } = buildFixedHoneycomb(6);
    const [first, , , fourth] = cells.map((cell) => cell.desktop);
    expect(first.col - fourth.col).toBe(HEX_COLS / 2);
    expect(fourth.row - first.row).toBe(ROW_STEP);
    expect(Math.min(...cells.map((cell) => cell.desktop.col))).toBe(1);
  });

  it("todos son del tamaño de un hexágono normal: no hay líder", () => {
    const { cells } = buildFixedHoneycomb(5);
    expect(cells.every((cell) => cell.desktop.cols === HEX_COLS && cell.mobile.rows === HEX_ROWS)).toBe(true);
  });

  it("sumar productos no mueve los que ya estaban (la carga progresiva solo agrega filas)", () => {
    const small = buildFixedHoneycomb(12);
    const large = buildFixedHoneycomb(30);
    expect(large.cells.slice(0, 12)).toEqual(small.cells);
    expect(large.desktop.rows).toBeGreaterThan(small.desktop.rows);
  });

  it("el tamaño de la grilla abarca a todos y no deja columnas vacías", () => {
    for (const count of [0, 1, 3, 4, 9, 13]) {
      const layout = buildFixedHoneycomb(count);
      for (const key of ["desktop", "mobile"] as const) {
        for (const cell of layout.cells) {
          expect(cell[key].col).toBeGreaterThanOrEqual(1);
          expect(cell[key].col + cell[key].cols - 1).toBeLessThanOrEqual(layout[key].cols);
          expect(cell[key].row + cell[key].rows - 1).toBeLessThanOrEqual(layout[key].rows);
        }
      }
    }
    expect(buildFixedHoneycomb(0)).toEqual({ cells: [], desktop: { cols: 0, rows: 0 }, mobile: { cols: 0, rows: 0 } });
  });

  describe("distancia pareja: cada par de hexágonos vecinos va a ras", () => {
    const NEAR = 0.2;
    for (const count of [1, 2, 3, 4, 5, 6, 7, 9, 12, 13, 30]) {
      for (const key of ["desktop", "mobile"] as const) {
        it(`${key}, ${count} productos`, () => {
          const polygons = buildFixedHoneycomb(count).cells.map((cell) => polygon(cell[key]));
          const offenders: string[] = [];
          for (let i = 0; i < polygons.length; i++) {
            for (let j = i + 1; j < polygons.length; j++) {
              const distance = gap(polygons[i], polygons[j]);
              if (distance > 1e-9 && distance < NEAR) offenders.push(`${i} – ${j}: ${distance.toFixed(3)}`);
            }
          }
          expect(offenders).toEqual([]);
        });
      }
    }
  });
});
