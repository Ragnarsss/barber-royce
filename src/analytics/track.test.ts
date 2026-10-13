import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/constants";
import { pageTitle, trackEvent, trackPageView, trackPhone, trackReserve, trackWhatsApp, type ClickSection } from "./track";

const ID = "G-TEST123";
const google = window as unknown as { gtag?: unknown; [key: string]: unknown };
const gtag = vi.fn();

/** Google Analytics habilitado tras el consentimiento: `enableGoogleAnalytics` deja `ga-disable-<ID>` en false. */
const enabled = () => (google[`ga-disable-${ID}`] = false);
const revoked = () => (google[`ga-disable-${ID}`] = true);

describe("eventos de conversión (BR-038, CP-MED-004)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", ID);
    gtag.mockClear();
    google.gtag = gtag;
    delete google[`ga-disable-${ID}`];
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete google.gtag;
    delete google[`ga-disable-${ID}`];
  });

  describe("solo se envía con Google habilitado", () => {
    it("RNF-PRIV-001: si nunca se aceptó (Google sin habilitar) no se envía nada, aunque exista gtag", () => {
      trackEvent("reserve_click", { section: "navbar" });

      expect(gtag).not.toHaveBeenCalled();
    });

    it("con Google habilitado envía el evento con su sección", () => {
      enabled();

      trackEvent("reserve_click", { section: "navbar" });

      expect(gtag).toHaveBeenCalledWith("event", "reserve_click", { section: "navbar" });
    });

    it("HU-MED-002 CA-04: tras revocar el consentimiento deja de enviar", () => {
      enabled();
      revoked();

      trackEvent("reserve_click", { section: "navbar" });

      expect(gtag).not.toHaveBeenCalled();
    });

    it("sin ID de medición no envía nada", () => {
      vi.stubEnv("VITE_GA_MEASUREMENT_ID", "");
      enabled();

      trackEvent("reserve_click", { section: "navbar" });

      expect(gtag).not.toHaveBeenCalled();
    });

    it("sin gtag (el script de Google no cargó) no falla", () => {
      enabled();
      delete google.gtag;

      expect(() => trackEvent("reserve_click", { section: "navbar" })).not.toThrow();
    });
  });

  describe("manejadores de clic", () => {
    const sections: ClickSection[] = ["navbar", "navbar-movil", "cta1", "cta2", "footer", "ubicacion", "faq", "404"];

    it.each([
      ["trackReserve", trackReserve, "reserve_click"],
      ["trackWhatsApp", trackWhatsApp, "whatsapp_click"],
      ["trackPhone", trackPhone, "phone_click"],
    ] as const)("%s envía %s con la sección y ningún otro dato (RN-01)", (_name, handler, eventName) => {
      enabled();

      for (const section of sections) handler(section)();

      expect(gtag).toHaveBeenCalledTimes(sections.length);
      for (const [index, section] of sections.entries()) {
        expect(gtag.mock.calls[index]).toEqual(["event", eventName, { section }]);
      }
    });

    it("RN-02: el manejador es síncrono: no retrasa ni bloquea el enlace", () => {
      enabled();

      const result = trackReserve("cta1")();

      expect(result).toBeUndefined();
      expect(gtag).toHaveBeenCalledTimes(1);
    });
  });

  describe("vistas por ruta", () => {
    it("pageTitle usa el título de ROUTES para las rutas conocidas", () => {
      for (const route of Object.values(ROUTES)) {
        expect(pageTitle(route.path)).toBe(route.title);
      }
    });

    it("pageTitle de una ruta inexistente es el de la 404", () => {
      expect(pageTitle("/no-existe")).toBe(`Página no encontrada | ${SITE.name}`);
    });

    it("trackPageView envía ruta, dirección completa y título, sin datos personales", () => {
      enabled();

      trackPageView(ROUTES.services.path);

      expect(gtag).toHaveBeenCalledWith("event", "page_view", {
        page_path: "/servicios",
        page_location: `${window.location.origin}/servicios`,
        page_title: ROUTES.services.title,
      });
    });

    it("sin Google habilitado trackPageView no envía nada", () => {
      trackPageView("/");

      expect(gtag).not.toHaveBeenCalled();
    });
  });
});
