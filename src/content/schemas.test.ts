import { describe, expect, it } from "vitest";
import { parseCsv, toTable } from "./csv";
import { readFaq, readProducts, readServices, readTeam, readTexts } from "./schemas";
import { TEXTS } from "./texts";

const table = (csv: string) => toTable(parseCsv(csv));

const SERVICIOS = "id,nombre,descripcion,precio,duracion,incluye,categoria,imagen,activo,orden";

describe("pestaña servicios (BR-039, RF-CNT-002)", () => {
  it("lee una fila válida y formatea el precio en pesos chilenos", () => {
    const { items, issues } = readServices(
      table(`${SERVICIOS}\ncorte-clasico,Corte clásico,"Corte, lavado y peinado",4000,45 min,Cortesía,Corte de Cabello,https://ejemplo.cl/a.jpg,SI,1\n`),
    );

    expect(issues).toEqual([]);
    expect(items).toEqual([
      {
        name: "Corte clásico",
        description: "Corte, lavado y peinado",
        price: "$4.000",
        duration: "45 min",
        includes: "Cortesía",
        category: "Corte de Cabello",
        image: "https://ejemplo.cl/a.jpg",
      },
    ]);
  });

  it("separa los miles de precios grandes", () => {
    const { items } = readServices(table(`${SERVICIOS}\na,A,d,125000,10 min,,Barba,,,\n`));

    expect(items[0].price).toBe("$125.000");
  });

  it("las columnas opcionales (incluye, imagen, activo, orden) pueden faltar o ir vacías", () => {
    const { items, issues } = readServices(table("id,nombre,descripcion,precio,duracion,categoria\na,A,d,1000,10 min,Barba\n"));

    expect(issues).toEqual([]);
    expect(items[0]).toMatchObject({ includes: "", image: "" });
  });

  describe("problemas que el dueño puede cometer", () => {
    const issueOf = (csvRow: string) => readServices(table(`${SERVICIOS}\n${csvRow}\n`)).issues;

    it("precio vacío: indica pestaña, fila y campo", () => {
      expect(issueOf("a,A,d,,10 min,,Barba,,,")).toEqual([{ tab: "servicios", row: 2, field: "precio", message: "es obligatorio" }]);
    });

    it("precio escrito con $ y puntos: explica cómo escribirlo", () => {
      const [issue] = issueOf("a,A,d,$4.000,10 min,,Barba,,,");

      expect(issue).toMatchObject({ field: "precio", row: 2 });
      expect(issue.message).toContain("escribe 15000, sin $ ni puntos");
    });

    it.each(["0", "-5", "1000001", "12,5"])("precio %s no es válido", (price) => {
      expect(issueOf(`a,A,d,"${price}",10 min,,Barba,,,`).some((issue) => issue.field === "precio")).toBe(true);
    });

    it("categoría desconocida: lista las válidas y no acepta «Todos»", () => {
      const [issue] = issueOf("a,A,d,1000,10 min,,Peluquería,,,");

      expect(issue.field).toBe("categoria");
      expect(issue.message).toContain("Corte de Cabello");
      expect(issue.message).not.toContain("Todos");
      expect(issueOf("a,A,d,1000,10 min,,Todos,,,")).toHaveLength(1);
    });

    it("descripción demasiado larga: dice cuántos caracteres tiene y el máximo", () => {
      const [issue] = issueOf(`a,A,${"x".repeat(301)},1000,10 min,,Barba,,,`);

      expect(issue.message).toBe("tiene 301 caracteres y el máximo es 300");
    });

    it("id con mayúsculas o espacios no es válido", () => {
      expect(issueOf("Corte Clasico,A,d,1000,10 min,,Barba,,,")[0].field).toBe("id");
    });

    it("imagen con http:// (sin https) o sin ruta no es válida", () => {
      expect(issueOf("a,A,d,1000,10 min,,Barba,http://x.cl/a.jpg,,")[0].field).toBe("imagen");
      expect(issueOf("a,A,d,1000,10 min,,Barba,foto.jpg,,")[0].field).toBe("imagen");
    });

    it("imagen con ruta del sitio (/img/a.webp) sí es válida", () => {
      expect(issueOf("a,A,d,1000,10 min,,Barba,/img/a.webp,,")).toEqual([]);
    });

    it("id repetido: apunta a la fila donde ya apareció", () => {
      const { issues } = readServices(table(`${SERVICIOS}\na,A,d,1000,10 min,,Barba,,,\na,B,d,2000,10 min,,Barba,,,\n`));

      expect(issues).toEqual([{ tab: "servicios", row: 3, field: "id", message: '"a" está repetido (ya aparece en la fila 2)' }]);
    });

    it("falta una columna obligatoria en el encabezado: un solo problema, en la fila 1, por columna", () => {
      const { items, issues } = readServices(table("id,nombre,descripcion,duracion,categoria\na,A,d,10 min,Barba\n"));

      expect(items).toEqual([]);
      expect(issues).toEqual([{ tab: "servicios", row: 1, field: "precio", message: "falta esta columna en el encabezado" }]);
    });

    it("varios errores en varias filas se informan todos, cada uno con su fila", () => {
      const { issues } = readServices(table(`${SERVICIOS}\na,A,d,,10 min,,Barba,,,\nb,B,d,1000,10 min,,Otra,,,\n`));

      expect(issues.map((issue) => `${issue.row}:${issue.field}`)).toEqual(["2:precio", "3:categoria"]);
    });
  });

  describe("activo y orden", () => {
    it("una fila con activo=NO no se publica y no se valida (el dueño puede dejar borradores)", () => {
      const { items, issues } = readServices(table(`${SERVICIOS}\na,A,d,1000,10 min,,Barba,,SI,\nb,,,,,,,,NO,\n`));

      expect(issues).toEqual([]);
      expect(items.map((item) => item.name)).toEqual(["A"]);
    });

    it.each(["no", "No", "false", "0"])("«%s» también oculta la fila", (value) => {
      expect(readServices(table(`${SERVICIOS}\na,A,d,1000,10 min,,Barba,,${value},\n`)).items).toEqual([]);
    });

    it("un valor de activo que no es SI/NO es un problema, no se adivina", () => {
      expect(readServices(table(`${SERVICIOS}\na,A,d,1000,10 min,,Barba,,quizás,\n`)).issues[0].field).toBe("activo");
    });

    it("ordena por la columna orden; las filas sin orden van después, en el orden de la hoja", () => {
      const { items } = readServices(
        table(`${SERVICIOS}\nc,C,d,1000,10 min,,Barba,,,\na,A,d,1000,10 min,,Barba,,,2\nb,B,d,1000,10 min,,Barba,,,1\nd,D,d,1000,10 min,,Barba,,,\n`),
      );

      expect(items.map((item) => item.name)).toEqual(["B", "A", "C", "D"]);
    });
  });
});

