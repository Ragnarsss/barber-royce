import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { ConsentBanner } from "./ConsentBanner";
import { setConsent, useConsent } from "./consent";
import { disableGoogleAnalytics, enableGoogleAnalytics } from "./googleAnalytics";
import { runAfterLoad } from "./runAfterLoad";
import { trackPageView } from "./track";

/**
 * Orquesta el consentimiento y Google Analytics (BR-037). Solo existe si hay un ID de medición:
 * `Layout` lo carga con `lazy()` bajo esa condición, así que sin ID ni este código ni el de Google
 * llegan al sitio (RNF-PRIV-001).
 *
 * - `unset`/`denied`: se apaga el envío y se borran las cookies; con `unset` además se muestra el aviso.
 * - `granted`: se carga Google después del evento `load` (RNF-PERF-007) y se envía un `page_view`
 *   por cada ruta (la app es una SPA; BR-038).
 */
export function AnalyticsRoot({ measurementId }: { measurementId: string }) {
  const consent = useConsent();
  const { pathname } = useLocation();

  useEffect(() => {
    if (consent !== "granted") {
      disableGoogleAnalytics(measurementId);
      return;
    }
    return runAfterLoad(() => enableGoogleAnalytics(measurementId));
  }, [consent, measurementId]);

  // Se declara después del efecto de arriba: en cada ruta, y al aceptar, Google ya está habilitado.
  useEffect(() => {
    if (consent !== "granted") return;
    return runAfterLoad(() => trackPageView(pathname));
  }, [consent, pathname]);

  if (consent !== "unset") return null;

  return <ConsentBanner onAccept={() => setConsent("granted")} onReject={() => setConsent("denied")} />;
}
