import { beforeEach, describe, expect, it, vi } from "vitest";
import { Profiler, type ReactNode } from "react";
import { act, renderHook } from "@testing-library/react";
import { motionValue, type MotionValue } from "framer-motion";

// jsdom no calcula el scroll real (document.scrollingElement no es documentElement),
// así que useScroll se reemplaza por un MotionValue que el test controla. El resto de
// framer-motion (useMotionValueEvent, useVelocity, useTransform) es el real.
const scroll = vi.hoisted(() => ({ y: null as unknown as MotionValue<number> }));
vi.mock("framer-motion", async (importOriginal) => ({
  ...(await importOriginal<typeof import("framer-motion")>()),
  useScroll: () => ({ scrollY: scroll.y }),
}));

import { useScrollDirection, useScrollSpeed } from "./useScrollMotion";

// Cuenta los commits de React: si el scroll re-renderizara, el contador subiría.
const commits = { count: 0 };
const wrapper = ({ children }: { children: ReactNode }) => (
  <Profiler id="probe" onRender={() => void (commits.count += 1)}>
    {children}
  </Profiler>
);

const useProbe = () => ({ direction: useScrollDirection(), speed: useScrollSpeed() });

const nextFrames = () => new Promise((resolve) => setTimeout(resolve, 60));

async function scrollTo(y: number) {
  await act(async () => {
    scroll.y.set(y);
    await nextFrames();
  });
}

describe("useScrollDirection / useScrollSpeed (BR-015, CP-PERF-006)", () => {
  beforeEach(() => {
    scroll.y = motionValue(0);
    commits.count = 0;
  });

  it("el scroll no re-renderiza el componente, y los valores sí cambian", async () => {
    const { result } = renderHook(useProbe, { wrapper });
    const commitsAfterMount = commits.count;

    await scrollTo(300);
    await scrollTo(80);
    await scrollTo(500);

    // Los valores reaccionaron (la prueba no es vacía)...
    expect(result.current.direction.get()).toBe(1);
    expect(scroll.y.get()).toBe(500);
    // ...y aun así el componente no se volvió a renderizar.
    expect(commits.count).toBe(commitsAfterMount);
  });

  it("la dirección cambia a -1 al subir y vuelve a 1 al bajar", async () => {
    const { result } = renderHook(useProbe, { wrapper });

    await scrollTo(400);
    expect(result.current.direction.get()).toBe(1);

    await scrollTo(200);
    expect(result.current.direction.get()).toBe(-1);

    await scrollTo(500);
    expect(result.current.direction.get()).toBe(1);
  });

  it("quedarse quieto conserva la última dirección", async () => {
    const { result } = renderHook(useProbe, { wrapper });
    await scrollTo(400);
    await scrollTo(200);

    await scrollTo(200);

    expect(result.current.direction.get()).toBe(-1);
  });

  it("la velocidad es siempre positiva, también al subir", async () => {
    const { result } = renderHook(useProbe, { wrapper });

    await scrollTo(400);
    await scrollTo(0);

    expect(result.current.speed.get()).toBeGreaterThanOrEqual(0);
  });
});
