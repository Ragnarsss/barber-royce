import { beforeEach, describe, expect, it } from "vitest";
import { GTAG_SCRIPT_URL, clearGoogleCookies, disableGoogleAnalytics, enableGoogleAnalytics } from "./googleAnalytics";

const ID = "G-TEST123";

type GoogleWindow = Window & { dataLayer?: ArrayLike<unknown>[]; gtag?: unknown; [key: string]: unknown };
const google = window as unknown as GoogleWindow;

const dataLayer = () => (google.dataLayer ?? []).map((entry) => Array.from(entry));
const scripts = () => document.head.querySelectorAll(`script[src^="${GTAG_SCRIPT_URL}"]`);
const clearCookies = () =>
  document.cookie.split(";").forEach((cookie) => {
    document.cookie = `${cookie.split("=")[0].trim()}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`;
  });

describe("Google Analytics 4 con Consent Mode v2 (BR-037, RF-MED-002)", () => {
  beforeEach(() => {
    document.head.innerHTML = "";
    delete google.dataLayer;
    delete google.gtag;
    delete google[`ga-disable-${ID}`];
    clearCookies();
  });

  it("antes de habilitarlo no hay script, ni dataLayer, ni gtag", () => {
    expect(scripts()).toHaveLength(0);
    expect(google.dataLayer).toBeUndefined();
    expect(google.gtag).toBeUndefined();
  });

  it("habilitar inyecta un único script de Google con el ID, de forma asíncrona", () => {
    enableGoogleAnalytics(ID);

    expect(scripts()).toHaveLength(1);
    const script = scripts()[0] as HTMLScriptElement;
    expect(script.src).toBe(`${GTAG_SCRIPT_URL}?id=${ID}`);
    expect(script.async).toBe(true);
  });

  it("configura primero el consentimiento `denied`, luego lo concede y desactiva el page_view automático", () => {
    enableGoogleAnalytics(ID);

    const [first, second, third, fourth] = dataLayer();
    expect(first.slice(0, 2)).toEqual(["consent", "default"]);
    expect(first[2]).toMatchObject({ analytics_storage: "denied", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    expect(second).toEqual(["consent", "update", { analytics_storage: "granted" }]);
    expect(third[0]).toBe("js");
    expect(fourth).toEqual(["config", ID, { send_page_view: false }]);
  });

  it("habilitar dos veces no duplica el script", () => {
    enableGoogleAnalytics(ID);
    enableGoogleAnalytics(ID);

    expect(scripts()).toHaveLength(1);
  });

  it("deshabilitar apaga el envío, avisa `denied` y borra las cookies de Google, sin tocar las demás", () => {
    enableGoogleAnalytics(ID);
    document.cookie = "_ga=abc; path=/";
    document.cookie = `_ga_${ID}=xyz; path=/`;
    document.cookie = "otra=1; path=/";

    disableGoogleAnalytics(ID);

    expect(google[`ga-disable-${ID}`]).toBe(true);
    expect(dataLayer().at(-1)).toEqual(["consent", "update", { analytics_storage: "denied" }]);
    expect(document.cookie).toBe("otra=1");
  });

  it("volver a conceder después de revocar no descarga el script otra vez, y reactiva el envío", () => {
    enableGoogleAnalytics(ID);
    disableGoogleAnalytics(ID);

    enableGoogleAnalytics(ID);

    expect(scripts()).toHaveLength(1);
    expect(google[`ga-disable-${ID}`]).toBe(false);
    expect(dataLayer().at(-1)).toEqual(["consent", "update", { analytics_storage: "granted" }]);
  });

  it("deshabilitar sin haber habilitado nunca no falla ni crea gtag (primera visita sin decidir)", () => {
    expect(() => disableGoogleAnalytics(ID)).not.toThrow();
    expect(google.gtag).toBeUndefined();
  });

  it("clearGoogleCookies solo borra cookies de Google Analytics", () => {
    document.cookie = "_ga=1; path=/";
    document.cookie = "_gid=2; path=/";
    document.cookie = "sesion=3; path=/";

    clearGoogleCookies();

    expect(document.cookie).toBe("sesion=3");
  });
});
