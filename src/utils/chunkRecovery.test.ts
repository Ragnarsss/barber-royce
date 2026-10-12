import { describe, expect, it, vi } from "vitest";
import { RELOAD_WINDOW_MS, installChunkRecovery, shouldReloadAfterChunkError } from "./chunkRecovery";

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => void data.set(key, value),
  };
}

describe("shouldReloadAfterChunkError (BR-020, CP-CONF-002)", () => {
  it("recarga la primera vez que falla un chunk", () => {
    expect(shouldReloadAfterChunkError(memoryStorage(), 1_000_000)).toBe(true);
  });

  it("no recarga de nuevo dentro de la ventana: evita el bucle", () => {
    const storage = memoryStorage();
    shouldReloadAfterChunkError(storage, 1_000_000);

    expect(shouldReloadAfterChunkError(storage, 1_000_000 + RELOAD_WINDOW_MS - 1)).toBe(false);
  });

  it("vuelve a recargar si el fallo ocurre después de la ventana (otro despliegue)", () => {
    const storage = memoryStorage();
    shouldReloadAfterChunkError(storage, 1_000_000);

    expect(shouldReloadAfterChunkError(storage, 1_000_000 + RELOAD_WINDOW_MS)).toBe(true);
  });

  it("sin storage disponible no recarga y no lanza", () => {
    const blocked = {
      getItem: () => {
        throw new Error("SecurityError");
      },
      setItem: () => {
        throw new Error("SecurityError");
      },
    };

    expect(shouldReloadAfterChunkError(blocked, 1_000_000)).toBe(false);
  });
});

describe("installChunkRecovery", () => {
  function fakeWindow() {
    const target = new EventTarget();
    const reload = vi.fn();
    const win = Object.assign(target, {
      sessionStorage: memoryStorage(),
      location: { reload },
    }) as unknown as Window;
    return { win, reload };
  }

  const preloadError = () => new Event("vite:preloadError", { cancelable: true });

  it("ante vite:preloadError recarga una vez y suprime el error", () => {
    const { win, reload } = fakeWindow();
    installChunkRecovery(win);

    const event = preloadError();
    win.dispatchEvent(event);

    expect(reload).toHaveBeenCalledTimes(1);
    expect(event.defaultPrevented).toBe(true);
  });

  it("un segundo fallo inmediato no recarga y deja pasar el error al boundary", () => {
    const { win, reload } = fakeWindow();
    installChunkRecovery(win);
    win.dispatchEvent(preloadError());

    const second = preloadError();
    win.dispatchEvent(second);

    expect(reload).toHaveBeenCalledTimes(1);
    expect(second.defaultPrevented).toBe(false);
  });
});
