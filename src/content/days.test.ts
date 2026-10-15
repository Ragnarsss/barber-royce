import { describe, expect, it } from "vitest";
import { parseDays, WEEK_DAYS } from "./days";

// BR-063: días de atención de cada barbero (columna `dias` de la pestaña equipo). 0 = lunes … 6 = domingo.
describe("parseDays (BR-063)", () => {
  it("lee días sueltos abreviados, con o sin tilde, en cualquier orden", () => {
    expect(parseDays("Sáb, Lun, mar, Jue")).toEqual({ days: [0, 1, 3, 5], unknown: [] });
    expect(parseDays("sab, mie")).toEqual({ days: [2, 5], unknown: [] });
  });

  it("acepta los nombres completos", () => {
    expect(parseDays("Lunes, Miércoles, Domingo")).toEqual({ days: [0, 2, 6], unknown: [] });
  });

  it("acepta rangos con «a» o con guion", () => {
    expect(parseDays("Lun a Vie")).toEqual({ days: [0, 1, 2, 3, 4], unknown: [] });
    expect(parseDays("Mar-Jue, Sáb")).toEqual({ days: [1, 2, 3, 5], unknown: [] });
  });

  it("un rango que cruza el domingo da la vuelta a la semana", () => {
    expect(parseDays("Vie a Lun")).toEqual({ days: [0, 4, 5, 6], unknown: [] });
  });

  it("sin repetidos aunque se escriba dos veces", () => {
    expect(parseDays("Lun, Lunes, Lun a Mar")).toEqual({ days: [0, 1], unknown: [] });
  });

  it("vacío es ningún día; lo que no es un día se informa", () => {
    expect(parseDays("")).toEqual({ days: [], unknown: [] });
    expect(parseDays("Lun, Feriados")).toEqual({ days: [0], unknown: ["Feriados"] });
  });

  it("la semana empieza el lunes y tiene etiquetas cortas y largas", () => {
    expect(WEEK_DAYS.map((day) => day.short)).toEqual(["L", "M", "M", "J", "V", "S", "D"]);
    expect(WEEK_DAYS[5].long).toBe("Sábado");
  });
});
