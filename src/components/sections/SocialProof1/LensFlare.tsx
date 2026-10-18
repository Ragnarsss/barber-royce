import type { CSSProperties } from "react";
import styles from "./LensFlare.module.css";

interface LensFlareProps {
  /**
   * De qué lado del punto de luz quedan los fantasmas: el lado ya revelado por el corte. En la foto, el corte avanza hacia
   * la derecha y deja la foto a la izquierda (`left`); en la tarjeta es al revés (`right`).
   */
  trail: "left" | "right";
  /** Sobre fondo oscuro, el núcleo es blanco cálido; sobre la tarjeta blanca sería invisible, así que es rojo. */
  tone: "dark" | "light";
}

/**
 * Fantasmas hexagonales del flare, alineados sobre un eje diagonal a partir de la luz: desplazamiento sobre el eje, alto
 * de la forma y cuánto del rojo de la marca llevan. Un lente real los dibuja con la forma de su diafragma, que muy a
 * menudo es hexagonal: por eso conversan con los hexágonos del fondo.
 */
const GHOSTS = [
  { distance: 7, size: 3.4, mix: "55%" },
  { distance: 12.5, size: 6.5, mix: "32%" },
  { distance: 19, size: 2.4, mix: "60%" },
  { distance: 27, size: 9.5, mix: "18%" },
];

/**
 * Lens flare decorativo (BR-076, HU-EXP-004 CA-27): núcleo, halo del rojo de la marca, el trazo horizontal típico de un
 * lente anamórfico y cuatro fantasmas hexagonales. Solo degradados y formas, sin `mix-blend-mode`: lo que se anima desde
 * fuera es su posición y su opacidad. Se ancla en un punto (su borde izquierdo o derecho, según `trail`), que es el borde
 * del panel de corte al que acompaña.
 */
export function LensFlare({ trail, tone }: LensFlareProps) {
  return (
    <span
      className={[styles.flare, trail === "right" ? styles.trailRight : "", tone === "light" ? styles.light : ""].filter(Boolean).join(" ")}
      aria-hidden="true"
      data-lens-flare
    >
      <span className={styles.halo} />
      <span className={styles.streak} />
      <span className={styles.core} />
      {GHOSTS.map((ghost, index) => (
        <span
          key={index}
          className={styles.ghost}
          style={{ "--ghost-distance": `${ghost.distance}rem`, "--ghost-size": `${ghost.size}rem`, "--ghost-mix": ghost.mix } as CSSProperties}
        />
      ))}
    </span>
  );
}
