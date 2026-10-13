import { servicesList } from "@/data/servicesData";
import { productsList } from "@/data/productsData";
import { teamMembersList } from "@/data/teamData";
import { FAQ_LIST } from "@/data/faqData";
import type { SiteContent } from "./types";

/**
 * Respaldo del contenido (ADR-008): lo que el sitio publica cuando la hoja no está configurada, no
 * responde o es inválida. Hoy son los datos de `src/data`; `BR-041` los mueve aquí. El build nunca lo
 * modifica: lo actualiza el desarrollador cuando el dueño confirma contenido nuevo.
 */
export const snapshot: SiteContent = {
  services: servicesList,
  products: productsList,
  team: teamMembersList,
  faq: FAQ_LIST,
  texts: {},
};
