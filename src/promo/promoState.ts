/**
 * Modal de bienvenida con la mascarilla facial (BR-100, HU-RES-003).
 *
 * Lógica pura: cuándo se muestra y cómo se recuerda que el visitante ya lo vio. No guarda datos personales: solo un
 * indicador de «ya lo cerró». Sigue el patrón del consentimiento: lectura y escritura dentro de `try/catch`, y sin
 * almacenamiento la decisión vive en memoria durante la visita (nunca falla, solo puede volver a salir en otra visita).
 */
export const PROMO_STORAGE_KEY = "barber-royce:promo-dismissed";

/** Espera desde que el letrero y el aviso de privacidad ya no estorban hasta que aparece el modal. */
export const PROMO_DELAY_MS = 5000;

type MinimalStorage = Pick<Storage, "getItem" | "setItem">;

/** `promo.activa` de la hoja: solo «SI» (con o sin tilde, en cualquier mayúscula) la enciende. */
export function isPromoActive(value: string): boolean {
  return /^s[ií]$/i.test(value.trim());
}

export function readPromoDismissed(storage?: MinimalStorage): boolean {
  try {
    return (storage ?? window.localStorage).getItem(PROMO_STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

export function writePromoDismissed(storage?: MinimalStorage): void {
  try {
    (storage ?? window.localStorage).setItem(PROMO_STORAGE_KEY, "1");
  } catch {
    // Degradación a propósito: sin almacenamiento el modal puede volver a salir en otra visita.
  }
}

interface PromoReadiness {
  /** `promo.activa` encendida. */
  active: boolean;
  /** El visitante ya lo cerró en este navegador. */
  dismissed: boolean;
  /** El letrero de neón ya salió. */
  loaderDone: boolean;
  /** El aviso de privacidad está esperando respuesta. */
  consentPending: boolean;
}

/** ¿Se puede empezar a contar la espera? Nunca hay dos capas a la vez ni se tapa la primera impresión. */
export function isPromoReady({ active, dismissed, loaderDone, consentPending }: PromoReadiness): boolean {
  return active && !dismissed && loaderDone && !consentPending;
}
