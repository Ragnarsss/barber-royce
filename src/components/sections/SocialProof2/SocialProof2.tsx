import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Camera } from "lucide-react";
import styles from "./SocialProof2.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  parallaxLayers,
} from "@/lib/animations";

// ✅ React 19: Eliminado memo() - bailout automático
export function SocialProof2() {
  const { ref, controls } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const { direction, velocity } = useLenisScroll();

  // Parallax effect para múltiples capas
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Contenedor principal - movimiento suave
  const containerY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.slow.y,
  );

  // Capa de fondo - muy lenta
  const bgLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.y,
  );
  const bgLayerScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.scale,
  );

  // Capa media - velocidad normal con rotación
  const middleLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.y,
  );
  const middleLayerRotate = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.rotate,
  );

  // Capa rápida - movimiento dinámico
  const fastLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.fast.y,
  );
  const fastLayerX = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.fast.x,
  );

  // Capa frontal - muy rápida
  const fgLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.y,
  );
  const fgLayerScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.scale,
  );

  return (
    <section
      id="social-proof-2"
      className={styles.socialProof}
      ref={sectionRef}
    >
      {/* ═══════════════════════════════════════════════
          CAPAS DE FONDO - Decoración con parallax
      ═══════════════════════════════════════════════ */}

      {/* Capa ultra fondo - hexágonos grandes */}
      <motion.div
        className={styles.hexagonBg1}
        style={{ y: bgLayerY, scale: bgLayerScale }}
      />
      <motion.div
        className={styles.hexagonBg2}
        style={{ y: bgLayerY, scale: bgLayerScale }}
      />

      {/* Capa media - hexágonos medianos con rotación */}
      <motion.div
        className={styles.hexagonMiddle1}
        style={{ y: middleLayerY, rotate: middleLayerRotate }}
      />
      <motion.div
        className={styles.hexagonMiddle2}
        style={{
          y: middleLayerY,
          rotate: middleLayerRotate,
          // Reacciona a la dirección del scroll
          opacity: direction === 1 ? 0.6 : 0.4,
        }}
      />
      <motion.div
        className={styles.hexagonMiddle3}
        style={{ y: middleLayerY, rotate: middleLayerRotate }}
      />

      {/* Capa rápida - hexágonos pequeños con movimiento dinámico */}
      <motion.div
        className={styles.hexagonFast1}
        style={{
          y: fastLayerY,
          x: fastLayerX,
          // Efecto de velocidad
          scale: velocity > 2 ? 1.1 : 1,
        }}
      />
      <motion.div
        className={styles.hexagonFast2}
        style={{
          y: fastLayerY,
          x: fastLayerX,
        }}
      />
      <motion.div
        className={styles.hexagonFast3}
        style={{
          y: fastLayerY,
          x: fastLayerX,
        }}
      />

      {/* Capa frontal - elementos decorativos pequeños */}
      <motion.div
        className={styles.hexagonFg1}
        style={{
          y: fgLayerY,
          scale: fgLayerScale,
        }}
      />
      <motion.div
        className={styles.hexagonFg2}
        style={{
          y: fgLayerY,
          scale: fgLayerScale,
          // Movimiento inverso según dirección
          x: direction === 1 ? "10px" : "-10px",
        }}
      />

      {/* Hexágono principal decorativo */}
      <motion.div
        className={styles.hexagon}
        style={{
          rotate: middleLayerRotate,
          scale: direction === -1 ? 1.05 : 1,
        }}
      />

      {/* ═══════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ═══════════════════════════════════════════════ */}

      <motion.div
        className={styles.container}
        style={{ y: containerY }}
        ref={ref}
      >
        <div className={styles.content}>
          <motion.div
            className={styles.textContent}
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
          >
            <h2 className={styles.title}>
              Clientes Felices,
              <br />
              Estilos Impecables.
            </h2>
            <p className={styles.subtitle}>
              El trabajo realizado y la felicidad en nuestros clientes es el
              verdadero pago. Tu satisfacción es nuestra mejor carta de
              presentación.
            </p>
          </motion.div>

          <motion.div
            className={styles.bentoGrid}
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
          >
            {/* Fila 1: 2 items grandes + imagen lateral */}
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoTall}`}
              variants={scaleIn}
            >
              <Camera size={48} strokeWidth={1.5} />
            </motion.div>

            {/* Fila 2: 2 items */}
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