describe("pestaña productos", () => {
  const HEAD = "id,nombre,descripcion,precio,categoria,imagen";

  it("lee productos y acepta solo sus categorías", () => {
    const ok = readProducts(table(`${HEAD}\npomada,Pomada,Hold fuerte,15990,Styling,\n`));
    const bad = readProducts(table(`${HEAD}\npomada,Pomada,Hold fuerte,15990,Barba y más,\n`));

    expect(ok.items).toEqual([{ name: "Pomada", description: "Hold fuerte", price: "$15.990", image: "", category: "Styling" }]);
    expect(bad.issues[0]).toMatchObject({ tab: "productos", field: "categoria" });
  });
});

describe("pestaña equipo", () => {
  const HEAD = "id,nombre,cargo,experiencia,imagen,lider";

  it("lee el equipo; lider SI marca al líder y vacío es NO", () => {
    const { items, issues } = readTeam(table(`${HEAD}\nc,Carlos,Master Barber,15 años,,SI\nm,Miguel,Barber,10 años,,\n`));

    expect(issues).toEqual([]);
    expect(items.map((member) => member.isLead)).toEqual([true, false]);
  });

  it("dos líderes rechazan la pestaña y dicen quiénes son", () => {
    const { issues } = readTeam(table(`${HEAD}\nc,Carlos,Master,15 años,,SI\nm,Miguel,Senior,10 años,,SI\n`));

    expect(issues).toHaveLength(1);
    expect(issues[0].message).toContain("Carlos, Miguel");
  });

  describe("especialidades y descripción (BR-063, HU-INFO-003 CA-07)", () => {
    const FULL = `${HEAD},especialidades,descripcion`;

    it("lee las especialidades separadas por comas, sin espacios sobrantes ni vacías", () => {
      const { items, issues } = readTeam(
        table(`${FULL}\nc,Carlos,Master,15 años,,SI," Fade , Barba,,Diseño ",Corta desde 2010.\n`),
      );

      expect(issues).toEqual([]);
      expect(items[0]).toMatchObject({ specialties: ["Fade", "Barba", "Diseño"], description: "Corta desde 2010." });
    });

    it("sin las columnas nuevas la pestaña sigue siendo válida (CP-CNT-002)", () => {
      const { items, issues } = readTeam(table(`${HEAD}\nc,Carlos,Master,15 años,,SI\n`));

      expect(issues).toEqual([]);
      expect(items[0]).toMatchObject({ specialties: [], description: "" });
    });

    it("más de 6 especialidades rechazan la pestaña con fila y campo", () => {
      const { issues } = readTeam(table(`${FULL}\nc,Carlos,Master,15 años,,,"a,b,c,d,e,f,g",\n`));

      expect(issues[0]).toMatchObject({ tab: "equipo", row: 2, field: "especialidades" });
      expect(issues[0].message).toContain("7");
    });

    it("una especialidad de más de 30 caracteres rechaza la pestaña y la nombra", () => {
      const long = "Degradados de precisión con navaja";
      const { issues } = readTeam(table(`${FULL}\nc,Carlos,Master,15 años,,,"Fade,${long}",\n`));

      expect(issues[0]).toMatchObject({ field: "especialidades" });
      expect(issues[0].message).toContain(long);
    });

    it("lee reserva, instagram, trabajos y frase; vacíos son válidos", () => {
      const HEAD_ALL = `${FULL},reserva,instagram,trabajos,frase`;
      const { items, issues } = readTeam(
        table(
          `${HEAD_ALL}\nc,Carlos,Master,15 años,,SI,,,https://agendapro.com/carlos,https://instagram.com/carlos,"https://images.unsplash.com/a.jpg, /trabajos/b.jpg",El detalle lo es todo.\nm,Miguel,Barber,10 años,,,,,,,,\n`,
        ),
      );

      expect(issues).toEqual([]);
      expect(items[0]).toMatchObject({
        bookingUrl: "https://agendapro.com/carlos",
        instagram: "https://instagram.com/carlos",
        works: ["https://images.unsplash.com/a.jpg", "/trabajos/b.jpg"],
        quote: "El detalle lo es todo.",
      });
      expect(items[1]).toMatchObject({ bookingUrl: "", instagram: "", works: [], quote: "" });
    });

    it("reserva e instagram tienen que empezar con https://", () => {
      const { issues } = readTeam(table(`${HEAD},reserva,instagram\nc,Carlos,Master,15 años,,,agendapro.com/c,@carlos\n`));

      expect(issues.map((issue) => issue.field)).toEqual(["reserva", "instagram"]);
    });

    it("más de 3 trabajos, o uno que no es una dirección de imagen, rechazan la pestaña", () => {
      const four = readTeam(table(`${HEAD},trabajos\nc,Carlos,Master,15 años,,,"/a.jpg,/b.jpg,/c.jpg,/d.jpg"\n`));
      const bad = readTeam(table(`${HEAD},trabajos\nc,Carlos,Master,15 años,,,"foto.jpg"\n`));

      expect(four.issues[0]).toMatchObject({ field: "trabajos" });
      expect(bad.issues[0]).toMatchObject({ field: "trabajos" });
      expect(bad.issues[0].message).toContain("foto.jpg");
    });

    it("una frase de más de 120 caracteres rechaza la pestaña", () => {
      const { issues } = readTeam(table(`${HEAD},frase\nc,Carlos,Master,15 años,,,${"a".repeat(121)}\n`));

      expect(issues[0]).toMatchObject({ field: "frase" });
    });

    it("una descripción de más de 400 caracteres rechaza la pestaña", () => {
      const { issues } = readTeam(table(`${FULL}\nc,Carlos,Master,15 años,,,,${"a".repeat(401)}\n`));

      expect(issues[0]).toMatchObject({ field: "descripcion" });
    });
  });
});

