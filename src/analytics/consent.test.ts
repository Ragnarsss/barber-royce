import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  CONSENT_STORAGE_KEY,
  consumeFocusRequest,
  getConsent,
  readConsent,
  requestConsentPrompt,
  resetConsentCache,
  setConsent,
  subscribeConsent,
  writeConsent,
} from "./consent";

const blockedStorage = {
  getItem: () => {
    throw new Error("SecurityError");
  },
  setItem: () => {
    throw new Error("SecurityError");
  },
  removeItem: () => {
    throw new Error("SecurityError");
  },
};

describe("consentimiento de analítica (BR-037, CP-MED-003, CP-PRIV-001)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetConsentCache();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("lectura y escritura", () => {
    it("sin elección guardada el estado es `unset` (no medir)", () => {
      expect(readConsent()).toBe("unset");
    });

    it.each(["granted", "denied"] as const)("recuerda la elección `%s`", (value) => {
      writeConsent(value);

      expect(readConsent()).toBe(value);
    });

    it("un valor desconocido en el almacenamiento se trata como `unset`, nunca como `granted`", () => {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, "si");

      expect(readConsent()).toBe("unset");
    });

    it("`unset` borra la elección guardada", () => {
      writeConsent("granted");
      writeConsent("unset");

      expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBeNull();
    });
  });

  describe("con el almacenamiento bloqueado (modo privado estricto)", () => {
    it("leer devuelve `unset` y escribir no lanza", () => {
      expect(readConsent(blockedStorage)).toBe("unset");
      expect(() => writeConsent("granted", blockedStorage)).not.toThrow();
    });

    it("la elección vive en memoria durante la visita, pero la siguiente empieza sin decidir", () => {
      vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
        throw new Error("SecurityError");
      });

      setConsent("granted");

      expect(getConsent()).toBe("granted");
      resetConsentCache();
      expect(getConsent()).toBe("unset");
    });
  });

  describe("store", () => {
    it("avisa a los suscriptores al cambiar y deja de avisar al desuscribirse", () => {
      const listener = vi.fn();
      const unsubscribe = subscribeConsent(listener);

      setConsent("denied");
      unsubscribe();
      setConsent("granted");

      expect(listener).toHaveBeenCalledTimes(1);
    });

    it("`requestConsentPrompt` vuelve a `unset` y pide el foco una sola vez", () => {
      setConsent("granted");

      requestConsentPrompt();

      expect(getConsent()).toBe("unset");
      expect(consumeFocusRequest()).toBe(true);
      expect(consumeFocusRequest()).toBe(false);
    });
  });
});
