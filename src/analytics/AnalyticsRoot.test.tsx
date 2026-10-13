import { beforeEach, describe, expect, it } from "vitest";
import { act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/test/renderWithProviders";
import { AnalyticsRoot } from "./AnalyticsRoot";
import { CONSENT_STORAGE_KEY, resetConsentCache } from "./consent";
import { GTAG_SCRIPT_URL } from "./googleAnalytics";
import { PrivacyPreferencesButton } from "./PrivacyPreferencesButton";

const ID = "G-TEST123";

type GoogleWindow = Window & { dataLayer?: unknown; gtag?: unknown; [key: string]: unknown };
const google = window as unknown as GoogleWindow;
const scripts = () => document.head.querySelectorAll(`script[src^="${GTAG_SCRIPT_URL}"]`);
const setReadyState = (state: DocumentReadyState) =>
  Object.defineProperty(document, "readyState", { value: state, configurable: true });

const renderRoot = () =>
  renderWithProviders(
    <>
      <AnalyticsRoot measurementId={ID} />
      <PrivacyPreferencesButton />
    </>,
  );

describe("AnalyticsRoot: aviso de consentimiento y carga de Google (BR-037)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetConsentCache();
    document.head.innerHTML = "";
    delete google.dataLayer;
    delete google.gtag;
    delete google[`ga-disable-${ID}`];
    // @ts-expect-error vuelve al getter original de jsdom
    delete document.readyState;
    document.cookie = "_ga=abc; path=/";
  });

  describe("primera visita, sin decidir", () => {
    it("HU-MED-003 CA-01: muestra el aviso con Aceptar y Rechazar y un enlace a la política", () => {
      renderRoot();

      expect(screen.getByRole("dialog", { name: "Tu privacidad" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Aceptar" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Rechazar" })).toBeInTheDocument();
      expect(screen.getByRole("link", { name: "Más información" })).toHaveAttribute("href", "/privacidad");
    });

    it("RNF-PRIV-001: sin decidir no se pide nada a Google ni se crea gtag", () => {
      renderRoot();

      expect(scripts()).toHaveLength(0);
      expect(google.dataLayer).toBeUndefined();
      expect(google.gtag).toBeUndefined();
    });

    it("RF-MED-003: Aceptar y Rechazar tienen exactamente el mismo estilo (igual prominencia)", () => {
      renderRoot();

      expect(screen.getByRole("button", { name: "Aceptar" }).className).toBe(screen.getByRole("button", { name: "Rechazar" }).className);
    });

    it("no roba el foco al cargar la página", () => {
      renderRoot();

      expect(document.body).toHaveFocus();
    });
  });

  describe("Rechazar", () => {
    it("HU-MED-003 CA-02: cierra el aviso, guarda `denied` y no descarga nada de Google", async () => {
      const user = userEvent.setup();
      renderRoot();

      await user.click(screen.getByRole("button", { name: "Rechazar" }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("denied");
      expect(scripts()).toHaveLength(0);
      expect(google.gtag).toBeUndefined();
    });

    it("borra las cookies de analítica que hubiera", async () => {
      const user = userEvent.setup();
      renderRoot();

      await user.click(screen.getByRole("button", { name: "Rechazar" }));

      expect(document.cookie).not.toContain("_ga");
    });
  });

  describe("Aceptar", () => {
    it("cierra el aviso, guarda `granted` y descarga el script de Google", async () => {
      const user = userEvent.setup();
      renderRoot();

      await user.click(screen.getByRole("button", { name: "Aceptar" }));

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("granted");
      expect(scripts()).toHaveLength(1);
    });

    it("RNF-PERF-007: si la página aún no cargó, espera al evento `load` antes de pedir el script", async () => {
      const user = userEvent.setup();
      setReadyState("loading");
      renderRoot();

      await user.click(screen.getByRole("button", { name: "Aceptar" }));
      expect(scripts()).toHaveLength(0);

      act(() => {
        window.dispatchEvent(new Event("load"));
      });
      expect(scripts()).toHaveLength(1);
    });
  });

  describe("visitante que ya aceptó antes", () => {
    it("no muestra el aviso y carga Google", () => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
      resetConsentCache();

      renderRoot();

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(scripts()).toHaveLength(1);
    });
  });

  describe("visitante que ya rechazó antes", () => {
    it("no muestra el aviso y no carga Google", () => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "denied");
      resetConsentCache();

      renderRoot();

      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
      expect(scripts()).toHaveLength(0);
    });
  });

  describe("Preferencias de privacidad (HU-MED-003 CA-03)", () => {
    it("reabre el aviso, detiene la medición, borra las cookies y lleva el foco al aviso", async () => {
      const user = userEvent.setup();
      renderRoot();
      await user.click(screen.getByRole("button", { name: "Aceptar" }));
      document.cookie = "_ga=abc; path=/";

      await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));

      expect(screen.getByRole("dialog", { name: "Tu privacidad" })).toBeInTheDocument();
      expect(google[`ga-disable-${ID}`]).toBe(true);
      expect(document.cookie).not.toContain("_ga");
      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
      expect(screen.getByRole("button", { name: "Rechazar" })).toHaveFocus();
    });

    it("se puede cambiar de opinión: aceptar → preferencias → rechazar", async () => {
      const user = userEvent.setup();
      renderRoot();
      await user.click(screen.getByRole("button", { name: "Aceptar" }));

      await user.click(screen.getByRole("button", { name: "Preferencias de privacidad" }));
      await user.click(screen.getByRole("button", { name: "Rechazar" }));

      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe("denied");
      expect(google[`ga-disable-${ID}`]).toBe(true);
    });
  });
});
