import { describe, expect, it } from "vitest";
import { parseCsv } from "./csv";
import { contentToSheet, slugify } from "./sheetFormat";
import { snapshot } from "./snapshot";

describe("slugify (ids legibles para la hoja)", () => {
  it.each([
    ["CORTE DE CABELLO", "corte-de-cabello"],
    ["Corte + Barba ¡Premium!", "corte-barba-premium"],
    ["Atención de Chef", "atencion-de-chef"],
    ["  ¿Cómo agendo una cita?  ", "como-agendo-una-cita"],
    ["", "fila"],
    ["¡¡¡", "fila"],
  ])("%j → %s", (text, expected) => {
    expect(slugify(text)).toBe(expected);
  });

  it("recorta a 60 caracteres sin dejar un guion al final", () => {
    const id = slugify("palabra ".repeat(20));

    expect(id.length).toBeLessThanOrEqual(60);
    expect(id.endsWith("-")).toBe(false);
  });
});

describe("contentToSheet (plantillas y prueba del respaldo)", () => {
  const idsOf = (csv: string | undefined) => parseCsv(csv ?? "").slice(1).map((row) => row[0]);

  it("los ids de cada pestaña salen del nombre y son únicos aunque dos filas se llamen igual", () => {
    const content = { ...snapshot, services: [snapshot.services[0], snapshot.services[0], snapshot.services[1]] };

    const ids = idsOf(contentToSheet(content).servicios);

    expect(ids[0]).toBe(slugify(snapshot.services[0].name));
    expect(ids[1]).toBe(`${ids[0]}-2`);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("escribe el encabezado esperado en cada pestaña", () => {
    const sheet = contentToSheet(snapshot);

    expect(parseCsv(sheet.servicios ?? "")[0]).toEqual(["id", "nombre", "descripcion", "precio", "duracion", "incluye", "categoria", "imagen", "activo", "orden"]);
    expect(parseCsv(sheet.textos ?? "")[0]).toEqual(["clave", "valor"]);
  });
});
