import { describe, expect, it } from "vitest";
import { BOOKING, CONTACT, SCHEDULE, SOCIAL_MEDIA, WHATSAPP_DEFAULTS } from "../config/constants";
import {
  BUSINESS_FIELDS,
  buildBusiness,
  buildWhatsAppLink,
  businessToEntries,
  businessValueProblem,
  digitsOf,
  emailProblem,
  isBusinessKey,
  mapUrlProblem,
  phoneProblem,
  telLink,
  urlProblem,
} from "./business";
import { readBusiness, readLocations } from "./schemas";
import { parseCsv, toTable } from "./csv";
import type { Business } from "./types";

const table = (csv: string) => toTable(parseCsv(csv));
const base: Business = { contact: CONTACT, booking: BOOKING, schedule: SCHEDULE, social: SOCIAL_MEDIA };

describe("validadores de datos del negocio (BR-048, HU-CNT-003 CA-03)", () => {
  it.each(["+56 9 1234 5678", "(51) 234-5678", "56912345678", "+56912345678"])("acepta el teléfono «%s»", (value) => {
    expect(phoneProblem(value)).toBeUndefined();
  });

  it.each(["", "hola", "1234", "+56 9 1234 5678 ext 12", "1234567890123456", "tel:+56912345678", "56 9 1234 5678 <script>"])("rechaza el teléfono «%s»", (value) => {
    expect(phoneProblem(value)).toContain("no parece un teléfono");
  });

  it.each(["info@barberroyce.com", "a.b@dominio.cl"])("acepta el correo «%s»", (value) => {
    expect(emailProblem(value)).toBeUndefined();
  });

  it.each(["info", "info@", "info@dominio", "info @dominio.cl", "@dominio.cl"])("rechaza el correo «%s»", (value) => {
    expect(emailProblem(value)).toContain("no parece un correo");
  });

  it("acepta direcciones https y rechaza http, javascript:, rutas y texto suelto", () => {
    expect(urlProblem("https://www.instagram.com/barberia.royce/")).toBeUndefined();
    for (const value of ["http://instagram.com/x", "javascript:alert(1)", "/servicios", "instagram.com/x", "data:text/html,hola"]) {
      expect(urlProblem(value), value).toContain("https://");
    }
  });

  it("el mapa solo puede ser un mapa insertable de Google (lo que permite la política de seguridad)", () => {
    expect(mapUrlProblem("https://www.google.com/maps/embed?pb=!1m18")).toBeUndefined();
    expect(mapUrlProblem("https://maps.google.com/maps?q=a&output=embed")).toBeUndefined();
    expect(mapUrlProblem("https://www.google.com/search?q=barberia")).toContain("Google Maps");
    expect(mapUrlProblem("https://otro-sitio.com/maps/embed")).toContain("Google Maps");
    expect(mapUrlProblem("http://www.google.com/maps/embed")).toContain("https://");
  });

  it("cada clave valida según su tipo y su máximo", () => {
    expect(businessValueProblem("telefono", "+56 9 1234 5678")).toBeUndefined();
    expect(businessValueProblem("telefono", "mañana")).toContain("teléfono");
    expect(businessValueProblem("email", "x")).toContain("correo");
    expect(businessValueProblem("reservas.url", "http://x.cl")).toContain("https://");
    expect(businessValueProblem("horario.semana", "x".repeat(41))).toContain("el máximo para \"horario.semana\" es 40");
  });

  it("isBusinessKey reconoce solo las claves del sitio", () => {
    expect(Object.keys(BUSINESS_FIELDS).every(isBusinessKey)).toBe(true);
    expect(isBusinessKey("toString")).toBe(false);
    expect(isBusinessKey("telefono2")).toBe(false);
  });
});

