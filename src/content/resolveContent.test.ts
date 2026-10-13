import { describe, expect, it } from "vitest";
import { formatReports, resolveContent, type SheetCsv } from "./resolveContent";
import { contentToSheet } from "./sheetFormat";
import { snapshot } from "./snapshot";
import { CONTENT_TABS, type SiteContent } from "./types";

const OTHER: SiteContent = {
  services: [{ name: "Respaldo", description: "d", price: "$1.000", duration: "1 min", includes: "", image: "", category: "Barba" }],
  products: [{ name: "Respaldo", description: "d", price: "$1.000", image: "", category: "Styling" }],
  team: [{ name: "Respaldo", role: "r", experience: "e", image: "", isLead: false }],
  faq: [{ category: "Otros", question: "¿Respaldo?", answer: "Sí" }],
  texts: { "hero.titulo": "Respaldo" },
};

const goodSheet: SheetCsv = {
  servicios: "id,nombre,descripcion,precio,duracion,categoria\ncorte,Corte,Descripción,4000,45 min,Corte de Cabello\n",
  productos: "id,nombre,descripcion,precio,categoria\npomada,Pomada,Hold fuerte,15990,Styling\n",
  equipo: "id,nombre,cargo,experiencia\nc,Carlos,Master,15 años\n",
  preguntas: "id,categoria,pregunta,respuesta\np,Otros,¿Algo?,Sí\n",
  textos: "clave,valor\nhero.titulo,Nuevo título\n",
};

