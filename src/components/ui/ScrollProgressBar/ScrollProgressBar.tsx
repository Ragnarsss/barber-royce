/**
 * Barra de progreso que se llena mientras haces scroll
 * El progreso es un MotionValue: no re-renderiza al hacer scroll (BR-015)
 */

import { motion, useScroll } from "framer-motion";
import { useLocation } from "react-router-dom";

export const ScrollProgressBar = () => {
  const { scrollYProgress } = useScroll();
  const location = useLocation();

  // Solo mostrar en el homepage
  if (location.pathname !== "/") {
    return null;
  }

  return (
    <>
      {/* Fondo de la barra (siempre visible) */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "rgba(255, 255, 255, 0.1)",
          zIndex: 9998,
        }}
      />
      {/* Barra de progreso */}
      <motion.div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          height: "4px",
          background: "linear-gradient(90deg, #d52323 0%, #fe0000 100%)",
          transformOrigin: "0%",
          scaleX: scrollYProgress,
          zIndex: 9999,
          boxShadow: "0 0 15px rgba(213, 35, 35, 0.6)",
        }}
      />
    </>
  );
};