describe("enlaces armados a partir de lo que escribe el dueño (BR-048)", () => {
  it("digitsOf conserva solo los dígitos", () => {
    expect(digitsOf("+56 9 3109 4222")).toBe("56931094222");
  });

  it("tel: conserva el + solo si el dueño lo escribió", () => {
    expect(telLink("+56 9 3109 4222")).toBe("tel:+56931094222");
    expect(telLink("(123) 456-7890")).toBe("tel:1234567890");
  });

  it("el enlace de WhatsApp lleva el número sin signos y el mensaje codificado", () => {
    const link = buildWhatsAppLink("+56 9 1111 2222", "¡Hola! ¿Hay hora?");

    expect(link).toBe("https://api.whatsapp.com/send/?phone=56911112222&text=%C2%A1Hola%21+%C2%BFHay+hora%3F&type=phone_number&app_absent=0");
  });

  it("con los valores por defecto, el enlace armado es el que ya tiene el sitio", () => {
    expect(buildWhatsAppLink(WHATSAPP_DEFAULTS.number, WHATSAPP_DEFAULTS.message)).toBe(CONTACT.whatsapp.link);
  });
});

describe("buildBusiness: lo de la hoja sobre lo que ya tiene el sitio (BR-048)", () => {
  it("sin nada en la hoja deja los datos como están, sin tocar el original", () => {
    const result = buildBusiness({}, base);

    expect(result).toEqual(base);
    expect(result).not.toBe(base);
  });

  it("un teléfono nuevo cambia lo que se muestra y el enlace", () => {
    const result = buildBusiness({ telefono: "+56 9 5555 4444" }, base);

    expect(result.contact.phone).toEqual({ display: "+56 9 5555 4444", link: "tel:+56955554444" });
    expect(result.contact.email).toEqual(base.contact.email);
  });

  it("solo el número de WhatsApp: usa el mensaje de siempre; solo el mensaje: usa el número de siempre", () => {
    const onlyNumber = buildBusiness({ whatsapp: "+56 9 1111 2222" }, base).contact.whatsapp;
    const onlyMessage = buildBusiness({ "whatsapp.mensaje": "Hola" }, base).contact.whatsapp;

    expect(onlyNumber.display).toBe("+56 9 1111 2222");
    expect(onlyNumber.link).toContain("phone=56911112222");
    expect(onlyNumber.link).toContain("resolver+algunas+dudas");
    expect(onlyMessage.display).toBe(base.contact.whatsapp.display);
    expect(onlyMessage.link).toContain(`phone=${WHATSAPP_DEFAULTS.number}`);
    expect(onlyMessage.link).toContain("text=Hola");
  });

  it("correo, reservas, horarios y redes", () => {
    const result = buildBusiness(
      {
        email: "hola@royce.cl",
        "reservas.url": "https://agenda.example/royce",
        "reservas.etiqueta": "Agenda tu hora",
        "horario.semana": "Lun - Vie: 9:00 - 19:00",
        "instagram.url": "https://www.instagram.com/royce/",
      },
      base,
    );

    expect(result.contact.email).toEqual({ display: "hola@royce.cl", link: "mailto:hola@royce.cl" });
    expect(result.booking).toEqual({ url: "https://agenda.example/royce", label: "Agenda tu hora" });
    expect(result.schedule.weekdays).toBe("Lun - Vie: 9:00 - 19:00");
    expect(result.schedule.saturday).toBe(base.schedule.saturday);
    expect(result.social.instagram).toEqual({ url: "https://www.instagram.com/royce/", label: "Instagram" });
    expect(result.social.facebook).toEqual(base.social.facebook);
  });

  it("businessToEntries y buildBusiness son inversos: la plantilla no cambia el sitio", () => {
    expect(buildBusiness(Object.fromEntries(businessToEntries(base)), base)).toEqual(base);
  });
});

