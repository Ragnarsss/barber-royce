/**
 * Barra de progreso que se llena mientras haces scroll
 * El progreso es un MotionValue: no re-renderiza al hacer scroll (BR-015)
 */

import { motion, useScroll } from "framer-motion";
import { useLocation } from "react-router-dom";
import styles from "./ScrollProgressBar.module.css";

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const location = useLocation();

  // Solo mostrar en el homepage
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <>
      <div className={styles.track} />
      <motion.div className={styles.bar} style={{ scaleX: scrollYProgress }} />
    </>
  );
};
