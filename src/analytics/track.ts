import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/constants";
import type { GoogleWindow } from "./googleAnalytics";

/**
 * Eventos de conversión y vistas por ruta (BR-038, HU-MED-002).
 *
 * Reglas:
 * - Sin ID de medición, esta función no hace nada y el build elimina el resto (RNF-PRIV-001).
 * - Solo se envía algo si Google Analytics está activo: `enableGoogleAnalytics` pone
 *   `ga-disable-<ID>` en `false` tras el consentimiento, y `disableGoogleAnalytics` lo pone en `true`.
 *   Mientras sea `undefined` (nunca se aceptó), no hay evento.
 * - Los parámetros son solo la sección del sitio: nunca teléfono, nombre ni texto del visitante (RN-01).
 * - `gtag` encola en `dataLayer` de forma síncrona: el clic no se retrasa (RN-02).
 */
export type AnalyticsEventName = "page_view" | "reserve_click" | "whatsapp_click" | "phone_click";

/** Parte del sitio donde estaba el botón. */
export type ClickSection = "navbar" | "navbar-movil" | "cta1" | "cta2" | "footer" | "ubicacion" | "faq" | "404";

export function trackEvent(name: AnalyticsEventName, params: Record<string, string> = {}): void {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) return;

  const google = window as unknown as GoogleWindow;
  if (google[`ga-disable-${measurementId}`] !== false) return;

  google.gtag?.("event", name, params);
}

// Manejadores de `onClick`, listos para usar: `onClick={trackReserve("navbar")}`.
export const trackReserve = (section: ClickSection) => () => trackEvent("reserve_click", { section });
export const trackWhatsApp = (section: ClickSection) => () => trackEvent("whatsapp_click", { section });
export const trackPhone = (section: ClickSection) => () => trackEvent("phone_click", { section });

/** Título de la página según `ROUTES`, para no depender de que Helmet ya haya actualizado `document.title`. */
export const pageTitle = (pathname: string): string =>
  Object.values(ROUTES).find((route) => route.path === pathname)?.title ?? `Página no encontrada | ${SITE.name}`;

/** La app es una SPA: GA4 no detecta los cambios de ruta, así que se envía un `page_view` por cada una. */
export function trackPageView(pathname: string): void {
  trackEvent("page_view", {
    page_path: pathname,
    page_location: `${window.location.origin}${pathname}`,
    page_title: pageTitle(pathname),
  });
}
