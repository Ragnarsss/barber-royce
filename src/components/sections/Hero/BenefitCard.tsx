import type { ReactElement } from "react";
import { motion, useTransform, type MotionValue } from "framer-motion";
import styles from "./Hero.module.css";
import { fadeInLeft } from "@/config/animations.config";
import { cardDepthRange } from "./cards";

interface BenefitCardProps {
  icon: ReactElement;
  text: string;
  index: number;
  /** Avance del scroll del hero (0 arriba, 1 cuando el hero salió de pantalla). */
  progress: MotionValue<number>;
  /** Profundidad al hacer scroll: solo en escritorio y sin reducir movimiento. */
  depth: boolean;
}

/** Tarjeta de beneficio del hero (BR-056). Su entrada es la del hero; el scroll la desplaza según su capa. */
export function BenefitCard({ icon, text, index, progress, depth }: BenefitCardProps) {
  const y = useTransform(progress, [0, 1], cardDepthRange(index));

  return (
    <motion.div
      className={styles.benefit}
      variants={fadeInLeft}
      style={depth ? { y } : undefined}
      data-benefit
      data-depth={depth ? "on" : "off"}
    >
      <div className={styles.benefitIcon}>{icon}</div>
      <p className={styles.benefitText}>{text}</p>
    </motion.div>
  );
}
