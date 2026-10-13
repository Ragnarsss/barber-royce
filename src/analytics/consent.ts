import { useSyncExternalStore } from "react";

/**
 * Consentimiento de analítica (BR-037, HU-MED-003).
 *
 * - `unset`: el visitante aún no decidió → se trata como "no medir".
 * - `granted` / `denied`: elección explícita, guardada en el navegador.
 *
 * Es un store mínimo (sin librerías, ADR-004) para que cualquier componente lo lea con
 * `useConsent` y el cargador de Google reaccione al cambio. Si `localStorage` está
 * bloqueado (modo privado estricto) la elección vive solo en memoria y el aviso vuelve
 * a aparecer en la siguiente visita: nunca se asume un "sí".
 */
export type Consent = "unset" | "granted" | "denied";

export const CONSENT_STORAGE_KEY = "barber-royce:analytics-consent";

type MinimalStorage = Pick<Storage, "getItem" | "setItem" | "removeItem">;

const parse = (value: string | null): Consent => (value === "granted" || value === "denied" ? value : "unset");

export function readConsent(storage?: MinimalStorage): Consent {
  try {
    return parse((storage ?? window.localStorage).getItem(CONSENT_STORAGE_KEY));
  } catch {
    // Degradación a propósito: sin storage no hay elección guardada.
    return "unset";
  }
}

export function writeConsent(value: Consent, storage?: MinimalStorage): void {
  try {
    const target = storage ?? window.localStorage;
    if (value === "unset") target.removeItem(CONSENT_STORAGE_KEY);
    else target.setItem(CONSENT_STORAGE_KEY, value);
  } catch {
    // Degradación a propósito: la elección queda solo en memoria (ver `current`).
  }
}

let current: Consent | undefined;
const listeners = new Set<() => void>();

export function getConsent(): Consent {
  current ??= readConsent();
  return current;
}

export function setConsent(value: Consent): void {
  current = value;
  writeConsent(value);
  listeners.forEach((listener) => listener());
}

export function subscribeConsent(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

let focusRequested = false;

/** Reabre el aviso desde "Preferencias de privacidad": vuelve a "sin decidir" y pide mover el foco al aviso. */
export function requestConsentPrompt(): void {
  focusRequested = true;
  setConsent("unset");
}

/** El aviso lo llama al montarse: devuelve true una sola vez si el visitante lo reabrió a propósito. */
export function consumeFocusRequest(): boolean {
  const requested = focusRequested;
  focusRequested = false;
  return requested;
}

/** Solo para tests: vuelve a leer el estado desde el almacenamiento. */
export function resetConsentCache(): void {
  current = undefined;
}

export const useConsent = (): Consent => useSyncExternalStore(subscribeConsent, getConsent, () => "unset");
