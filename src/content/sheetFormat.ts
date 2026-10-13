import { toCsv } from "./csv";
import { parseClp } from "./format";
import type { SheetCsv } from "./resolveContent";
import type { SiteContent } from "./types";

const yesNo = (value: boolean) => (value ? "SI" : "NO");

/**
 * Convierte contenido en el formato de la hoja: un CSV por pestaña, con los mismos encabezados que espera
 * `resolveContent`. Sirve para (1) comprobar que el respaldo cumple el mismo esquema que la hoja (ida y
 * vuelta sin pérdidas) y (2) generar las plantillas que el dueño importa en Google Sheets.
 * Los `id` se generan por posición (`servicio-1`…): en la hoja real los elige el dueño.
 */
export function contentToSheet(content: SiteContent): SheetCsv {
  return {
    servicios: toCsv([
      ["id", "nombre", "descripcion", "precio", "duracion", "incluye", "categoria", "imagen", "activo", "orden"],
      ...content.services.map((s, i) => [`servicio-${i + 1}`, s.name, s.description, String(parseClp(s.price)), s.duration, s.includes, s.category, s.image, "SI", String(i + 1)]),
    ]),
    productos: toCsv([
      ["id", "nombre", "descripcion", "precio", "categoria", "imagen", "activo", "orden"],
      ...content.products.map((p, i) => [`producto-${i + 1}`, p.name, p.description, String(parseClp(p.price)), p.category, p.image, "SI", String(i + 1)]),
    ]),
    equipo: toCsv([
      ["id", "nombre", "cargo", "experiencia", "imagen", "lider", "activo", "orden"],
      ...content.team.map((m, i) => [`barbero-${i + 1}`, m.name, m.role, m.experience, m.image, yesNo(m.isLead), "SI", String(i + 1)]),
    ]),
    preguntas: toCsv([
      ["id", "categoria", "pregunta", "respuesta", "activo", "orden"],
      ...content.faq.map((q, i) => [`pregunta-${i + 1}`, q.category, q.question, q.answer, "SI", String(i + 1)]),
    ]),
    textos: toCsv([["clave", "valor"], ...Object.entries(content.texts)]),
  };
}
