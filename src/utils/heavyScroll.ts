import type Lenis from "lenis";

/**
 * Scroll «pesado» para las escenas fijas (BR-077, HU-EXP-004 CA-28). Con un trackpad o una rueda con inercia, una sola
 * pasada cruza todo el recorrido fijo en una fracción de segundo y el efecto no se alcanza a ver. Mientras una escena
 * está en pantalla se limita la velocidad con que avanza el scroll de la rueda y cada empuje llega con un deslizamiento
 * más largo; fuera de las escenas, el scroll es el de siempre.
 *
 * Se usa el gancho público `virtualScroll` de Lenis, que recibe cada gesto de la rueda; el multiplicador interno de
 * la rueda no se toca. El teclado, la barra de desplazamiento y el toque no pasan por aquí.
 */
export const HEAVY_SCROLL = {
  /** Velocidad máxima con la rueda o el trackpad, en px por segundo. */
  MAX_SPEED: 800,
  /** Margen de ráfaga: lo que se puede avanzar de golpe antes de que rija el límite, en px. */
  BURST: 120,
  /** Duración del deslizamiento de cada empuje, en segundos (la normal de la página es 1,2). */
  DURATION: 1.6,
};

interface LimiterConfig {
  maxSpeed: number;
  burst: number;
}

/**
 * Presupuesto de scroll que se recarga con el tiempo (un «cubo con fuga»): cada gesto pide una distancia y recibe lo que
 * cabe. Con la rueda girando sin parar, el avance queda en `maxSpeed` px por segundo, sin importar cuánto pida.
 */
export function createSpeedLimiter({ maxSpeed, burst }: LimiterConfig, now: () => number = () => performance.now()) {
  let budget = burst;
  let last = now();
  return (wanted: number): number => {
    const current = now();
    budget = Math.min(burst, budget + ((current - last) / 1000) * maxSpeed);
    last = current;
    const allowed = Math.min(wanted, budget);
    budget -= allowed;
    return allowed;
  };
}

/** Escenas que piden scroll pesado ahora mismo; el límite rige mientras haya al menos una. */
const active = new Set<string>();
/** El gancho que tenía cada Lenis antes de instalar el límite, para devolverlo al salir. */
const previous = new WeakMap<Lenis, Lenis["options"]["virtualScroll"]>();

/**
 * Activa o desactiva el scroll pesado de la escena `id`. El límite se instala con la primera escena activa y se retira
 * cuando ya no queda ninguna, así dos escenas seguidas no dejan uno pegado de la anterior.
 */
export function setHeavyScroll(lenis: Lenis | null, id: string, on: boolean, config: LimiterConfig & { duration: number } = {
  maxSpeed: HEAVY_SCROLL.MAX_SPEED,
  burst: HEAVY_SCROLL.BURST,
  duration: HEAVY_SCROLL.DURATION,
}): void {
  if (!lenis) return;
  if (on) active.add(id);
  else active.delete(id);

  if (active.size > 0 && !previous.has(lenis)) {
    previous.set(lenis, lenis.options.virtualScroll);
    const limit = createSpeedLimiter(config);
    lenis.options.virtualScroll = ({ deltaY, event }) => {
      // Solo la rueda y el trackpad; el zoom con la rueda (Ctrl) y los gestos horizontales los atiende Lenis como siempre
      if (event.type !== "wheel" || event.ctrlKey || deltaY === 0 || !event.cancelable) return true;
      event.preventDefault();
      const allowed = limit(Math.abs(deltaY));
      if (allowed > 0) {
        // `programmatic: false`, como en el camino propio de Lenis: así `targetScroll` se acumula empuje a empuje. Con el
        // valor por defecto, cada empuje partiría de la posición animada (que va atrasada) y casi no avanzaría.
        lenis.scrollTo(lenis.targetScroll + Math.sign(deltaY) * allowed, {
          programmatic: false,
          duration: config.duration,
          easing: lenis.options.easing,
        });
      }
      // Ya se atendió aquí: Lenis no debe volver a procesar el mismo gesto
      return false;
    };
  } else if (active.size === 0 && previous.has(lenis)) {
    lenis.options.virtualScroll = previous.get(lenis);
    previous.delete(lenis);
  }
}
