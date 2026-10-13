import { BOOKING, CONTACT, SCHEDULE, SOCIAL_MEDIA } from "../../config/constants";
import type { Business } from "../types";

/** Datos del negocio con los que se construye el sitio si la hoja no los define (BR-048). Viven en `src/config/constants.ts`. */
export const business: Business = {
  contact: CONTACT,
  booking: BOOKING,
  schedule: SCHEDULE,
  social: SOCIAL_MEDIA,
};
