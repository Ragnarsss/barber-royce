import { useEffect, type RefObject } from "react";
import type { MotionValue } from "framer-motion";
import { particleAt, sampleParticles, type Particle } from "./brandParticles";

/** Colores de las partículas: los de la paleta de La Serena, leídos de los tokens (nunca un hex en el código). */
const PARTICLE_TOKENS = ["--color-leaf", "--color-earth", "--color-amber", "--color-wood"] as const;

interface Options {
  stageRef: RefObject<HTMLElement | null>;
  brandRef: RefObject<HTMLElement | null>;
  canvasRef: RefObject<HTMLCanvasElement | null>;
  /** Avance de la explosión (0..1), atado al scroll. */
  progress: MotionValue<number>;
  enabled: boolean;
  /** Escritorio: más partículas y más finas. */
  desktop: boolean;
}

/**
 * Dibuja la marca deshaciéndose en partículas (BR-114). El scroll llega como `MotionValue` y cada cambio solo redibuja el
 * lienzo: no hay `setState` por scroll. Se vuelve a muestrear al cambiar el tamaño del escenario y cuando cargan las fuentes.
 */
export function useBrandParticles({ stageRef, brandRef, canvasRef, progress, enabled, desktop }: Options): void {
  useEffect(() => {
    const stage = stageRef.current;
    const brand = brandRef.current;
    const canvas = canvasRef.current;
    if (!enabled || !stage || !brand || !canvas) return;
    const context = canvas.getContext?.("2d");
    if (!context) return;

    const rootStyle = getComputedStyle(document.documentElement);
    const colors = PARTICLE_TOKENS.map((token) => rootStyle.getPropertyValue(token).trim());
    let groups: Particle[][] = colors.map(() => []);
    let size = 1;
    let cancelled = false;

    const draw = (t: number) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      if (t <= 0 || t >= 1) return;
      groups.forEach((group, index) => {
        context.fillStyle = colors[index];
        for (const particle of group) {
          const { x, y, alpha } = particleAt(particle, t);
          if (alpha <= 0) continue;
          context.globalAlpha = alpha;
          context.fillRect(x, y, size, size);
        }
      });
      context.globalAlpha = 1;
    };

    // Muestrear cuesta (lee el layout y los píxeles): se hace recién al empezar la explosión, no al cargar, para no
    // sumar tareas largas en la carga (TBT). Después solo se repite si cambia el tamaño o termina de cargar la fuente.
    let sampled = false;

    const sample = () => {
      if (cancelled) return;
      sampled = true;
      const stageBox = stage.getBoundingClientRect();
      const { width, height } = stageBox;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      context.setTransform(ratio, 0, 0, ratio, 0, 0);

      // La marca se dibuja fuera de pantalla con la misma fuente, tamaño y posición que el texto real, en un lienzo del
      // tamaño de la marca (no de la pantalla): menos píxeles que leer.
      const brandBox = brand.getBoundingClientRect();
      const origin = { x: brandBox.left - stageBox.left, y: brandBox.top - stageBox.top };
      const offscreen = document.createElement("canvas");
      offscreen.width = Math.max(1, Math.round(brandBox.width));
      offscreen.height = Math.max(1, Math.round(brandBox.height));
      const ink = offscreen.getContext("2d", { willReadFrequently: true });
      if (!ink) return;
      ink.textBaseline = "middle";
      for (const part of brand.querySelectorAll<HTMLElement>("[data-particle-text]")) {
        const style = getComputedStyle(part);
        const box = part.getBoundingClientRect();
        ink.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
        if ("letterSpacing" in ink) ink.letterSpacing = style.letterSpacing === "normal" ? "0px" : style.letterSpacing;
        const label = style.textTransform === "uppercase" ? (part.textContent ?? "").toUpperCase() : (part.textContent ?? "");
        ink.fillText(label, box.left - brandBox.left, box.top - brandBox.top + box.height / 2);
      }

      const gap = desktop ? 4 : 3;
      size = gap * 0.75;
      const particles = sampleParticles(ink.getImageData(0, 0, offscreen.width, offscreen.height).data, offscreen.width, offscreen.height, {
        gap,
        colors: colors.length,
        center: { x: brandBox.width / 2, y: brandBox.height / 2 },
        spread: Math.max(width, height) * 0.7,
        max: desktop ? 4500 : 1800,
        random: Math.random,
      }).map((particle) => ({ ...particle, x: particle.x + origin.x, y: particle.y + origin.y }));
      groups = colors.map((_, index) => particles.filter((particle) => particle.color === index));
      draw(progress.get());
    };

    const onProgress = (t: number) => {
      if (t > 0 && !sampled) sample();
      draw(t);
    };

    const unsubscribe = progress.on("change", onProgress);
    // Si ya se muestreó con la fuente de respaldo, se repite con Fraunces cuando llegue.
    void document.fonts?.ready.then(() => sampled && sample());
    const observer = typeof ResizeObserver === "undefined" ? undefined : new ResizeObserver(() => sampled && sample());
    observer?.observe(stage);
    // La página puede abrirse ya desplazada (volver atrás): entonces la explosión ya empezó.
    onProgress(progress.get());

    return () => {
      cancelled = true;
      unsubscribe();
      observer?.disconnect();
    };
  }, [stageRef, brandRef, canvasRef, progress, enabled, desktop]);
}
