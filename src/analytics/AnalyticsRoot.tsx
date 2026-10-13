import { useEffect } from "react";
import { ConsentBanner } from "./ConsentBanner";
import { setConsent, useConsent } from "./consent";
import { disableGoogleAnalytics, enableGoogleAnalytics } from "./googleAnalytics";
import { runAfterLoad } from "./runAfterLoad";

/**
 * Orquesta el consentimiento y Google Analytics (BR-037). Solo existe si hay un ID de medición:
 * `Layout` lo carga con `lazy()` bajo esa condición, así que sin ID ni este código ni el de Google
 * llegan al sitio (RNF-PRIV-001).
 *
 * - `unset`/`denied`: se apaga el envío y se borran las cookies; con `unset` además se muestra el aviso.
 * - `granted`: se carga Google después del evento `load` (RNF-PERF-007).
 */
export function AnalyticsRoot({ measurementId }: { measurementId: string }) {
  const consent = useConsent();

  useEffect(() => {
    if (consent !== "granted") {
      disableGoogleAnalytics(measurementId);
      return;
    }
    return runAfterLoad(() => enableGoogleAnalytics(measurementId));
  }, [consent, measurementId]);

  if (consent !== "unset") return null;

  return <ConsentBanner onAccept={() => setConsent("granted")} onReject={() => setConsent("denied")} />;
}
