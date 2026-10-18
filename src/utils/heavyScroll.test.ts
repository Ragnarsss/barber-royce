import type Lenis from "lenis";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { HEAVY_SCROLL, createSpeedLimiter, setHeavyScroll } from "./heavyScroll";

// BR-077 (HU-EXP-004 CA-28): scroll pesado en las escenas fijas, con el gancho público `virtualScroll` de Lenis.
describe("createSpeedLimiter: presupuesto de scroll que se recarga con el tiempo", () => {
  const make = (maxSpeed = 1000, burst = 100) => {
    let time = 0;
    const limit = createSpeedLimiter({ maxSpeed, burst }, () => time);
    return { limit, advance: (ms: number) => (time += ms) };
  };

  it("deja pasar lo pedido mientras quepa en la ráfaga", () => {
    const { limit } = make();

    expect(limit(60)).toBe(60);
  });

  it("limita lo que excede el presupuesto", () => {
    const { limit } = make();

    expect(limit(500)).toBe(100);
    expect(limit(500)).toBe(0);
  });

  it("recarga el presupuesto con el tiempo, a la velocidad máxima", () => {
    const { limit, advance } = make(1000, 100);
    limit(100);
    advance(50); // 50 ms a 1000 px/s: 50 px

    expect(limit(500)).toBeCloseTo(50);
  });

  it("nunca acumula más que la ráfaga, aunque pase mucho tiempo sin girar", () => {
    const { limit, advance } = make(1000, 100);
    advance(60_000);

    expect(limit(10_000)).toBe(100);
  });

  it("CA-28: con la rueda girando sin parar, el avance queda en la velocidad máxima", () => {
    const { limit, advance } = make(800, 120);
    let total = 0;
    for (let i = 0; i < 125; i++) {
      advance(16); // 125 gestos de 16 ms = 2 segundos, pidiendo 400 px cada uno
      total += limit(400);
    }

    // 2 s a 800 px/s más la ráfaga inicial
    expect(total).toBeLessThanOrEqual(800 * 2 + 120 + 1);
    expect(total).toBeGreaterThan(800 * 2 - 100);
  });
});

describe("setHeavyScroll: instala y retira el límite en Lenis", () => {
  const fakeLenis = () => {
    const original = vi.fn<(data: unknown) => boolean>(() => true);
    const lenis = {
      options: { virtualScroll: original, easing: (t: number) => t },
      targetScroll: 1000,
      scrollTo: vi.fn(),
    };
    return { lenis: lenis as unknown as Lenis, raw: lenis, original };
  };
  const wheel = (deltaY: number, extra: Partial<WheelEvent> = {}) => {
    const event = { type: "wheel", ctrlKey: false, cancelable: true, preventDefault: vi.fn(), ...extra } as unknown as WheelEvent;
    return { data: { deltaX: 0, deltaY, event }, event };
  };

  beforeEach(() => {
    // Las escenas activas son globales: se vacían entre pruebas
    for (const id of ["a", "b"]) setHeavyScroll(null, id, false);
  });

  it("sin Lenis no hace nada", () => {
    expect(() => setHeavyScroll(null, "a", true)).not.toThrow();
  });

  it("al activar, el gesto de la rueda se atiende aquí: se limita, se evita el scroll nativo y Lenis no lo repite", () => {
    const { lenis, raw } = fakeLenis();
    setHeavyScroll(lenis, "a", true);

    const { data, event } = wheel(5000);
    const handled = raw.options.virtualScroll(data as never);

    expect(handled).toBe(false);
    expect(event.preventDefault).toHaveBeenCalled();
    const target = raw.scrollTo.mock.calls[0][0] as number;
    expect(target).toBeGreaterThan(1000);
    expect(target - 1000).toBeLessThanOrEqual(HEAVY_SCROLL.BURST);
    expect(raw.scrollTo.mock.calls[0][1]).toMatchObject({ duration: HEAVY_SCROLL.DURATION });
    setHeavyScroll(lenis, "a", false);
  });

  it("regresión: el empuje es no programático, así el destino se acumula y no parte de la posición animada", () => {
    const { lenis, raw } = fakeLenis();
    setHeavyScroll(lenis, "a", true);

    raw.options.virtualScroll(wheel(50).data as never);

    expect(raw.scrollTo.mock.calls[0][1]).toMatchObject({ programmatic: false });
    setHeavyScroll(lenis, "a", false);
  });

  it("hacia arriba también: el empuje resta, con el mismo límite", () => {
    const { lenis, raw } = fakeLenis();
    setHeavyScroll(lenis, "a", true);

    raw.options.virtualScroll(wheel(-5000).data as never);

    const target = raw.scrollTo.mock.calls[0][0] as number;
    expect(target).toBeLessThan(1000);
    expect(1000 - target).toBeLessThanOrEqual(HEAVY_SCROLL.BURST);
    setHeavyScroll(lenis, "a", false);
  });

  it("el zoom con Ctrl, el toque y los gestos sin desplazamiento los deja a Lenis", () => {
    const { lenis, raw } = fakeLenis();
    setHeavyScroll(lenis, "a", true);

    expect(raw.options.virtualScroll(wheel(100, { ctrlKey: true }).data as never)).toBe(true);
    expect(raw.options.virtualScroll(wheel(100, { type: "touchmove" } as never).data as never)).toBe(true);
    expect(raw.options.virtualScroll(wheel(0).data as never)).toBe(true);
    expect(raw.options.virtualScroll(wheel(100, { cancelable: false }).data as never)).toBe(true);
    expect(raw.scrollTo).not.toHaveBeenCalled();
    setHeavyScroll(lenis, "a", false);
  });

  it("al desactivar, devuelve el gancho que tenía Lenis", () => {
    const { lenis, raw, original } = fakeLenis();
    setHeavyScroll(lenis, "a", true);
    expect(raw.options.virtualScroll).not.toBe(original);

    setHeavyScroll(lenis, "a", false);

    expect(raw.options.virtualScroll).toBe(original);
  });

  it("con dos escenas seguidas, el límite sigue hasta que sale la última y no queda pegado después", () => {
    const { lenis, raw, original } = fakeLenis();
    setHeavyScroll(lenis, "a", true);
    const installed = raw.options.virtualScroll;
    setHeavyScroll(lenis, "b", true);
    expect(raw.options.virtualScroll).toBe(installed);

    setHeavyScroll(lenis, "a", false);
    expect(raw.options.virtualScroll).toBe(installed);

    setHeavyScroll(lenis, "b", false);
    expect(raw.options.virtualScroll).toBe(original);
  });

  it("activar dos veces la misma escena no instala el límite dos veces", () => {
    const { lenis, raw, original } = fakeLenis();
    setHeavyScroll(lenis, "a", true);
    const installed = raw.options.virtualScroll;
    setHeavyScroll(lenis, "a", true);

    expect(raw.options.virtualScroll).toBe(installed);
    setHeavyScroll(lenis, "a", false);
    expect(raw.options.virtualScroll).toBe(original);
  });

  it("los valores del scroll pesado están en un solo lugar y son razonables", () => {
    expect(HEAVY_SCROLL.MAX_SPEED).toBeGreaterThan(300);
    expect(HEAVY_SCROLL.MAX_SPEED).toBeLessThan(2000);
    expect(HEAVY_SCROLL.BURST).toBeGreaterThan(0);
    expect(HEAVY_SCROLL.DURATION).toBeGreaterThan(1.2);
  });
});
