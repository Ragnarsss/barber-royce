import { Link } from "react-router-dom";
import { useReducedMotion } from "framer-motion";
import { edgeDraw } from "@/config/animations.config";
import { trackReserve } from "@/analytics/track";
import { useBookingUrl } from "@/branch/useBookingUrl";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";
import { ROUTES } from "@/config/routes";
import { NEON_SQUARES } from "./heroLaSerenaShapes";
import styles from "./HeroLaSerena.module.css";

/** Una hoja estilizada: la silueta y su nervio central. Decorativa. */
function Leaf({ className }: { className: string }) {
  return (
    <svg className={`${styles.leaf} ${className}`} viewBox="0 0 60 120" aria-hidden="true" focusable="false">
      <path d="M30 118C8 90 4 50 30 4c26 46 22 86 0 114Z" />
      <path className={styles.vein} d="M30 118V22" />
    </svg>
  );
}

/**
 * Hero de la portada de La Serena (BR-106, HU-SUC-002 CA-04): cuatro cuadrados de neón solapados que se dibujan desde
 * cero, uno tras otro, y se encienden al cerrarse; hojas con un balanceo leve y una veta de madera en la base. Con
 * «reducir movimiento» los cuadrados aparecen completos y encendidos, y las hojas quedan quietas.
 */
export function HeroLaSerena() {
  const bookingUrl = useBookingUrl();
  const reducedMotion = useReducedMotion() ?? false;

  return (
    <section className={styles.hero} aria-labelledby="hero-la-serena-title">
      <div className={styles.squares} aria-hidden="true">
        {NEON_SQUARES.map(({ shape, left, top, size, delay }, index) => (
          <div
            key={index}
            className={styles.square}
            style={{ left: `${left}%`, top: `${top}%`, width: `${size}%`, "--delay": `${delay}s` } as React.CSSProperties}
          >
            <FixedShape
              shape={shape}
              edge={reducedMotion ? undefined : { initial: "hidden", animate: "visible", variants: edgeDraw(delay) }}
            />
          </div>
        ))}
      </div>

      <div className={styles.leaves} aria-hidden="true">
        <Leaf className={styles.leafA} />
        <Leaf className={styles.leafB} />
        <Leaf className={styles.leafC} />
      </div>
      <div className={styles.wood} aria-hidden="true" />

      <div className={styles.content}>
        <p className={styles.kicker}>La Serena</p>
        <h1 id="hero-la-serena-title" className={styles.title}>
          Royce Barbería, en un espacio sereno
        </h1>
        <p className={styles.subtitle}>Cortes clásicos y modernos, afeitado tradicional y una sala de madera, luz y plantas.</p>
        <div className={styles.actions}>
          <a className={styles.primary} href={bookingUrl} target="_blank" rel="noopener noreferrer" onClick={trackReserve("portada")}>
            Agendar Sesión
          </a>
          <Link className={styles.secondary} to={ROUTES.services.path}>
            Ver servicios
          </Link>
        </div>
      </div>
    </section>
  );
}