describe("pestaña preguntas", () => {
  const HEAD = "id,categoria,pregunta,respuesta";

  it("lee preguntas con respuestas largas y comas", () => {
    const { items, issues } = readFaq(table(`${HEAD}\nhorario,Reservas y Horarios,¿Cuál es el horario?,"De lunes a viernes, de 10:00 a 20:00."\n`));

    expect(issues).toEqual([]);
    expect(items[0].answer).toBe("De lunes a viernes, de 10:00 a 20:00.");
  });

  it("categoría inexistente es un problema", () => {
    expect(readFaq(table(`${HEAD}\nx,Misceláneos,¿Algo?,Sí\n`)).issues[0].field).toBe("categoria");
  });
});

describe("pestaña textos (BR-042, HU-CNT-002)", () => {
  it("lee pares clave-valor de las claves que usa el sitio", () => {
    const { items, issues, warnings } = readTexts(table("clave,valor\nhero.lema,Barbería Royce\ncta2.titulo,¿Listo para tu corte?\n"));

    expect(issues).toEqual([]);
    expect(warnings).toEqual([]);
    expect(items).toEqual([
      ["hero.lema", "Barbería Royce"],
      ["cta2.titulo", "¿Listo para tu corte?"],
    ]);
  });

  it("CA-02: una clave que el sitio no usa (error de escritura) se ignora con un aviso y NO rechaza la pestaña", () => {
    const { items, issues, warnings } = readTexts(table("clave,valor\nhero.lema,Bien\nhero.titlo,Con error\n"));

    expect(items).toEqual([["hero.lema", "Bien"]]);
    expect(issues).toEqual([]);
    expect(warnings).toEqual([{ tab: "textos", row: 3, field: "clave", message: '"hero.titlo" no es un texto que use el sitio (¿error de escritura?): se ignora' }]);
  });

  it("un valor vacío significa «usar el texto por defecto»: no es un error ni se publica", () => {
    const { items, issues, warnings } = readTexts(table("clave,valor\nhero.lema,\n"));

    expect(items).toEqual([]);
    expect(issues).toEqual([]);
    expect(warnings).toEqual([]);
  });

  it("CA-03: un valor más largo que el máximo de su clave rechaza la pestaña y dice cuál es el máximo", () => {
    const max = TEXTS["hero.lema"].max;
    const { issues } = readTexts(table(`clave,valor\nhero.lema,${"x".repeat(max + 1)}\n`));

    expect(issues).toEqual([{ tab: "textos", row: 2, field: "valor", message: `tiene ${max + 1} caracteres y el máximo para "hero.lema" es ${max}` }]);
  });

  it("los subtítulos admiten más caracteres que los títulos", () => {
    expect(TEXTS["cta1.subtitulo"].max).toBeGreaterThan(TEXTS["cta1.titulo"].max);
    expect(readTexts(table(`clave,valor\ncta1.subtitulo,${"x".repeat(TEXTS["cta1.titulo"].max + 50)}\n`)).issues).toEqual([]);
  });

  it("una clave con formato inválido o repetida rechaza la pestaña, con su fila", () => {
    const { issues } = readTexts(table("clave,valor\nHero Titulo,x\nhero.lema,uno\nhero.lema,dos\n"));

    expect(issues.map((issue) => `${issue.row}:${issue.field}`)).toEqual(["2:clave", "4:clave"]);
  });

  it("la clave debe tener al menos un punto (grupo.nombre)", () => {
    expect(readTexts(table("clave,valor\ntitulo,x\n")).issues[0].field).toBe("clave");
  });

  it("conserva los saltos de línea de la celda (los títulos de dos líneas)", () => {
    const { items } = readTexts(table('clave,valor\nhero.lema,"Línea uno\nLínea dos"\n'));

    expect(items[0][1]).toBe("Línea uno\nLínea dos");
  });
});
