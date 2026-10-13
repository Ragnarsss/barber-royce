import { servicesList } from "./snapshot/services";
import { productsList } from "./snapshot/products";
import { teamMembersList } from "./snapshot/team";
import { FAQ_LIST } from "./snapshot/faq";
import { business } from "./snapshot/business";
import { locations } from "./snapshot/locations";
import type { SiteContent } from "./types";

/**
 * Respaldo del contenido (ADR-008, RF-CNT-003): lo que el sitio publica cuando la hoja no está configurada,
 * no responde o es inválida. Los cuatro catálogos viven en `./snapshot/` (antes `src/data/`); este archivo
 * los reúne. El build nunca lo modifica: lo actualiza el desarrollador cuando el dueño confirma contenido
 * nuevo (se copia el contenido vigente de la hoja a `./snapshot/*.ts`).
 */
export const snapshot: SiteContent = {
  services: servicesList,
  products: productsList,
  team: teamMembersList,
  faq: FAQ_LIST,
  texts: {},
  business,
  locations,
};
