// Rutas relativas a propósito: `vite-plugins/` carga este archivo desde un contexto que no conoce el alias `@/`.
import { WHATSAPP_DEFAULTS } from "../config/constants";
import type { Business } from "./types";

/**
 * Datos del negocio editables desde la hoja (BR-048, HU-CNT-003): contacto, reservas, horarios y redes.
 * La pestaña `negocio` es de pares clave → valor, como `textos`. El dueño escribe lo que ve una persona
 * (un teléfono, una dirección de internet) y de ahí salen los enlaces: no tiene que armar `tel:` ni `wa.me`.
 */
type FieldKind = "phone" | "email" | "url" | "text";

interface FieldSpec {
  kind: FieldKind;
  /** Largo máximo del valor. */
  max: number;
  /** Para la guía y los mensajes: qué es. */
  label: string;
}

export const BUSINESS_FIELDS = {
  telefono: { kind: "phone", max: 30, label: "Teléfono de contacto" },
  whatsapp: { kind: "phone", max: 30, label: "Número de WhatsApp" },
  "whatsapp.mensaje": { kind: "text", max: 200, label: "Mensaje con que empieza el chat de WhatsApp" },
  email: { kind: "email", max: 80, label: "Correo de contacto" },
  "reservas.url": { kind: "url", max: 500, label: "Enlace de reservas (AgendaPro)" },
  "reservas.etiqueta": { kind: "text", max: 30, label: "Texto del botón de reservar" },
  "horario.semana": { kind: "text", max: 40, label: "Horario de lunes a viernes" },
  "horario.sabado": { kind: "text", max: 40, label: "Horario del sábado" },
  "horario.domingo": { kind: "text", max: 40, label: "Horario del domingo" },
  "horario.resumen": { kind: "text", max: 40, label: "Horario resumido del pie de página" },
  "instagram.url": { kind: "url", max: 300, label: "Instagram" },
  "facebook.url": { kind: "url", max: 300, label: "Facebook" },
  "tiktok.url": { kind: "url", max: 300, label: "TikTok" },
} as const satisfies Record<string, FieldSpec>;

export type BusinessKey = keyof typeof BUSINESS_FIELDS;

export function isBusinessKey(key: string): key is BusinessKey {
  return Object.prototype.hasOwnProperty.call(BUSINESS_FIELDS, key);
}

/** Solo los dígitos de un texto (`+56 9 3109 4222` → `56931094222`). */
export const digitsOf = (text: string): string => text.replace(/\D/g, "");

const PHONE_CHARS = /^[0-9+()\-.\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Un teléfono tal como lo escribe una persona. Devuelve el motivo si no sirve, o `undefined` si está bien. */
export function phoneProblem(value: string): string | undefined {
  const digits = digitsOf(value);
  if (!PHONE_CHARS.test(value) || digits.length < 8 || digits.length > 15) {
    return `"${value}" no parece un teléfono (escríbelo como +56 9 1234 5678: de 8 a 15 dígitos)`;
  }
  return undefined;
}

export function emailProblem(value: string): string | undefined {
  return EMAIL.test(value) ? undefined : `"${value}" no parece un correo (por ejemplo: contacto@tudominio.cl)`;
}

function parseHttps(value: string): URL | undefined {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url : undefined;
  } catch {
    return undefined;
  }
}

export function urlProblem(value: string): string | undefined {
  return parseHttps(value) ? undefined : `"${value}" debe ser una dirección completa que empiece con https://`;
}

/** El mapa se muestra en un marco: solo Google Maps, que es lo que la política de seguridad del sitio permite. */
export function mapUrlProblem(value: string): string | undefined {
  const url = parseHttps(value);
  if (!url) return `"${value.slice(0, 40)}…" debe empezar con https://`;
  const isGoogle = url.hostname === "www.google.com" || url.hostname === "maps.google.com";
  if (!isGoogle || !url.pathname.startsWith("/maps")) {
    return "debe ser la dirección de «Insertar un mapa» de Google Maps (https://www.google.com/maps/embed?…)";
  }
  return undefined;
}

/** Valida el valor de una clave de la pestaña `negocio` según su tipo. */
export function businessValueProblem(key: BusinessKey, value: string): string | undefined {
  const { kind, max } = BUSINESS_FIELDS[key];
  if (value.length > max) return `tiene ${value.length} caracteres y el máximo para "${key}" es ${max}`;
  if (kind === "phone") return phoneProblem(value);
  if (kind === "email") return emailProblem(value);
  if (kind === "url") return urlProblem(value);
  return undefined;
}

export const telLink = (display: string): string => `tel:${display.trim().startsWith("+") ? "+" : ""}${digitsOf(display)}`;

export const buildWhatsAppLink = (number: string, message: string): string =>
  `https://api.whatsapp.com/send/?phone=${digitsOf(number)}&text=${encodeURIComponent(message).replace(/%20/g, "+").replace(/!/g, "%21")}&type=phone_number&app_absent=0`;

/**
 * Aplica sobre los datos base (los del build o los del código) lo que el dueño definió en la hoja. Una clave
 * que falta o está vacía deja el dato base. Los valores ya vienen validados por `businessValueProblem`.
 */
export function buildBusiness(entries: Record<string, string>, base: Business): Business {
  const business = structuredClone(base);
  const get = (key: BusinessKey): string | undefined => (entries[key] ? entries[key] : undefined);

  const phone = get("telefono");
  if (phone) business.contact.phone = { display: phone, link: telLink(phone) };

  const whatsapp = get("whatsapp");
  const message = get("whatsapp.mensaje");
  if (whatsapp || message) {
    business.contact.whatsapp = {
      display: whatsapp ?? business.contact.whatsapp.display,
      link: buildWhatsAppLink(whatsapp ?? WHATSAPP_DEFAULTS.number, message ?? WHATSAPP_DEFAULTS.message),
    };
  }

  const email = get("email");
  if (email) business.contact.email = { display: email, link: `mailto:${email}` };

  business.booking.url = get("reservas.url") ?? business.booking.url;
  business.booking.label = get("reservas.etiqueta") ?? business.booking.label;

  business.schedule.weekdays = get("horario.semana") ?? business.schedule.weekdays;
  business.schedule.saturday = get("horario.sabado") ?? business.schedule.saturday;
  business.schedule.sunday = get("horario.domingo") ?? business.schedule.sunday;
  business.schedule.display = get("horario.resumen") ?? business.schedule.display;

  business.social.instagram.url = get("instagram.url") ?? business.social.instagram.url;
  business.social.facebook.url = get("facebook.url") ?? business.social.facebook.url;
  business.social.tiktok.url = get("tiktok.url") ?? business.social.tiktok.url;
  return business;
}

/** Los datos vigentes en el formato de la hoja (pares clave → valor): para las plantillas y las pruebas. */
export function businessToEntries(business: Business): [BusinessKey, string][] {
  return [
    ["telefono", business.contact.phone.display],
    ["whatsapp", business.contact.whatsapp.display],
    ["whatsapp.mensaje", WHATSAPP_DEFAULTS.message],
    ["email", business.contact.email.display],
    ["reservas.url", business.booking.url],
    ["reservas.etiqueta", business.booking.label],
    ["horario.semana", business.schedule.weekdays],
    ["horario.sabado", business.schedule.saturday],
    ["horario.domingo", business.schedule.sunday],
    ["horario.resumen", business.schedule.display],
    ["instagram.url", business.social.instagram.url],
    ["facebook.url", business.social.facebook.url],
    ["tiktok.url", business.social.tiktok.url],
  ];
}
