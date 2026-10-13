import { describe, expect, it } from "vitest";
import { normalizeHeader, parseCsv, toTable } from "./csv";

describe("parseCsv (BR-039, RF-CNT-002)", () => {
  it("separa filas y celdas simples", () => {
    expect(parseCsv("a,b,c\n1,2,3\n")).toEqual([
      ["a", "b", "c"],
      ["1", "2", "3"],
    ]);
  });

  it("acepta saltos de línea de Windows (CRLF) y de Mac antiguo (CR)", () => {
    expect(parseCsv("a,b\r\n1,2\r\n")).toEqual([["a", "b"], ["1", "2"]]);
    expect(parseCsv("a,b\r1,2\r")).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("una celda entre comillas puede llevar comas", () => {
    expect(parseCsv('nombre,descripcion\nCorte,"Corte, lavado y peinado"\n')).toEqual([
      ["nombre", "descripcion"],
      ["Corte", "Corte, lavado y peinado"],
    ]);
  });

  it("una celda entre comillas puede llevar saltos de línea", () => {
    expect(parseCsv('a,b\n1,"línea uno\nlínea dos"\n')).toEqual([
      ["a", "b"],
      ["1", "línea uno\nlínea dos"],
    ]);
  });

  it("las comillas dobles escapadas (\"\") dan una comilla", () => {
    expect(parseCsv('a\n"Dijo ""hola"" y se fue"\n')).toEqual([["a"], ['Dijo "hola" y se fue']]);
  });

  it("conserva las celdas vacías en el medio y al final de la fila", () => {
    expect(parseCsv("a,b,c\n1,,3\n4,5,\n")).toEqual([
      ["a", "b", "c"],
      ["1", "", "3"],
      ["4", "5", ""],
    ]);
  });

  it("la última fila no necesita salto de línea final", () => {
    expect(parseCsv("a,b\n1,2")).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("ignora el BOM inicial y las filas totalmente vacías", () => {
    expect(parseCsv("﻿a,b\n\n1,2\n,\n")).toEqual([["a", "b"], ["1", "2"]]);
  });

  it("un texto vacío da cero filas", () => {
    expect(parseCsv("")).toEqual([]);
  });

  it("no pierde la última celda si hay una comilla sin cerrar (hoja truncada)", () => {
    expect(parseCsv('a,b\n1,"texto sin cerrar')).toEqual([["a", "b"], ["1", "texto sin cerrar"]]);
  });
});

describe("normalizeHeader", () => {
  it.each([
    ["Descripción", "descripcion"],
    ["  Categoría ", "categoria"],
    ["Nombre Completo", "nombre_completo"],
    ["PRECIO", "precio"],
  ])("%s → %s", (input, expected) => {
    expect(normalizeHeader(input)).toBe(expected);
  });
});

describe("toTable", () => {
  it("usa la primera fila como encabezado y numera las filas como en la hoja (la 1 es el encabezado)", () => {
    const table = toTable(parseCsv("Nombre,Precio\nCorte,4000\nBarba,3000\n"));

    expect(table.headers).toEqual(["nombre", "precio"]);
    expect(table.records).toEqual([
      { row: 2, values: { nombre: "Corte", precio: "4000" } },
      { row: 3, values: { nombre: "Barba", precio: "3000" } },
    ]);
  });

  it("recorta los espacios de las celdas y rellena con vacío las que faltan al final", () => {
    const table = toTable(parseCsv("a,b,c\n  uno  ,dos\n"));

    expect(table.records[0].values).toEqual({ a: "uno", b: "dos", c: "" });
  });

  it("una tabla sin filas de datos tiene encabezados y ningún registro", () => {
    expect(toTable(parseCsv("a,b\n"))).toEqual({ headers: ["a", "b"], records: [] });
  });

  it("un texto vacío da una tabla vacía", () => {
    expect(toTable([])).toEqual({ headers: [], records: [] });
  });
});
