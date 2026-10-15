import { businessToEntries } from "./business";
import { toCsv } from "./csv";
import { parseClp } from "./format";
import type { SheetCsv } from "./resolveContent";
import type { SiteContent } from "./types";

const yesNo = (value: boolean) => (value ? "SI" : "NO");

/** `Corte + Barba ¡Premium!` → `corte-barba-premium`: un id legible para la hoja, único dentro de la pestaña. */
export function slugify(text: string): string {
  return (
    text
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60)
      .replace(/-+$/, "") || "fila"
  );
}

/** Ids a partir de los textos de cada fila, con sufijo `-2`, `-3`… si se repiten. */
function uniqueIds(labels: string[]): string[] {
  const used = new Map<string, number>();
  return labels.map((label) => {
    const base = slugify(label);
    const count = (used.get(base) ?? 0) + 1;
    used.set(base, count);
    return count === 1 ? base : `${base}-${count}`;
  });
}

/**
 * Convierte contenido en el formato de la hoja: un CSV por pestaña, con los mismos encabezados que espera
 * `resolveContent`. Sirve para (1) comprobar que el respaldo cumple el mismo esquema que la hoja (ida y
 * vuelta sin pérdidas) y (2) generar las plantillas que el dueño importa en Google Sheets.
 * Los `id` salen del nombre de cada fila (`corte-de-cabello`): en la hoja real los elige el dueño.
 */
export function contentToSheet(content: SiteContent): SheetCsv {
  const serviceIds = uniqueIds(content.services.map((s) => s.name));
  const productIds = uniqueIds(content.products.map((p) => p.name));
  const teamIds = uniqueIds(content.team.map((m) => m.name));
  const faqIds = uniqueIds(content.faq.map((q) => q.question));
  const locationIds = uniqueIds(content.locations.map((l) => l.name));

  return {
    servicios: toCsv([
      ["id", "nombre", "descripcion", "precio", "duracion", "incluye", "categoria", "imagen", "activo", "orden"],
      ...content.services.map((s, i) => [serviceIds[i], s.name, s.description, String(parseClp(s.price)), s.duration, s.includes, s.category, s.image, "SI", String(i + 1)]),
    ]),
    productos: toCsv([
      ["id", "nombre", "descripcion", "precio", "categoria", "imagen", "activo", "orden"],
      ...content.products.map((p, i) => [productIds[i], p.name, p.description, String(parseClp(p.price)), p.category, p.image, "SI", String(i + 1)]),
    ]),
    equipo: toCsv([
      ["id", "nombre", "cargo", "experiencia", "imagen", "lider", "activo", "orden", "especialidades", "descripcion"],
      ...content.team.map((m, i) => [
        teamIds[i],
        m.name,
        m.role,
        m.experience,
        m.image,
        yesNo(m.isLead),
        "SI",
        String(i + 1),
        m.specialties.join(", "),
        m.description,
      ]),
    ]),
    preguntas: toCsv([
      ["id", "categoria", "pregunta", "respuesta", "activo", "orden"],
      ...content.faq.map((q, i) => [faqIds[i], q.category, q.question, q.answer, "SI", String(i + 1)]),
    ]),
    textos: toCsv([["clave", "valor"], ...Object.entries(content.texts)]),
    negocio: toCsv([["clave", "valor"], ...businessToEntries(content.business)]),
    sucursales: toCsv([
      ["id", "nombre", "direccion", "ciudad", "telefono", "email", "whatsapp", "mapa", "horario_semana", "horario_sabado", "horario_domingo", "activo", "orden"],
      ...content.locations.map((l, i) => [
        locationIds[i], l.name, l.address, l.city, l.phone, l.email, l.whatsapp, l.mapUrl,
        l.schedule[0]?.hours ?? "", l.schedule[1]?.hours ?? "", l.schedule[2]?.hours ?? "", "SI", String(i + 1),
      ]),
    ]),
  };
}