describe("pestaña negocio (BR-048, HU-CNT-003)", () => {
  it("lee los pares válidos, ignora los vacíos y avisa de una clave desconocida sin rechazar la pestaña", () => {
    const { items, issues, warnings } = readBusiness(table("clave,valor\ntelefono,+56 9 1234 5678\nemail,\ntelefon,+56 9 1234 5678\n"));

    expect(issues).toEqual([]);
    expect(items).toEqual([["telefono", "+56 9 1234 5678"]]);
    expect(warnings).toHaveLength(1);
    expect(warnings[0].message).toContain('"telefon" no es un dato que use el sitio');
  });

  it("un teléfono, un correo o un enlace mal escrito rechaza la pestaña y dice qué clave y qué fila", () => {
    const { issues } = readBusiness(table("clave,valor\ntelefono,mañana\nemail,sin-arroba\nreservas.url,http://inseguro.cl\n"));

    expect(issues.map((issue) => `${issue.row}:${issue.field}:${issue.message.split(":")[0]}`)).toEqual(["2:valor:telefono", "3:valor:email", "4:valor:reservas.url"]);
  });

  it("una clave repetida rechaza la pestaña", () => {
    const { issues } = readBusiness(table("clave,valor\ntelefono,+56 9 1234 5678\ntelefono,+56 9 8765 4321\n"));

    expect(issues).toEqual([expect.objectContaining({ row: 3, field: "clave" })]);
  });

  it("falta una columna del encabezado", () => {
    expect(readBusiness(table("clave\ntelefono\n")).issues[0]).toMatchObject({ row: 1, field: "valor" });
  });
});

const SUC_HEAD = "id,nombre,direccion,ciudad,telefono,email,whatsapp,mapa,horario_semana,horario_sabado,horario_domingo,activo,orden";
const MAPA = "https://www.google.com/maps/embed?pb=!1m18";
const fila = (extra: Partial<Record<string, string>> = {}) => {
  const v = {
    id: "la-serena", nombre: "Royce La Serena", direccion: "Larrain Alcalde 3108", ciudad: '"Pampa Baja, La Serena"', telefono: "+56 9 2087 2985",
    email: "centro@royce.cl", whatsapp: "+56 9 2087 2985", mapa: MAPA, horario_semana: "09:00 - 20:00", horario_sabado: "09:00 - 20:00", horario_domingo: "Cerrado",
    activo: "SI", orden: "1", ...extra,
  };
  return Object.values(v).join(",");
};

describe("pestaña sucursales (BR-048, HU-CNT-003)", () => {
  it("lee una sucursal válida y arma los tres horarios", () => {
    const { items, issues } = readLocations(table(`${SUC_HEAD}\n${fila()}\n`));

    expect(issues).toEqual([]);
    expect(items).toEqual([
      {
        name: "Royce La Serena",
        address: "Larrain Alcalde 3108",
        city: "Pampa Baja, La Serena",
        phone: "+56 9 2087 2985",
        email: "centro@royce.cl",
        whatsapp: "+56 9 2087 2985",
        mapUrl: MAPA,
        schedule: [
          { day: "Lunes - Viernes", hours: "09:00 - 20:00" },
          { day: "Sábado", hours: "09:00 - 20:00" },
          { day: "Domingo", hours: "Cerrado" },
        ],
      },
    ]);
  });

  it("un teléfono, un correo o un mapa inválidos rechazan la pestaña con su fila y campo", () => {
    const { issues } = readLocations(table(`${SUC_HEAD}\n${fila({ telefono: "pronto", email: "x", mapa: "https://otro.com/maps/embed" })}\n`));

    expect(issues.map((issue) => `${issue.row}:${issue.field}`)).toEqual(["2:telefono", "2:email", "2:mapa"]);
  });

  it("una sucursal oculta (activo = NO) no se valida ni se publica; el orden manda", () => {
    const csv = `${SUC_HEAD}\n${fila({ id: "a", nombre: "Segunda", orden: "2" })}\n${fila({ id: "b", nombre: "Primera", orden: "1" })}\n${fila({ id: "c", nombre: "Oculta", telefono: "x", activo: "NO" })}\n`;
    const { items, issues } = readLocations(table(csv));

    expect(issues).toEqual([]);
    expect(items.map((item) => item.name)).toEqual(["Primera", "Segunda"]);
  });

  it("faltan columnas del encabezado", () => {
    expect(readLocations(table("id,nombre\nx,y\n")).issues.map((issue) => issue.field)).toContain("mapa");
  });
});
