import { beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { motionValue, type MotionValue } from "framer-motion";

const reducedMotion = vi.hoisted(() => ({ value: false }));
const transformCalls = vi.hoisted(() => ({ count: 0 }));

vi.mock("framer-motion", async (importOriginal) => {
  const actual = await importOriginal<typeof import("framer-motion")>();
  return {
    ...actual,
    useReducedMotion: () => reducedMotion.value,
    useTransform: ((...args: Parameters<typeof actual.useTransform>) => {
      transformCalls.count += 1;
      return (actual.useTransform as (...a: unknown[]) => unknown)(...args);
    }) as typeof actual.useTransform,
  };
});

import {
  useBackgroundLayer,
  useFastLayer,
  useForegroundLayer,
  useMiddleLayer,
  useSlowLayer,
} from "./useParallaxLayers";

const nextFrames = () => new Promise((resolve) => setTimeout(resolve, 60));

async function setProgress(progress: MotionValue<number>, value: number) {
  await act(async () => {
    progress.set(value);
    await nextFrames();
  });
}

describe("capas de parallax (BR-016, BR-017)", () => {
  let progress: MotionValue<number>;

  beforeEach(() => {
    progress = motionValue(0);
    reducedMotion.value = false;
    transformCalls.count = 0;
  });

  it("la capa de fondo interpola con el progreso de la sección", async () => {
    const { result } = renderHook(() => useBackgroundLayer(progress));

    expect(result.current.y.get()).toBe("0%");
    expect(result.current.scale.get()).toBe(1);

    await setProgress(progress, 1);

    expect(result.current.y.get()).toBe("15%");
    expect(result.current.scale.get()).toBe(1.05);
  });

  it("CP-A11Y-003: con reducir movimiento la capa no se mueve aunque avance el scroll", async () => {
    reducedMotion.value = true;
    const { result } = renderHook(() => useFastLayer(progress));

    await setProgress(progress, 1);

    expect(result.current.y.get()).toBe("0%");
    expect(result.current.x.get()).toBe("0%");
  });

  it.each([
    ["fondo", useBackgroundLayer],
    ["media", useMiddleLayer],
    ["frontal", useForegroundLayer],
    ["lenta", useSlowLayer],
    ["rápida", useFastLayer],
  ])("la capa %s crea solo los 2 transforms que se animan", (_name, useLayer) => {
    renderHook(() => useLayer(progress));

    expect(transformCalls.count).toBe(2);
  });

  it("una sección que usa 2 capas crea 4 transforms, no los 12 de antes", () => {
    renderHook(() => ({ slow: useSlowLayer(progress), fast: useFastLayer(progress) }));

    expect(transformCalls.count).toBe(4);
  });
});
