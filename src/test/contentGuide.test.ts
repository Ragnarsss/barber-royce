import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BUSINESS_FIELDS, type BusinessKey } from "../content/business";
import { TEXTS, type TextKey } from "../content/texts";
import { FAQ_CATEGORIES } from "../types/faq.types";
import { PRODUCT_CATEGORIES } from "../types/product.types";
import { SERVICE_CATEGORIES } from "../types/service.types";

// BR-043: la guía del dueño (docs/contenido-hoja.md) es lo que él sigue paso a paso. Si el código cambia (una clave de
// texto nueva, una categoría) y la guía no, el dueño escribe algo que el sitio rechaza. Estos tests lo detectan.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const guide = readFileSync(resolve(root, "docs/contenido-hoja.md"), "utf8");

describe("la guía del dueño está al día con el código (BR-043)", () => {
  it.each(Object.keys(TEXTS) as TextKey[])("la clave de texto %s aparece en la guía", (key) => {
    expect(guide).toContain(`\`${key}\``);
  });

  it.each(Object.keys(BUSINESS_FIELDS) as BusinessKey[])("el dato de negocio %s aparece en la guía (BR-048)", (key) => {
    expect(guide).toContain(`\`${key}\``);
  });

  it("las columnas de la pestaña sucursales aparecen en la guía (BR-048)", () => {
    for (const column of ["id", "nombre", "direccion", "ciudad", "telefono", "email", "whatsapp", "mapa", "horario_semana", "horario_sabado", "horario_domingo"]) {
      expect(guide, column).toContain(`\`${column}\``);
    }
  });

  it("cada categoría permitida aparece en la guía, escrita igual", () => {
    for (const category of [...SERVICE_CATEGORIES, ...PRODUCT_CATEGORIES, ...FAQ_CATEGORIES].filter((c) => c !== "Todos")) {
      expect(guide, category).toContain(`\`${category}\``);
    }
  });

  it("«Todos» no se ofrece como categoría: es solo el filtro de las páginas", () => {
    expect(guide).not.toContain("`Todos`");
  });

  it("nombra las siete pestañas, las dos variables de build y las plantillas", () => {
    for (const part of ["`servicios`", "`productos`", "`equipo`", "`preguntas`", "`textos`", "`negocio`", "`sucursales`", "CONTENT_SHEET_ID", "CONTENT_SHEET_GIDS", "docs/contenido"]) {
      expect(guide, part).toContain(part);
    }
  });

  it("no incluye ninguna dirección de despliegue ni identificador real: son ejemplos", () => {
    expect(guide).not.toMatch(/api\.vercel\.com\/v1\/integrations\/deploy\/[a-zA-Z0-9_]+\/[a-zA-Z0-9]+/);
  });
});
