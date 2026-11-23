import { describe, expect, it } from "vitest";
import { formatReports, resolveContent, type SheetCsv } from "./resolveContent";
import { contentToSheet } from "./sheetFormat";
import { snapshot } from "./snapshot";
import { CONTENT_TABS, type SiteContent } from "./types";

const OTHER: SiteContent = {
  services: [{ name: "Respaldo", description: "d", price: "$1.000", duration: "1 min", includes: "", image: "", category: "Barba" }],
  products: [{ id: "respaldo", name: "Respaldo", description: "d", price: "$1.000", image: "", category: "Styling" }],
  team: [{ name: "Respaldo", role: "r", experience: "e", image: "", isLead: false, specialties: [], description: "", bookingUrl: "", instagram: "", works: [], quote: "", workDays: [], branchIds: [] }],
  faq: [{ category: "Otros", question: "¿Respaldo?", answer: "Sí" }],
  texts: { "hero.lema": "Respaldo" },
  textsByBranch: { coquimbo: {}, "la-serena": {} },
  business: snapshot.business,
  locations: snapshot.locations,
};

const goodSheet: SheetCsv = {
  servicios: "id,nombre,descripcion,precio,duracion,categoria\ncorte,Corte,Descripción,4000,45 min,Corte de Cabello\n",
  productos: "id,nombre,descripcion,precio,categoria\npomada,Pomada,Hold fuerte,15990,Styling\n",
  equipo: "id,nombre,cargo,experiencia\nc,Carlos,Master,15 años\n",
  preguntas: "id,categoria,pregunta,respuesta\np,Otros,¿Algo?,Sí\n",
  textos: "clave,valor\nhero.lema,Nuevo título\n",
  "textos-coquimbo": "clave,valor\ncta2.titulo,Reserva en Coquimbo\n",
  "textos-la-serena": "clave,valor\ncta2.titulo,Reserva en La Serena\n",
  negocio: "clave,valor\ntelefono,+56 9 5555 4444\n",
  sucursales:
    "id,nombre,direccion,ciudad,telefono,email,whatsapp,mapa,horario_semana,horario_sabado,horario_domingo\n" +
    "s,Sucursal,Calle 1,Ciudad,+56 9 5555 4444,a@b.cl,+56 9 5555 4444,https://www.google.com/maps/embed?pb=1,09:00,09:00,Cerrado\n",
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
      expect(OTHER.texts).toEqual({ "hero.lema": "Respaldo" });
    });
  });

  describe("con la hoja completa y válida", () => {
    it("CA-01: todas las pestañas salen de la hoja", () => {
      const { content, reports } = resolveContent(goodSheet, OTHER);

      expect(content.services.map((s) => s.name)).toEqual(["Corte"]);
      expect(content.products.map((p) => p.price)).toEqual(["$15.990"]);
      expect(content.team.map((m) => m.name)).toEqual(["Carlos"]);
      expect(content.faq.map((q) => q.question)).toEqual(["¿Algo?"]);
      expect(content.texts).toEqual({ "hero.lema": "Nuevo título" });
      expect(content.business.contact.phone).toEqual({ display: "+56 9 5555 4444", link: "tel:+56955554444" });
      expect(content.locations.map((l) => l.name)).toEqual(["Sucursal"]);
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
      const { content } = resolveContent({ textos: 'clave,valor\nhero.lema,"<script>alert(1)</script>"\n' }, OTHER);

      expect(content.texts["hero.lema"]).toBe("<script>alert(1)</script>");
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

describe("sucursales de cada barbero (BR-063)", () => {
  const withBranch = (branch: string): SheetCsv => ({
    ...goodSheet,
    equipo: `id,nombre,cargo,experiencia,sucursal\nc,Carlos,Master,15 años,${branch}\n`,
  });

  it("una sucursal que existe en la pestaña sucursales se acepta", () => {
    const { content, reports } = resolveContent(withBranch("s"), OTHER);

    expect(content.team[0]).toMatchObject({ name: "Carlos", branchIds: ["s"] });
    expect(reports.find((report) => report.tab === "equipo")?.source).toBe("hoja");
  });

  it("una sucursal que no existe rechaza la pestaña equipo, que vuelve al respaldo con el problema", () => {
    const { content, reports } = resolveContent(withBranch("coquimbo-centro"), OTHER);
    const equipo = reports.find((report) => report.tab === "equipo");

    expect(content.team).toEqual(OTHER.team);
    expect(equipo?.source).toBe("respaldo");
    expect(equipo?.issues[0]).toMatchObject({ tab: "equipo", row: 2, field: "sucursal" });
    expect(equipo?.issues[0].message).toContain("coquimbo-centro");
  });

  it("se valida contra las sucursales que usa el sitio, aunque vengan del respaldo", () => {
    const { content } = resolveContent({ equipo: withBranch(OTHER.locations[0].id).equipo }, OTHER);

    expect(content.team[0].branchIds).toEqual([OTHER.locations[0].id]);
  });
});

describe("avisos de la pestaña textos (BR-042)", () => {
  const withTypo: SheetCsv = { textos: "clave,valor\nhero.lema,Nuevo\nhero.titlo,Con error\n" };

  it("una clave desconocida no impide usar la hoja y queda como aviso en el informe", () => {
    const { content, reports } = resolveContent(withTypo, OTHER);
    const report = reports.find((r) => r.tab === "textos");

    expect(report?.source).toBe("hoja");
    expect(content.texts).toEqual({ "hero.lema": "Nuevo" });
    expect(report?.warnings).toHaveLength(1);
    expect(report?.issues).toEqual([]);
  });

  it("formatReports muestra los avisos con «!» para distinguirlos de los problemas", () => {
    const lines = formatReports(resolveContent(withTypo, OTHER).reports);

    expect(lines).toContain('  ! textos fila 3, clave: "hero.titlo" no es un texto que use el sitio (¿error de escritura?): se ignora');
  });

  it("con la pestaña válida, los textos son los de la hoja: los que no define usan el texto por defecto del código", () => {
    const { content } = resolveContent({ textos: "clave,valor\nhero.lema,Nuevo\n" }, OTHER);

    expect(content.texts).toEqual({ "hero.lema": "Nuevo" });
  });

  it("si la pestaña es inválida, los textos son los del respaldo", () => {
    const { content } = resolveContent({ textos: `clave,valor\nhero.lema,${"x".repeat(500)}\n` }, OTHER);

    expect(content.texts).toEqual(OTHER.texts);
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

describe("reserva por sucursal al fusionar la hoja con el respaldo (BR-103, RF-CNT-009)", () => {
  const BACKUP_URL = "https://roycespa.site.agendapro.com/cl/sucursal/1";
  const SHEET_URL = "https://roycespa.site.agendapro.com/cl/sucursal/2";
  const backupWithUrl: SiteContent = { ...OTHER, locations: [{ ...snapshot.locations[0], id: "s", bookingUrl: BACKUP_URL }] };
  const head = "id,nombre,direccion,ciudad,telefono,email,whatsapp,mapa,horario_semana,horario_sabado,horario_domingo";
  const row = (id: string, reserva?: string) =>
    `${id},Sucursal,Calle 1,Ciudad,+56 9 5555 4444,a@b.cl,+56 9 5555 4444,https://www.google.com/maps/embed?pb=1,09:00,09:00,Cerrado` + (reserva === undefined ? "" : `,${reserva}`);

  it("una fila sin la columna reserva conserva el enlace de respaldo de esa sucursal, no el general", () => {
    const { content } = resolveContent({ ...goodSheet, sucursales: `${head}\n${row("s")}\n` }, backupWithUrl);

    expect(content.locations[0].bookingUrl).toBe(BACKUP_URL);
  });

  it("una celda reserva vacía también conserva el respaldo", () => {
    const { content } = resolveContent({ ...goodSheet, sucursales: `${head},reserva\n${row("s", "")}\n` }, backupWithUrl);

    expect(content.locations[0].bookingUrl).toBe(BACKUP_URL);
  });

  it("la reserva que escribe el dueño en la hoja manda sobre el respaldo", () => {
    const { content } = resolveContent({ ...goodSheet, sucursales: `${head},reserva\n${row("s", SHEET_URL)}\n` }, backupWithUrl);

    expect(content.locations[0].bookingUrl).toBe(SHEET_URL);
  });

  it("una sucursal nueva que el respaldo no conoce queda sin enlace propio", () => {
    const { content } = resolveContent({ ...goodSheet, sucursales: `${head}\n${row("otra")}\n` }, backupWithUrl);

    expect(content.locations[0]).not.toHaveProperty("bookingUrl");
  });
});

describe("textos por sucursal (BR-110, RF-CNT-010, HU-CNT-002 CA-04 a CA-06)", () => {
  it("CA-04: la pestaña textos-la-serena llena solo los textos de La Serena", () => {
    const { content, reports } = resolveContent({ "textos-la-serena": "clave,valor\nhero.lema,Serenidad\n" }, OTHER);

    expect(content.textsByBranch["la-serena"]).toEqual({ "hero.lema": "Serenidad" });
    expect(content.textsByBranch.coquimbo).toEqual({});
    expect(reports.find((r) => r.tab === "textos-la-serena")?.source).toBe("hoja");
  });

  it("textos-coquimbo llena solo los de Coquimbo, y textos sigue siendo la base común", () => {
    const { content } = resolveContent({ textos: "clave,valor\nhero.lema,Común\n", "textos-coquimbo": "clave,valor\ncta2.titulo,Coquimbo\n" }, OTHER);

    expect(content.texts).toEqual({ "hero.lema": "Común" });
    expect(content.textsByBranch.coquimbo).toEqual({ "cta2.titulo": "Coquimbo" });
    expect(content.textsByBranch["la-serena"]).toEqual({});
  });

  it("CA-06: sin la pestaña de una sucursal queda el respaldo (vacío): esa sucursal usa la base común", () => {
    const { content, reports } = resolveContent({ textos: "clave,valor\nhero.lema,Común\n" }, OTHER);

    expect(content.textsByBranch.coquimbo).toEqual({});
    expect(reports.find((r) => r.tab === "textos-coquimbo")?.source).toBe("respaldo");
  });

  it("una pestaña de sucursal con solo el encabezado es válida: significa «sin textos propios»", () => {
    const { content, reports } = resolveContent({ "textos-la-serena": "clave,valor\n" }, OTHER);

    expect(content.textsByBranch["la-serena"]).toEqual({});
    expect(reports.find((r) => r.tab === "textos-la-serena")?.source).toBe("hoja");
  });

  it("CA-03: un valor sobre el largo máximo rechaza solo esa pestaña, y se avisa con el nombre de la pestaña", () => {
    const largo = "x".repeat(400);
    const { content, reports } = resolveContent({ "textos-la-serena": `clave,valor\nhero.lema,${largo}\n` }, OTHER);

    expect(content.textsByBranch["la-serena"]).toEqual({});
    expect(reports.find((r) => r.tab === "textos-la-serena")?.issues[0].tab).toBe("textos-la-serena");
    expect(formatReports(reports).join("\n")).toContain("textos-la-serena fila 2, valor");
  });

  it("una clave que el sitio no conoce se ignora con un aviso, en la pestaña de la sucursal", () => {
    const { content, reports } = resolveContent({ "textos-coquimbo": "clave,valor\nhero.titlo,Con error\n" }, OTHER);

    expect(content.textsByBranch.coquimbo).toEqual({});
    expect(reports.find((r) => r.tab === "textos-coquimbo")?.warnings).toHaveLength(1);
  });
});
