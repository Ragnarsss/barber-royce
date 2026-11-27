/**
 * Partículas de la marca del hero de La Serena (BR-114). La marca «Barbería Royce» se dibuja en un lienzo fuera de pantalla,
 * se muestrea cada `gap` píxeles y cada punto con tinta se vuelve una partícula que sale disparada desde el centro de la
 * marca hacia afuera. Todo es puro (sin DOM ni azar global) para poder probarlo: el componente pone el lienzo y el scroll.
 */

export interface Particle {
  /** Posición de origen, en píxeles CSS del escenario. */
  x: number;
  y: number;
  /** Desplazamiento total al terminar la explosión. */
  dx: number;
  dy: number;
  /** Fracción de la explosión (0..1) en que esta partícula empieza a moverse. */
  delay: number;
  /** Índice del color, entre los que pasa el componente. */
  color: number;
}

export interface SampleOptions {
  /** Paso del muestreo en píxeles: más grande, menos partículas. */
  gap: number;
  /** Cuántos colores hay para repartir. */
  colors: number;
  /** Centro desde el que estalla la marca. */
  center: { x: number; y: number };
  /** Distancia típica que recorre una partícula. */
  spread: number;
  /** Tope de partículas, para que un móvil no dibuje miles. */
  max: number;
  /** Generador de números en [0, 1): en los tests, uno fijo. */
  random: () => number;
}

const ALPHA_THRESHOLD = 128;
/** Cuánto se desvía cada partícula de la recta que sale del centro (radianes, a cada lado). */
const JITTER = 0.6;
/** La última partícula sale como mucho en este punto de la explosión, para que todas lleguen a desvanecerse. */
const MAX_DELAY = 0.35;

/** Convierte la tinta de una imagen (canal alfa RGBA, `width` x `height`) en partículas. */
export function sampleParticles(pixels: Uint8ClampedArray, width: number, height: number, options: SampleOptions): Particle[] {
  const { gap, colors, center, spread, max, random } = options;
  const points: Array<{ x: number; y: number }> = [];
  for (let y = 0; y < height; y += gap) {
    for (let x = 0; x < width; x += gap) {
      if (pixels[(y * width + x) * 4 + 3] > ALPHA_THRESHOLD) points.push({ x, y });
    }
  }

  // Si se pasa del tope, se toma una de cada `stride`: se pierde densidad pero no se corta la forma.
  const stride = Math.max(1, Math.ceil(points.length / max));
  const kept = points.filter((_, index) => index % stride === 0);

  return kept.map(({ x, y }) => {
    const base = Math.atan2(y - center.y, x - center.x);
    const angle = base + (random() * 2 - 1) * JITTER;
    const distance = spread * (0.5 + random());
    return {
      x,
      y,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      delay: random() * MAX_DELAY,
      color: Math.min(colors - 1, Math.floor(random() * colors)),
    };
  });
}

/** Dónde está una partícula y con qué opacidad, en el punto `t` (0..1) de la explosión. */
export function particleAt(particle: Particle, t: number): { x: number; y: number; alpha: number } {
  const local = Math.min(1, Math.max(0, (t - particle.delay) / (1 - particle.delay)));
  const eased = 1 - (1 - local) ** 3;
  return { x: particle.x + particle.dx * eased, y: particle.y + particle.dy * eased, alpha: 1 - local };
}
