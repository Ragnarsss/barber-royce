import { describe, expect, it } from "vitest";
import { particleAt, sampleParticles, type SampleOptions } from "./brandParticles";

/** Imagen RGBA de `width` x `height` con tinta solo dentro del rectángulo dado. */
function inked(width: number, height: number, ink: { x0: number; y0: number; x1: number; y1: number }): Uint8ClampedArray {
  const pixels = new Uint8ClampedArray(width * height * 4);
  for (let y = ink.y0; y < ink.y1; y++) for (let x = ink.x0; x < ink.x1; x++) pixels[(y * width + x) * 4 + 3] = 255;
  return pixels;
}

/** Generador fijo, para que el test no dependa del azar. */
function seeded(seed = 1): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

const options = (overrides: Partial<SampleOptions> = {}): SampleOptions => ({
  gap: 2,
  colors: 4,
  center: { x: 50, y: 50 },
  spread: 100,
  max: 10_000,
  random: seeded(),
  ...overrides,
});

// BR-114 (HU-SUC-002 CA-10, RF-SUC-009): la marca se deshace en partículas que salen en todas direcciones.
describe("partículas de la marca (BR-114)", () => {
  it("solo hay partículas donde hay tinta, una cada `gap` píxeles", () => {
    const pixels = inked(100, 100, { x0: 20, y0: 40, x1: 40, y1: 60 });

    const particles = sampleParticles(pixels, 100, 100, options({ gap: 2 }));

    expect(particles).toHaveLength(10 * 10);
    for (const { x, y } of particles) {
      expect(x).toBeGreaterThanOrEqual(20);
      expect(x).toBeLessThan(40);
      expect(y).toBeGreaterThanOrEqual(40);
      expect(y).toBeLessThan(60);
    }
  });

  it("un paso más grande da menos partículas (triangulación del muestreo)", () => {
    const pixels = inked(100, 100, { x0: 0, y0: 0, x1: 100, y1: 100 });

    expect(sampleParticles(pixels, 100, 100, options({ gap: 5 }))).toHaveLength(20 * 20);
    expect(sampleParticles(pixels, 100, 100, options({ gap: 10 }))).toHaveLength(10 * 10);
  });

  it("respeta el tope de partículas sin cortar la forma", () => {
    const pixels = inked(100, 100, { x0: 0, y0: 0, x1: 100, y1: 100 });

    const particles = sampleParticles(pixels, 100, 100, options({ gap: 1, max: 1000 }));

    expect(particles.length).toBeLessThanOrEqual(1000);
    expect(particles.length).toBeGreaterThan(900);
    expect(Math.max(...particles.map((p) => p.y))).toBeGreaterThan(90);
  });

  it("cada partícula sale hacia afuera del centro: las de la izquierda van a la izquierda y las de la derecha, a la derecha", () => {
    const pixels = inked(100, 100, { x0: 0, y0: 45, x1: 100, y1: 55 });
    const particles = sampleParticles(pixels, 100, 100, options());

    for (const particle of particles.filter((p) => p.x < 30)) expect(particle.dx).toBeLessThan(0);
    for (const particle of particles.filter((p) => p.x > 70)) expect(particle.dx).toBeGreaterThan(0);
  });

  it("las partículas se reparten en todas direcciones y en todos los colores", () => {
    const pixels = inked(100, 100, { x0: 10, y0: 10, x1: 90, y1: 90 });
    const particles = sampleParticles(pixels, 100, 100, options());

    expect(particles.some((p) => p.dy < 0)).toBe(true);
    expect(particles.some((p) => p.dy > 0)).toBe(true);
    expect(new Set(particles.map((p) => p.color))).toEqual(new Set([0, 1, 2, 3]));
  });

  it("al empezar están en su origen y visibles; al terminar, desplazadas por completo e invisibles", () => {
    const particle = { x: 10, y: 20, dx: 30, dy: -40, sx: 0, sy: 0, delay: 0.2, scale: 1, spark: false, color: 0 };

    expect(particleAt(particle, 0)).toEqual({ x: 10, y: 20, alpha: 1 });
    expect(particleAt(particle, 1)).toEqual({ x: 40, y: -20, alpha: 0 });
  });

  it("no se mueve antes de su retraso, y a medio camino ya avanzó más de la mitad (sale rápido y frena)", () => {
    const particle = { x: 0, y: 0, dx: 100, dy: 0, sx: 0, sy: 0, delay: 0.2, scale: 1, spark: false, color: 0 };

    expect(particleAt(particle, 0.15).x).toBe(0);
    expect(particleAt(particle, 0.6).x).toBeGreaterThan(50);
  });

  it("el polvo se desvanece antes que una línea recta y la chispa dura más que el polvo", () => {
    const dust = { x: 0, y: 0, dx: 100, dy: 0, sx: 0, sy: 0, delay: 0, scale: 1, spark: false, color: 0 };
    const spark = { ...dust, scale: 2.2, spark: true };

    expect(particleAt(dust, 0.5).alpha).toBeLessThan(0.5);
    expect(particleAt(dust, 0.5).alpha).toBeGreaterThan(0.3);
    expect(particleAt(spark, 0.5).alpha).toBeGreaterThan(0.5);
    expect(particleAt(dust, 1).alpha).toBe(0);
    expect(particleAt(dust, 0).alpha).toBe(1);
  });

  it("el remolino curva el camino y todas giran hacia el mismo lado: se desvía de la recta y el desvío crece hasta el final", () => {
    const swirl = { x: 0, y: 0, dx: 100, dy: 0, sx: 0, sy: 20, delay: 0, scale: 1, spark: false, color: 0 };

    expect(particleAt(swirl, 0.5).y).toBeGreaterThan(2);
    expect(particleAt(swirl, 1).y).toBeGreaterThan(particleAt(swirl, 0.5).y);
    expect(particleAt(swirl, 1).y).toBeCloseTo(20, 5);
    expect(particleAt(swirl, 1).x).toBeCloseTo(100, 5);
  });

  it("casi todas salen juntas: ninguna espera más del 12 % de la explosión (la silueta no queda de fondo)", () => {
    const pixels = inked(100, 100, { x0: 0, y0: 0, x1: 100, y1: 100 });
    const particles = sampleParticles(pixels, 100, 100, options());

    expect(Math.max(...particles.map((p) => p.delay))).toBeLessThanOrEqual(0.12);
  });

  it("una parte pequeña son chispas: más grandes, del color pedido y con remolino; el resto es polvo", () => {
    const pixels = inked(100, 100, { x0: 0, y0: 0, x1: 100, y1: 100 });
    const particles = sampleParticles(pixels, 100, 100, options({ sparks: { ratio: 0.05, color: 2 } }));
    const sparks = particles.filter((p) => p.spark);

    expect(sparks.length / particles.length).toBeGreaterThan(0.02);
    expect(sparks.length / particles.length).toBeLessThan(0.09);
    for (const spark of sparks) {
      expect(spark.color).toBe(2);
      expect(spark.scale).toBeGreaterThan(1.5);
    }
    for (const dust of particles.filter((p) => !p.spark)) expect(dust.scale).toBe(1);
    expect(particles.some((p) => p.sx !== 0 || p.sy !== 0)).toBe(true);
  });

  it("todas las partículas giran al mismo lado (el desvío es siempre el mismo sentido respecto de su salida)", () => {
    const pixels = inked(100, 100, { x0: 0, y0: 0, x1: 100, y1: 100 });
    const particles = sampleParticles(pixels, 100, 100, options());

    // Producto cruzado de la salida (dx, dy) con el desvío (sx, sy): su signo es el sentido del giro.
    const turns = particles.map((p) => Math.sign(p.dx * p.sy - p.dy * p.sx));
    expect(new Set(turns)).toEqual(new Set([1]));
  });
});
