import { describe, expect, it, vi } from "vitest";
import { PROMO_STORAGE_KEY, isPromoActive, isPromoReady, readPromoDismissed, writePromoDismissed } from "./promoState";

const ready = { active: true, dismissed: false, loaderDone: true, consentPending: false };

const memoryStorage = () => {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
};

const brokenStorage = {
  getItem: vi.fn(() => {
    throw new Error("bloqueado");
  }),
  setItem: vi.fn(() => {
    throw new Error("bloqueado");
  }),
};

describe("promoción de bienvenida: cuándo se muestra (BR-100, HU-RES-003)", () => {
  it("CA-01: encendida, sin cerrar, con el letrero fuera y sin aviso pendiente, está lista", () => {
    expect(isPromoReady(ready)).toBe(true);
  });

  it("CA-01: mientras el letrero de neón sigue visible no está lista", () => {
    expect(isPromoReady({ ...ready, loaderDone: false })).toBe(false);
  });

  it("CA-02: mientras el aviso de privacidad espera respuesta no está lista, y al responder sí", () => {
    expect(isPromoReady({ ...ready, consentPending: true })).toBe(false);
    expect(isPromoReady({ ...ready, consentPending: false })).toBe(true);
  });

  it("CA-03: si el visitante ya la cerró no vuelve a estar lista", () => {
    expect(isPromoReady({ ...ready, dismissed: true })).toBe(false);
  });

  it("CA-04: apagada no está lista, aunque lo demás esté en orden", () => {
    expect(isPromoReady({ ...ready, active: false })).toBe(false);
  });
});

describe("promo.activa (RF-CNT-008)", () => {
  it.each(["SI", "si", "Sí", " sí "])("«%s» la enciende", (value) => {
    expect(isPromoActive(value)).toBe(true);
  });

  it.each(["NO", "no", "", "apagada", "SIII"])("«%s» la apaga", (value) => {
    expect(isPromoActive(value)).toBe(false);
  });
});

describe("recordar que ya la cerró (CA-03)", () => {
  it("no está cerrada hasta que se escribe, y después sí", () => {
    const storage = memoryStorage();

    expect(readPromoDismissed(storage)).toBe(false);
    writePromoDismissed(storage);
    expect(readPromoDismissed(storage)).toBe(true);
    expect(storage.getItem(PROMO_STORAGE_KEY)).toBe("1");
  });

  it("con el almacenamiento bloqueado no falla: lee «no cerrada» y escribir no lanza", () => {
    expect(readPromoDismissed(brokenStorage)).toBe(false);
    expect(() => writePromoDismissed(brokenStorage)).not.toThrow();
  });
});
