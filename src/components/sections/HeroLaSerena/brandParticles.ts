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
  /** Desvío lateral al final del camino (remolino): la trayectoria se curva y termina desplazada de lado. */
  sx: number;
  sy: number;
  /** Fracción de la explosión (0..1) en que esta partícula empieza a moverse. */
  delay: number;
  /** Tamaño relativo al punto de polvo: 1 el polvo, más las chispas. */
  scale: number;
  /** Las chispas son pocas, más grandes y brillantes, y tardan más en apagarse. */
  spark: boolean;
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
  /** Chispas: qué parte de las partículas lo son (0..1) y el índice del color que llevan. Sin esto, todo es polvo. */
  sparks?: { ratio: number; color: number };
  /** Generador de números en [0, 1): en los tests, uno fijo. */
  random: () => number;
}

const ALPHA_THRESHOLD = 128;
/** Cuánto se desvía cada partícula de la recta que sale del centro (radianes, a cada lado). */
const JITTER = 0.6;
/** La última partícula sale como mucho en este punto de la explosión: casi todas salen juntas y la silueta no se queda de fondo. */
const MAX_DELAY = 0.12;
/** Cuánto se curva el camino (remolino), como fracción de la distancia recorrida; todas hacia el mismo lado. */
const SWIRL = 0.7;
/** Las chispas son más grandes, llegan más lejos y salen casi de inmediato. */
const SPARK_SCALE = 2.4;
const SPARK_REACH = 1.3;
const SPARK_MAX_DELAY = 0.04;
/** Exponente del apagado: con 1 es lineal; más de 1, se apaga antes. La chispa dura más que el polvo. */
const DECAY_DUST = 1.4;
const DECAY_SPARK = 0.8;

/** Convierte la tinta de una imagen (canal alfa RGBA, `width` x `height`) en partículas. */
export function sampleParticles(pixels: Uint8ClampedArray, width: number, height: number, options: SampleOptions): Particle[] {
  const { gap, colors, center, spread, max, random, sparks } = options;
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
    const spark = sparks !== undefined && random() < sparks.ratio;
    const base = Math.atan2(y - center.y, x - center.x);
    const angle = base + (random() * 2 - 1) * JITTER;
    const distance = spread * (0.5 + random()) * (spark ? SPARK_REACH : 1);
    // El remolino empuja de lado (perpendicular a la salida) y siempre hacia el mismo sentido: así las partículas giran
    // juntas como un molinete. Con signo al azar se cancelaban y parecía un estallido recto.
    const bow = (0.5 + random() * 0.5) * SWIRL * distance;
    return {
      x,
      y,
      dx: Math.cos(angle) * distance,
      dy: Math.sin(angle) * distance,
      sx: -Math.sin(angle) * bow,
      sy: Math.cos(angle) * bow,
      delay: random() * (spark ? SPARK_MAX_DELAY : MAX_DELAY),
      scale: spark ? SPARK_SCALE : 1,
      spark,
      color: spark && sparks ? sparks.color : Math.min(colors - 1, Math.floor(random() * colors)),
    };
  });
}

/**
 * Dónde está una partícula y con qué opacidad, en el punto `t` (0..1) de la explosión. El polvo se apaga un poco antes que
 * en línea recta, para que la silueta de la marca no se vea de fondo; la chispa dura más.
 */
export function particleAt(particle: Particle, t: number): { x: number; y: number; alpha: number } {
  const local = Math.min(1, Math.max(0, (t - particle.delay) / (1 - particle.delay)));
  const eased = 1 - (1 - local) ** 3;
  // El desvío crece con el cuadrado del avance: la trayectoria arranca recta y se va curvando hasta terminar de lado.
  const bow = eased * eased;
  return {
    x: particle.x + particle.dx * eased + particle.sx * bow,
    y: particle.y + particle.dy * eased + particle.sy * bow,
    alpha: (1 - local) ** (particle.spark ? DECAY_SPARK : DECAY_DUST),
  };
}
