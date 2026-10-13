/**
 * Cargador de Google Analytics 4 con Consent Mode v2 (BR-037, RF-MED-002, RNF-PRIV-001).
 *
 * Reglas:
 * - Nada de Google se pide hasta que el visitante acepta: este módulo solo se ejecuta
 *   con consentimiento y el script `gtag.js` se inyecta recién en `enableGoogleAnalytics`.
 * - El script se agrega con el DOM, sin código inline: la CSP no necesita `unsafe-inline`.
 * - El `page_view` automático está apagado: la app es una SPA y lo envía `BR-038` por ruta.
 * - Si el visitante revoca, se avisa a Google (`denied`), se apaga el envío y se borran las cookies.
 */

type GtagArgs = unknown[];

export interface GoogleWindow {
  dataLayer?: GtagArgs[];
  gtag?: (...args: GtagArgs) => void;
  [key: `ga-disable-${string}`]: boolean | undefined;
}

export const GTAG_SCRIPT_URL = "https://www.googletagmanager.com/gtag/js";

const DENIED = { ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied", analytics_storage: "denied" } as const;

function ensureGtag(win: GoogleWindow): (...args: GtagArgs) => void {
  win.dataLayer = win.dataLayer ?? [];
  // gtag.js espera objetos `arguments` en el dataLayer, no arreglos: no se puede usar rest/spread aquí.
  win.gtag ??= function gtag() {
    // eslint-disable-next-line prefer-rest-params
    (win.dataLayer as unknown[]).push(arguments);
  };
  return win.gtag;
}

export function enableGoogleAnalytics(measurementId: string, win: Window = window, doc: Document = document): void {
  const google = win as unknown as GoogleWindow;
  google[`ga-disable-${measurementId}`] = false;
  const gtag = ensureGtag(google);

  if (doc.querySelector(`script[src^="${GTAG_SCRIPT_URL}"]`)) {
    // Ya cargado antes de una revocación: solo se vuelve a conceder.
    gtag("consent", "update", { analytics_storage: "granted" });
    return;
  }

  gtag("consent", "default", DENIED);
  gtag("consent", "update", { analytics_storage: "granted" });
  gtag("js", new Date());
  gtag("config", measurementId, { send_page_view: false });

  const script = doc.createElement("script");
  script.async = true;
  script.src = `${GTAG_SCRIPT_URL}?id=${encodeURIComponent(measurementId)}`;
  doc.head.appendChild(script);
}

export function disableGoogleAnalytics(measurementId: string, win: Window = window, doc: Document = document): void {
  const google = win as unknown as GoogleWindow;
  google[`ga-disable-${measurementId}`] = true;
  google.gtag?.("consent", "update", { analytics_storage: "denied" });
  clearGoogleCookies(doc, win.location.hostname);
}

const isGoogleCookie = (name: string) => name === "_ga" || name.startsWith("_ga_") || name === "_gid" || name.startsWith("_gat");

/** Borra las cookies de Google Analytics del sitio, probando el dominio exacto y sus padres. */
export function clearGoogleCookies(doc: Document = document, hostname: string = window.location.hostname): void {
  const names = doc.cookie
    .split(";")
    .map((cookie) => cookie.split("=")[0].trim())
    .filter(isGoogleCookie);
  const parts = hostname.split(".");
  const domains = [undefined, hostname, ...parts.slice(0, -1).map((_, index) => `.${parts.slice(index).join(".")}`)];

  for (const name of names) {
    for (const domain of domains) {
      doc.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/${domain ? `; domain=${domain}` : ""}`;
    }
  }
}
