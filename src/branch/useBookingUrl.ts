import { BRANCH_LOCATION_ID } from "@/config/branches";
import { useSiteContent } from "@/content/useSiteContent";
import { useBranch } from "./useBranch";

/**
 * El enlace de AgendaPro de la sucursal activa (RF-RES-008). Sale de la fila de esa sucursal; si no tiene enlace propio,
 * el general de la pestaña `negocio`. Todo botón de reserva lo usa en vez de `business.booking.url` (ADR-010).
 */
export function useBookingUrl(): string {
  const { branch } = useBranch();
  const { locations, business } = useSiteContent();
  return locations.find((location) => location.id === BRANCH_LOCATION_ID[branch])?.bookingUrl ?? business.booking.url;
}
