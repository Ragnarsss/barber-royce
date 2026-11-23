import { useConsent } from "@/analytics/consent";

/** ¿El aviso de privacidad está esperando respuesta? Solo existe con un ID de medición (BR-037). */
const useConsentUnset = (): boolean => useConsent() === "unset";

/**
 * Con la variable ausente la condición es constante en el build: el código del consentimiento no llega al sitio
 * (RNF-PRIV-001, `analytics.build.test.ts`), igual que en `Layout` con `AnalyticsRoot`.
 */
export const useConsentPending: () => boolean = import.meta.env.VITE_GA_MEASUREMENT_ID ? useConsentUnset : () => false;