describe("resolveContent: hoja o respaldo (BR-039, HU-CNT-001, RNF-CONF-003)", () => {
  describe("sin hoja", () => {
    it("CA-02: sin datos de la hoja el resultado es exactamente el respaldo", () => {
      const { content, reports } = resolveContent({}, OTHER);

      expect(content).toEqual(OTHER);
      expect(reports.map((report) => [report.tab, report.source])).toEqual(CONTENT_TABS.map((tab) => [tab, "respaldo"]));
    });

    it("el resultado es una copia: modificarlo no altera el respaldo original", () => {
      const { content } = resolveContent({}, OTHER);

      content.services.push(OTHER.services[0]);
      content.texts.otro = "x";

      expect(OTHER.services).toHaveLength(1);
      expect(OTHER.texts).toEqual({ "hero.titulo": "Respaldo" });
    });
  });

  describe("con la hoja completa y válida", () => {
    it("CA-01: todas las pestañas salen de la hoja", () => {
      const { content, reports } = resolveContent(goodSheet, OTHER);

      expect(content.services.map((s) => s.name)).toEqual(["Corte"]);
      expect(content.products.map((p) => p.price)).toEqual(["$15.990"]);
      expect(content.team.map((m) => m.name)).toEqual(["Carlos"]);
      expect(content.faq.map((q) => q.question)).toEqual(["¿Algo?"]);
      expect(content.texts).toEqual({ "hero.titulo": "Nuevo título" });
      expect(reports.every((report) => report.source === "hoja" && report.issues.length === 0)).toBe(true);
    });

    it("informa cuántas filas se aceptaron en cada pestaña", () => {
      const { reports } = resolveContent(goodSheet, OTHER);

      expect(reports.find((report) => report.tab === "servicios")?.count).toBe(1);
    });
  });

  describe("una pestaña con problemas", () => {
    const withBadServices: SheetCsv = {
      ...goodSheet,
      servicios: "id,nombre,descripcion,precio,duracion,categoria\ncorte,Corte,Descripción,4000,45 min,Corte de Cabello\nbarba,Barba,Descripción,,30 min,Barba\n",
    };

    it("CA-03: una sola fila inválida rechaza la pestaña completa y se usa su respaldo", () => {
      const { content, reports } = resolveContent(withBadServices, OTHER);

      expect(content.services).toEqual(OTHER.services);
      const report = reports.find((r) => r.tab === "servicios");
      expect(report?.source).toBe("respaldo");
      expect(report?.issues).toEqual([{ tab: "servicios", row: 3, field: "precio", message: "es obligatorio" }]);
    });

    it("RN-03: las demás pestañas siguen usando la hoja", () => {
      const { content } = resolveContent(withBadServices, OTHER);

      expect(content.products.map((p) => p.name)).toEqual(["Pomada"]);
      expect(content.team.map((m) => m.name)).toEqual(["Carlos"]);
      expect(content.faq.map((q) => q.question)).toEqual(["¿Algo?"]);
    });
  });

  describe("pestañas que no sirven", () => {
    it.each([
      ["texto vacío", "", "la pestaña está vacía"],
      ["solo espacios y saltos de línea", "  \n\n ", "la pestaña está vacía"],
      ["solo encabezado, sin filas", "id,nombre,descripcion,precio,duracion,categoria\n", "no tiene ninguna fila activa"],
      ["todas las filas ocultas con activo=NO", "id,nombre,descripcion,precio,duracion,categoria,activo\na,A,d,1000,10 min,Barba,NO\n", "no tiene ninguna fila activa"],
    ])("servicios con %s usa el respaldo (el sitio nunca se queda sin servicios)", (_name, csv, reason) => {
      const { content, reports } = resolveContent({ servicios: csv }, OTHER);

      expect(content.services).toEqual(OTHER.services);
      expect(reports.find((r) => r.tab === "servicios")?.reason).toBe(reason);
    });

    it("una pestaña `textos` con solo encabezado es válida: significa «sin textos propios»", () => {
      const { content, reports } = resolveContent({ textos: "clave,valor\n" }, OTHER);

      expect(content.texts).toEqual({});
      expect(reports.find((r) => r.tab === "textos")?.source).toBe("hoja");
    });

    it("una pestaña con otro encabezado (la hoja equivocada) usa el respaldo y nombra la columna que falta", () => {
      const { reports } = resolveContent({ servicios: "producto,valor\nPomada,5000\n" }, OTHER);
      const report = reports.find((r) => r.tab === "servicios");

      expect(report?.source).toBe("respaldo");
      expect(report?.issues.map((issue) => issue.field)).toContain("nombre");
    });
  });

  describe("robustez ante contenido no confiable", () => {
    it.each([
      ["HTML de error de Google en vez de CSV", "<!DOCTYPE html><html><body>Error 404</body></html>"],
      ["JSON", '{"error":"no autorizado"}'],
      ["comillas sin cerrar", 'id,nombre\n"a,b'],
      ["caracteres de control", "\u0000\u0001\u0002,\u0003\n\u0004"],
      ["una línea gigante", "x,".repeat(50_000)],
    ])("%s: nunca lanza y usa el respaldo", (_name, garbage) => {
      const sheet = Object.fromEntries(CONTENT_TABS.map((tab) => [tab, garbage])) as SheetCsv;

      let resolved;
      expect(() => {
        resolved = resolveContent(sheet, OTHER);
      }).not.toThrow();
      expect(resolved!.content.services).toEqual(OTHER.services);
    });

    it("un texto con HTML se conserva como texto: el sitio nunca lo interpreta como código (RN-01 de HU-CNT-002)", () => {
      const { content } = resolveContent({ textos: 'clave,valor\nhero.titulo,"<script>alert(1)</script>"\n' }, OTHER);

      expect(content.texts["hero.titulo"]).toBe("<script>alert(1)</script>");
    });
  });

  describe("el respaldo cumple el mismo esquema que la hoja (RNF-DATOS-002, CP-DATOS-002)", () => {
    it("el contenido actual del sitio, escrito como hoja y leído de vuelta, no cambia ni pierde nada", () => {
      const { content, reports } = resolveContent(contentToSheet(snapshot), OTHER);

      expect(reports.map((report) => `${report.tab}:${report.source}`)).toEqual(CONTENT_TABS.map((tab) => `${tab}:hoja`));
      expect(reports.flatMap((report) => report.issues)).toEqual([]);
      expect(content.services).toEqual(snapshot.services);
      expect(content.products).toEqual(snapshot.products);
      expect(content.team).toEqual(snapshot.team);
      expect(content.faq).toEqual(snapshot.faq);
    });

    it("el respaldo tiene contenido en cada pestaña de catálogo", () => {
      expect(snapshot.services.length).toBeGreaterThan(0);
      expect(snapshot.products.length).toBeGreaterThan(0);
      expect(snapshot.team.length).toBeGreaterThan(0);
      expect(snapshot.faq.length).toBeGreaterThan(0);
    });
  });
});

describe("formatReports: líneas para el log del build", () => {
  it("una línea por pestaña y una por problema, con pestaña, fila y campo", () => {
    const { reports } = resolveContent(
      { servicios: "id,nombre,descripcion,precio,duracion,categoria\na,A,d,,10 min,Barba\n", productos: goodSheet.productos },
      OTHER,
    );

    const lines = formatReports(reports);

    expect(lines).toContain("servicios: respaldo (1 problema en la hoja)");
    expect(lines).toContain("  - servicios fila 2, precio: es obligatorio");
    expect(lines).toContain("productos: hoja (1 fila)");
    expect(lines).toContain("equipo: respaldo (no se obtuvo de la hoja)");
  });
});
