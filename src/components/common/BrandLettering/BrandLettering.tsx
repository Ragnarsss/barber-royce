import { motion } from "framer-motion";
import { useId, type SVGAttributes } from "react";
import { wordmarkDraw } from "@/config/animations.config";
import { LETTERING_NAME_PATHS, LETTERING_PREFIX_PATHS, LETTERING_VIEWBOX } from "./letteringPaths";
import styles from "./BrandLettering.module.css";

/**
 * - `none`: quieto y completo (el pie, y los hero con «reducir movimiento»).
 * - `play`: cada letra se traza y se rellena sola al montarse (hero de La Serena).
 * - `inherit`: usa las etiquetas `hidden` y `visible` del ancestro con animación, así espera al loader (hero de Coquimbo).
 */
type LetteringAnimation = "none" | "play" | "inherit";

interface BrandLetteringProps extends Omit<SVGAttributes<SVGSVGElement>, "viewBox" | "children" | "aria-hidden" | "focusable"> {
  animation?: LetteringAnimation;
  /** Un destello del color de marca que cruza «Royce» una vez, recortado a la forma de las letras (hero de Coquimbo). */
  shine?: boolean;
}

/**
 * El lettering «Barbería Royce» del dueño, dibujado en vector (BR-114, BR-122). Es decorativo: quien lo use pone el nombre en
 * texto para los lectores de pantalla (`SITE.brand`). Los colores salen de `--lettering-prefix-color` y
 * `--lettering-name-color`, que el uso define con los tokens de su sucursal; sin ellas, el café de apoyo y el color de marca.
 */
export function BrandLettering({ animation = "none", shine = false, className, ...rest }: BrandLetteringProps) {
  const id = useId();
  const classes = className ? `${styles.lettering} ${className}` : styles.lettering;
  const letter = (d: string, index: number, offset: number, group: string) =>
    animation === "none" ? (
      <path key={`${group}${index}`} d={d} />
    ) : (
      <motion.path
        key={`${group}${index}`}
        d={d}
        custom={offset + index}
        variants={wordmarkDraw}
        {...(animation === "play" ? { initial: "hidden", animate: "visible" } : {})}
      />
    );

  return (
    <svg {...rest} className={classes} viewBox={LETTERING_VIEWBOX} aria-hidden="true" focusable="false">
      <g className={styles.prefix}>{LETTERING_PREFIX_PATHS.map((d, index) => letter(d, index, 0, "p"))}</g>
      <g className={styles.name}>{LETTERING_NAME_PATHS.map((d, index) => letter(d, index, LETTERING_PREFIX_PATHS.length, "n"))}</g>
      {shine && (
        <g data-shine clipPath={`url(#${id}-clip)`}>
          <clipPath id={`${id}-clip`}>
            {LETTERING_NAME_PATHS.map((d, index) => (
              <path key={index} d={d} />
            ))}
          </clipPath>
          <linearGradient id={`${id}-gradient`}>
            <stop offset="0" className={styles.shineStop} stopOpacity="0" />
            <stop offset="0.5" className={styles.shineStop} stopOpacity="1" />
            <stop offset="1" className={styles.shineStop} stopOpacity="0" />
          </linearGradient>
          <rect className={styles.shineBar} x="3.4" y="74.3" width="90" height="123.4" fill={`url(#${id}-gradient)`} />
        </g>
      )}
    </svg>
  );
}
