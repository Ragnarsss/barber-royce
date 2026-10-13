// Rutas relativas a propósito: `vite-plugins/` importa este archivo desde el contexto de `vite.config.ts`,
// que no conoce el alias `@/` (ADR-008).
import type { FAQ } from "../types/faq.types";
import type { Product } from "../types/product.types";
import type { Location } from "../types/location.types";
import type { Service } from "../types/service.types";
import type { TeamMember } from "../types/team.types";

/** Pestañas de la hoja de cálculo, en el orden en que se procesan. */
export const CONTENT_TABS = ["servicios", "productos", "equipo", "preguntas", "textos", "negocio", "sucursales"] as const;
export type ContentTab = (typeof CONTENT_TABS)[number];

/** Un dato de contacto: lo que se muestra y a dónde lleva (`tel:`, `mailto:`, WhatsApp). */
export interface ContactLink {
  display: string;
  link: string;
}

export interface SocialLink {
  url: string;
  label: string;
}

/** Datos del negocio editables desde la hoja (BR-048, HU-CNT-003). Los valores de origen están en `src/config/constants.ts`. */
export interface Business {
  contact: { phone: ContactLink; whatsapp: ContactLink; email: ContactLink };
  booking: { url: string; label: string };
  schedule: { weekdays: string; saturday: string; sunday: string; display: string };
  social: { instagram: SocialLink; facebook: SocialLink; tiktok: SocialLink };
}

/** Contenido editable del sitio (HU-CNT-001, HU-CNT-002, HU-CNT-003). Las listas usan los mismos tipos que ya consumen las páginas. */
export interface SiteContent {
  services: Service[];
  products: Product[];
  team: TeamMember[];
  faq: FAQ[];
  /** Textos sueltos por clave (`hero.titulo`). */
  texts: Record<string, string>;
  /** Contacto, reservas, horarios y redes (pestaña `negocio`). */
  business: Business;
  /** Sucursales de la página de ubicación (pestaña `sucursales`). */
  locations: Location[];
}

/** Qué clave de `SiteContent` llena cada pestaña. */
export const TAB_TO_KEY = {
  servicios: "services",
  productos: "products",
  equipo: "team",
  preguntas: "faq",
  textos: "texts",
  negocio: "business",
  sucursales: "locations",
} as const satisfies Record<ContentTab, keyof SiteContent>;

/** Un problema encontrado en una pestaña. `row` es el número de fila en la hoja (la 1 es el encabezado). */
export interface ContentIssue {
  tab: ContentTab;
  row: number;
  field: string;
  message: string;
}

/** Qué pasó con una pestaña: de dónde salió su contenido y por qué. */
export interface TabReport {
  tab: ContentTab;
  source: "hoja" | "respaldo";
  /** Filas aceptadas cuando `source` es `hoja`. */
  count?: number;
  /** Por qué se usó el respaldo (cuando `source` es `respaldo`). */
  reason?: string;
  issues: ContentIssue[];
  /** Avisos que no impiden usar la hoja (por ejemplo, una clave de texto que el sitio no conoce). */
  warnings: ContentIssue[];
}
