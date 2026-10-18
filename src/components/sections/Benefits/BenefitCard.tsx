import { motion, useTransform, type MotionValue } from "framer-motion";
import type { Benefit } from "@/data/benefitsData";
import styles from "./Benefits.module.css";
import { DrawnIcon } from "./DrawnIcon";
import { cardProgress, cardScale, drawProgress, heartbeatScale, sharpness, spinAngle } from "./reveal";

interface BenefitCardProps {
  benefit: Benefit;
  /** Posición de la tarjeta en la grilla: cada una arranca un poco después de la anterior. */
  index: number;
  /** Avance del scroll sobre la grilla, de 0 a 1. */
  progress: MotionValue<number>;
  /** Con `false` (reducir movimiento) la tarjeta se pinta de frente, nítida y quieta. */
  animated: boolean;
}

/**
 * Tarjeta de «Estilo que te acompaña» con el revelado ligado al scroll (BR-074, HU-EXP-004 CA-25). Está siempre a la
 * vista, borrosa, hasta que le toca su tramo del scroll (cada tarjeta tiene el suyo, una después de otra): entonces
 * gira 360° sobre su eje vertical, su contenido pasa de desenfocado a nítido, el ícono se dibuja y da un latido.
 * Todo sigue el avance del scroll: al subir de nuevo, se deshace. El desenfoque no se anima: hay una copia ya
 * desenfocada del texto, decorativa (`aria-hidden`) y de radio fijo, y solo se cruzan las opacidades.
 */
export function BenefitCard({ benefit, index, progress, animated }: BenefitCardProps) {
  // Avance propio de esta tarjeta; todo lo demás sale de él
  const own = useTransform(progress, (value) => cardProgress(value, index));
  const rotateY = useTransform(own, spinAngle);
  const scale = useTransform(own, cardScale);
  const sharp = useTransform(own, sharpness);
  const blur = useTransform(own, (t) => 1 - sharpness(t));
  const draw = useTransform(own, drawProgress);
  const beat = useTransform(own, heartbeatScale);

  const description = benefit.description.map((part, i) => (typeof part === "string" ? part : <strong key={i}>{part.strong}</strong>));

  if (!animated) {
    return (
      <article className={styles.card} data-benefit>
        <div className={styles.cardBody}>
          <h3 className={styles.cardTitle}>{benefit.title}</h3>
          <div className={styles.cardIcon}>
            <DrawnIcon name={benefit.icon} />
          </div>
          <div className={styles.accent} />
          <p className={styles.cardDescription}>{description}</p>
        </div>
      </article>
    );
  }

  return (
    <motion.article className={styles.card} style={{ rotateY, scale, transformPerspective: 900 }} data-benefit>
      <motion.div className={styles.cardBody} style={{ opacity: sharp }}>
        <h3 className={styles.cardTitle}>{benefit.title}</h3>
        <motion.div className={styles.cardIcon} style={{ scale: beat }}>
          <DrawnIcon name={benefit.icon} progress={draw} />
        </motion.div>
        <div className={styles.accent} />
        <p className={styles.cardDescription}>{description}</p>
      </motion.div>
      {/* Copia desenfocada del texto, encima del contenido nítido; sin ícono, que se dibuja aparte, pero reserva su lugar */}
      <motion.div className={styles.cardBlur} aria-hidden="true" style={{ opacity: blur }} data-card-blur>
        <div className={styles.cardTitle}>{benefit.title}</div>
        <div className={styles.cardIcon} />
        <div className={styles.accent} />
        <p className={styles.cardDescription}>{description}</p>
      </motion.div>
    </motion.article>
  );
}
