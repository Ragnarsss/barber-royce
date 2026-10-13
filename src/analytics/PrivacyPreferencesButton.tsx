import { requestConsentPrompt } from "./consent";

/**
 * "Preferencias de privacidad" (BR-037, RF-MED-005): reabre el aviso para cambiar la elección.
 * El footer solo lo muestra si la analítica está configurada.
 */
export function PrivacyPreferencesButton({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={requestConsentPrompt}>
      Preferencias de privacidad
    </button>
  );
}
