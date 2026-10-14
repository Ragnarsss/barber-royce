import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NEON_LOADER, dismissNeonLoader, isNeonLoaderDone, remainingMs, subscribeNeonLoader } from "./neonLoader";

// BR-054: el letrero vive en index.html y se pinta antes del JS. Este módulo lo apaga cuando React monta,
// respetando un mínimo para que se lea el encendido, y avisa al hero para que empiece su entrada.
const mountLoader = () => {
  const el = document.createElement("div");
  el.id = "neon-loader";
  document.body.append(el);
  return el;
};

describe("remainingMs: cuánto falta para el mínimo (BR-054)", () => {
  it("al cargar en el instante 0 espera el mínimo completo", () => {
    expect(remainingMs(0)).toBe(NEON_LOADER.MIN_MS);
  });

  it("si ya pasó parte del mínimo, espera solo lo que falta", () => {
    expect(remainingMs(NEON_LOADER.MIN_MS - 300)).toBe(300);
  });

  it("si la carga tardó más que el mínimo, no agrega espera", () => {
    expect(remainingMs(NEON_LOADER.MIN_MS + 2000)).toBe(0);
  });
});

describe("dismissNeonLoader: apaga el letrero (BR-054, HU-EXP-004 CA-06)", () => {
  let cleanup: () => void = () => {};

  beforeEach(() => {
    vi.useFakeTimers();
    sessionStorage.clear();
  });

  afterEach(() => {
    cleanup();
    document.getElementById("neon-loader")?.remove();
    vi.useRealTimers();
  });

  it("dura al menos el mínimo: antes no sale y después pasa a «saliendo» y avisa que terminó", () => {
    const el = mountLoader();
    cleanup = dismissNeonLoader(document, 200);

    vi.advanceTimersByTime(NEON_LOADER.MIN_MS - 200 - 1);
    expect(el.dataset.state).toBeUndefined();
    expect(isNeonLoaderDone()).toBe(false);

    vi.advanceTimersByTime(1);
    expect(el.dataset.state).toBe("exiting");
    expect(isNeonLoaderDone()).toBe(true);
  });

  it("se retira del documento cuando termina la salida", () => {
    mountLoader();
    cleanup = dismissNeonLoader(document, NEON_LOADER.MIN_MS);

    vi.advanceTimersByTime(NEON_LOADER.EXIT_MS);

    expect(document.getElementById("neon-loader")).toBeNull();
  });

  it.each(["pointerdown", "keydown", "wheel", "touchstart"])("una interacción (%s) lo acorta sin esperar el mínimo", (type) => {
    const el = mountLoader();
    cleanup = dismissNeonLoader(document, 0);

    window.dispatchEvent(new Event(type));

    expect(el.dataset.state).toBe("exiting");
    expect(isNeonLoaderDone()).toBe(true);
  });

  it("HU-EXP-004 CA-06: la primera carga de la sesión espera el mínimo y deja la sesión marcada", () => {
    mountLoader();
    cleanup = dismissNeonLoader(document, 0);

    vi.advanceTimersByTime(NEON_LOADER.MIN_MS);

    expect(sessionStorage.getItem(NEON_LOADER.SEEN_KEY)).toBe("1");
  });

  it("HU-EXP-004 CA-06: en la segunda carga de la misma sesión sale apenas monta React, sin esperar el mínimo", () => {
    sessionStorage.setItem(NEON_LOADER.SEEN_KEY, "1");
    const el = mountLoader();
    cleanup = dismissNeonLoader(document, 0);

    vi.advanceTimersByTime(0);

    expect(el.dataset.state).toBe("exiting");
    expect(isNeonLoaderDone()).toBe(true);
  });

  it("si el almacenamiento de sesión falla (modo privado, bloqueado), cuenta como primera carga y no rompe", () => {
    const spy = vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    const set = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    const el = mountLoader();
    cleanup = dismissNeonLoader(document, 0);

    vi.advanceTimersByTime(NEON_LOADER.MIN_MS - 1);
    expect(el.dataset.state).toBeUndefined();
    vi.advanceTimersByTime(1);
    expect(el.dataset.state).toBe("exiting");

    spy.mockRestore();
    set.mockRestore();
  });

  it("sin letrero en la página (tests, o ya retirado) da la carga por terminada de inmediato", () => {
    cleanup = dismissNeonLoader(document, 0);

    expect(isNeonLoaderDone()).toBe(true);
  });

  it("avisa a los suscriptores una sola vez", () => {
    mountLoader();
    const listener = vi.fn();
    const unsubscribe = subscribeNeonLoader(listener);
    cleanup = dismissNeonLoader(document, 0);

    vi.advanceTimersByTime(NEON_LOADER.MIN_MS);
    window.dispatchEvent(new Event("keydown"));

    expect(listener).toHaveBeenCalledTimes(1);
    unsubscribe();
  });

  it("al limpiar no deja temporizadores ni escuchas vivas", () => {
    const el = mountLoader();
    dismissNeonLoader(document, 0)();

    vi.advanceTimersByTime(NEON_LOADER.MIN_MS + NEON_LOADER.EXIT_MS);
    window.dispatchEvent(new Event("pointerdown"));

    expect(el.dataset.state).toBeUndefined();
  });
});
