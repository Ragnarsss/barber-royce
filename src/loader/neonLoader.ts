import { useSyncExternalStore } from "react";

/**
 * Letrero de neón de entrada (BR-054, HU-EXP-004 CA-06 y CA-07).
 *
 * El letrero y su animación viven en línea en `index.html`: así se pinta antes del JavaScript y tapa la pantalla
 * vacía mientras carga (en un celular simulado aparece a los ~0,4 s; el sitio, a los ~0,75 s). El CSS que bloquea
 * el render lo frena igual que al resto, así que no adelanta el primer pintado. La CSP permite estilos en línea
 * pero no scripts: el encendido y el parpadeo son CSS y este módulo solo decide cuándo apagarlo:
 *  - la primera vez de la sesión espera al menos `MIN_MS` desde el inicio de la navegación, para que se lea el
 *    encendido; las siguientes salen en cuanto React monta (`sessionStorage`, decisión del 2026-10-14);
 *  - cualquier interacción lo acorta (incluido `Tab`: nadie queda tabulando contra una capa opaca);
 *  - al salir avisa a los suscriptores (el hero arranca su entrada mientras el letrero se desvanece).
 * Si el JavaScript nunca llega, el CSS lo retira solo a los `MAX_MS`.
 *
 * Los tres tiempos tienen su copia en las variables `--neon-*` de `index.html`; `neonLoaderHtml.test.ts` exige
 * que coincidan.
 */
export const NEON_LOADER = {
  MIN_MS: 1200,
  EXIT_MS: 450,
  MAX_MS: 8000,
  /** Clave de `sessionStorage` que marca que el letrero ya se vio en esta sesión. */
  SEEN_KEY: "neon-loader-seen",
} as const;

const LOADER_ID = "neon-loader";
const SKIP_EVENTS = ["pointerdown", "keydown", "wheel", "touchstart"] as const;

/** Cuánto falta para cumplir el mínimo, si ya pasaron `elapsedMs` desde el inicio de la navegación. */
export function remainingMs(elapsedMs: number, minMs: number = NEON_LOADER.MIN_MS): number {
  return Math.max(0, Math.round(minMs - elapsedMs));
}

/** El almacenamiento de sesión puede lanzar (modo privado, datos bloqueados): en ese caso cuenta como primera carga. */
function hasSeenLoader(): boolean {
  try {
    return sessionStorage.getItem(NEON_LOADER.SEEN_KEY) === "1";
  } catch {
    return false;
  }
}

function markLoaderSeen() {
  try {
    sessionStorage.setItem(NEON_LOADER.SEEN_KEY, "1");
  } catch {
    // sin almacenamiento: el letrero se vuelve a ver completo en la próxima carga
  }
}

const listeners = new Set<() => void>();
let done = typeof document === "undefined" || document.getElementById(LOADER_ID) === null;

function markDone() {
  if (done) return;
  done = true;
  for (const listener of listeners) listener();
}

export function subscribeNeonLoader(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function isNeonLoaderDone(): boolean {
  return done;
}

/**
 * Programa la salida del letrero. Devuelve la limpieza (temporizadores y escuchas), para los tests y el HMR.
 * `elapsedMs` es el tiempo desde el inicio de la navegación (`performance.now()`).
 */
export function dismissNeonLoader(doc: Document = document, elapsedMs: number = performance.now()): () => void {
  const el = doc.getElementById(LOADER_ID);
  if (!el) {
    markDone();
    return () => {};
  }
  done = false;

  let removeTimer: number | undefined;
  const exit = () => {
    window.clearTimeout(exitTimer);
    removeSkipListeners();
    el.dataset.state = "exiting";
    markLoaderSeen();
    markDone();
    removeTimer = window.setTimeout(() => el.remove(), NEON_LOADER.EXIT_MS);
  };

  // El mínimo completo solo vale la primera vez de la sesión; después sale en cuanto React monta.
  const exitTimer = window.setTimeout(exit, hasSeenLoader() ? 0 : remainingMs(elapsedMs));
  for (const type of SKIP_EVENTS) window.addEventListener(type, exit, { once: true, passive: true });
  function removeSkipListeners() {
    for (const type of SKIP_EVENTS) window.removeEventListener(type, exit);
  }

  return () => {
    window.clearTimeout(exitTimer);
    window.clearTimeout(removeTimer);
    removeSkipListeners();
  };
}

/** `true` cuando el letrero ya salió (o nunca hubo): el hero espera esto para empezar su entrada. */
export function useNeonLoaderDone(): boolean {
  return useSyncExternalStore(subscribeNeonLoader, isNeonLoaderDone, () => true);
}
