import { describe, expect, it } from "vitest";
import type { TeamMember } from "@/types/team.types";
import { buildHoneycomb, HEX_COLS, HEX_ROWS, LEAD_COLS, LEAD_ROWS } from "./honeycomb";

// BR-060 (HU-EXP-004 CA-12): el panal se arma en una grilla de medias columnas y cuartos de alto.
const member = (name: string, isLead = false): TeamMember => ({ name, role: "Barber", experience: "", image: "", isLead });
const team = (others: number, withLead = true) => [
  ...(withLead ? [member("Líder", true)] : []),
  ...Array.from({ length: others }, (_, i) => member(`B${i + 1}`)),
];

describe("buildHoneycomb (BR-060, HU-EXP-004 CA-12)", () => {
  it("pone al líder primero y más grande, aunque venga en otra posición", () => {
    const members = [member("A"), member("Líder", true), member("B")];
    const { cells } = buildHoneycomb(members);
    expect(cells[0].member.name).toBe("Líder");
    expect(cells[0].isLead).toBe(true);
    expect(cells[0].desktop).toMatchObject({ col: 1, row: 1, cols: LEAD_COLS, rows: LEAD_ROWS });
    expect(cells.slice(1).every((cell) => cell.desktop.cols === HEX_COLS && cell.desktop.rows === HEX_ROWS)).toBe(true);
  });

  it("CA-12, equipo de hoy (líder + 4): dos filas de 2 junto al líder, la de abajo corrida medio hexágono a la izquierda", () => {
    const { cells } = buildHoneycomb(team(4));
    const top = cells.slice(1, 3).map((cell) => cell.desktop);
    const bottom = cells.slice(3).map((cell) => cell.desktop);
    expect(top.map((p) => p.col)).toEqual([LEAD_COLS + 1, LEAD_COLS + 3]);
    expect(bottom.map((p) => p.col)).toEqual([LEAD_COLS, LEAD_COLS + 2]);
    // Las filas avanzan 3 cuartos de hexágono: la segunda encaja en los huecos de la primera.
    expect(bottom[0].row - top[0].row).toBe(3);
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

  it("sin líder, el panal empieza en la primera columna", () => {
    const { cells } = buildHoneycomb(team(4, false));
    expect(cells.some((cell) => cell.isLead)).toBe(false);
    expect(cells.map((cell) => cell.desktop.col)).toEqual([2, 4, 1, 3]);
    expect(cells[0].desktop.row).toBe(1);
  });

  it("un solo barbero ocupa una celda y el panal mide eso", () => {
    const { cells, desktop, mobile } = buildHoneycomb([member("Solo")]);
    expect(cells).toHaveLength(1);
    expect(desktop.cols).toBeGreaterThanOrEqual(HEX_COLS);
    expect(mobile.rows).toBeGreaterThanOrEqual(HEX_ROWS);
  });

  it("en móvil: el líder arriba al centro y el resto en filas de 2 que se alternan", () => {
    const { cells, mobile } = buildHoneycomb(team(4));
    expect(cells[0].mobile.col + LEAD_COLS / 2).toBe(1 + mobile.cols / 2);
    const others = cells.slice(1).map((cell) => cell.mobile);
    expect(others.map((p) => p.col)).toEqual([1, 3, 2, 4]);
    expect(others[2].row - others[0].row).toBe(3);
    expect(others[0].row).toBeGreaterThan(cells[0].mobile.row);
  });

  it("ninguna celda se sale de la grilla en escritorio ni en móvil", () => {
    for (const size of [0, 1, 4, 5, 7, 10]) {
      const layout = buildHoneycomb(team(size));
      for (const cell of layout.cells) {
        for (const key of ["desktop", "mobile"] as const) {
          const p = cell[key];
          expect(p.col + p.cols - 1).toBeLessThanOrEqual(layout[key].cols);
          expect(p.row + p.rows - 1).toBeLessThanOrEqual(layout[key].rows);
        }
      }
    }
  });
});
