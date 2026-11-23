/**
 * Barra de progreso que se llena mientras haces scroll
 * El progreso es un MotionValue: no re-renderiza al hacer scroll (BR-015)
 */

import { motion, useScroll } from "framer-motion";
import { useLocation } from "react-router-dom";
import { BRANCHES } from "@/config/branches";
import styles from "./ScrollProgressBar.module.css";

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const location = useLocation();

  // Solo en las portadas de cada sucursal (BR-106): `/` es el selector, de una sola pantalla, sin scroll
  if (!BRANCHES.some((branch) => location.pathname === `/${branch}`)) {
    return null;
  }

  return (
    <>
      <div className={styles.track} />
      <motion.div className={styles.bar} style={{ scaleX: scrollYProgress }} />
    </>
  );
};
