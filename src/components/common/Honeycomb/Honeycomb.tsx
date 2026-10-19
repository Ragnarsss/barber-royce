import { useRef, useState, type CSSProperties, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { defaultViewport, scaleIn } from "@/config/animations.config";
import { MEDIA } from "@/config/breakpoints";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import type { CellPlacement, GridSize } from "./honeycombLayout";
import styles from "./Honeycomb.module.css";

export interface HoneycombItem {
  key: string;
  image: string;
  imageAlt: string;
  /** Alto de la foto original, para reservar su proporción (el ancho es siempre 400). */
  imageHeight?: number;
  /** Nombre accesible del botón. */
  label: string;
  /** Lo que se ve al pasar el cursor o enfocar: una línea grande y otra pequeña. */
  title: string;
  subtitle: string;
  /** Hexágono más grande con marco rojo (el líder del equipo). */
  isLead?: boolean;
  /** La foto decide el LCP: sin animación de entrada y pedida con prioridad alta. */
  eager?: boolean;
  /** La foto se desplaza dentro de su hexágono con el scroll (solo en escritorio y sin reducir movimiento, BR-089). */
  parallax?: boolean;
  /** Encendido de un lote nuevo (BR-089): el marco se ilumina una vez tras estos milisegundos. Sin valor, no se enciende. */
  igniteDelay?: number;
  desktop: CellPlacement;
  mobile: CellPlacement;
  onSelect?: () => void;
}

/** Hexágono gris de relleno: reserva su lugar mientras llegan más elementos (BR-068). No es interactivo. */
export interface HoneycombPlaceholder {
  key: string;
  placeholder: true;
  desktop: CellPlacement;
  mobile: CellPlacement;
}

interface HoneycombProps {
  items: (HoneycombItem | HoneycombPlaceholder)[];
  desktop: GridSize;
  mobile: GridSize;
}

const ENTRANCE_STAGGER = 0.08;

/** El escalonado de la entrada se reinicia cada tantos hexágonos: los de un lote nuevo no esperan a los de los anteriores. */
const STAGGER_GROUP = 6;

/** Variables de posición de la celda; el CSS usa las de móvil o las de escritorio según el ancho. */
const placementVars = (desktop: CellPlacement, mobile: CellPlacement) =>
  ({
    "--d-col": desktop.col,
    "--d-row": desktop.row,
    "--d-cols": desktop.cols,
    "--d-rows": desktop.rows,
    "--m-col": mobile.col,
    "--m-row": mobile.row,
    "--m-cols": mobile.cols,
    "--m-rows": mobile.rows,
  }) as CSSProperties;

/**
 * Panal de hexágonos (BR-060, BR-067, HU-EXP-004 CA-12 y CA-18). Cada hexágono es un botón con marco blanco (rojo y
 * más grande el del líder); al pasar el cursor o enfocarlo se ve su título y el marco se enciende como un tubo de
 * neón. La posición de cada celda la calcula `honeycombLayout.ts`, de modo que todos quedan a la misma distancia.
 */
export const Honeycomb = ({ items, desktop, mobile }: HoneycombProps) => {
  const reducedMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery(MEDIA.desktop);
  const gridVars = {
    "--d-grid-cols": desktop.cols,
    "--d-grid-rows": desktop.rows,
    "--m-grid-cols": mobile.cols,
    "--m-grid-rows": mobile.rows,
  } as CSSProperties;

  return (
    <ul className={styles.honeycomb} style={gridVars}>
      {items.map((item, index) =>
        "placeholder" in item ? (
          <li key={item.key} className={styles.cell} style={placementVars(item.desktop, item.mobile)} aria-hidden="true">
            <span className={styles.ghost} />
          </li>
        ) : (
          <HoneycombCell
            key={item.key}
            item={item}
            index={index}
            reducedMotion={reducedMotion}
            parallax={Boolean(item.parallax) && isDesktop && !reducedMotion}
          />
        ),
      )}
    </ul>
  );
};

/** La foto sube y baja ±6 % de su alto dentro del hexágono mientras este cruza la pantalla; el hexágono no se mueve. */
const PARALLAX_SHIFT = ["-6%", "6%"];

/**
 * Capa de la foto con parallax (BR-089). Es más alta que el hexágono (116 %) para que, al desplazarse, nunca deje ver
 * el borde. Solo anima `transform`, ligada a un `MotionValue`: ni `setState` ni layout por scroll.
 */
const ParallaxLayer = ({ children }: { children: ReactNode }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], PARALLAX_SHIFT);

  return (
    <span ref={ref} className={styles.parallaxFrame}>
      <motion.span className={styles.parallaxLayer} style={{ y }}>
        {children}
      </motion.span>
    </span>
  );
};

interface HoneycombCellProps {
  item: HoneycombItem;
  index: number;
  reducedMotion: boolean;
  parallax: boolean;
}

/**
 * Un hexágono. Si no hay foto, o la dirección falla (las de Unsplash a veces dan 404), el hexágono no queda como una
 * figura vacía: muestra su título y subtítulo de forma permanente en vez de solo al pasar el cursor.
 */
const HoneycombCell = ({ item, index, reducedMotion, parallax }: HoneycombCellProps) => {
  const [broken, setBroken] = useState(false);
  const noPhoto = !item.image || broken;
  const igniting = item.igniteDelay !== undefined && !reducedMotion;

  const photo = (
    <img
      src={item.image}
      alt={item.imageAlt}
      width="400"
      height={item.imageHeight ?? 400}
      loading={item.eager ? "eager" : "lazy"}
      fetchPriority={item.eager ? "high" : "auto"}
      decoding={item.eager ? "sync" : "async"}
      onError={() => setBroken(true)}
    />
  );

  return (
    <motion.li
      className={`${styles.cell} ${item.isLead ? styles.lead : ""}`}
      style={{
        ...placementVars(item.desktop, item.mobile),
        ...(igniting ? ({ "--ignite-delay": `${item.igniteDelay}ms` } as CSSProperties) : null),
      }}
      variants={scaleIn}
      // La foto que decide el LCP aparece sin animación de entrada (con opacidad 0 Chrome no la cuenta hasta que
      // termina). El resto entra escalonado.
      initial={reducedMotion || item.eager ? false : "hidden"}
      whileInView="visible"
      viewport={defaultViewport}
      transition={{ delay: (index % STAGGER_GROUP) * ENTRANCE_STAGGER }}
      data-lead={item.isLead || undefined}
      data-ignite={igniting || undefined}
    >
      <button type="button" className={styles.hex} onClick={item.onSelect} aria-label={item.label} data-empty={noPhoto || undefined}>
        <span className={styles.frame} aria-hidden="true">
          <span className={styles.photo}>{!noPhoto && (parallax ? <ParallaxLayer>{photo}</ParallaxLayer> : photo)}</span>
          <span className={styles.caption}>
            <span className={styles.title}>{item.title}</span>
            <span className={styles.subtitle}>{item.subtitle}</span>
          </span>
        </span>
      </button>
    </motion.li>
  );
};
