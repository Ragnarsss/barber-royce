import { motion } from "framer-motion";
import { useMemo } from "react";
import { Camera } from "lucide-react";
import styles from "./SocialProof2.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { fadeInUp, scaleIn, staggerContainer } from "@/config/animations.config";

export function SocialProof2() {
  const { ref, controls } = useScrollAnimation();
  const { direction, velocity } = useLenisScroll();

  // Usar hook optimizado para parallax en lugar de recrear transforms manualmente
  const { ref: sectionRef, layers } = useParallaxLayers<HTMLElement>();

  // Memoizar estilos condicionales para optimizar performance
  const hexMiddle2Style = useMemo(
    () => ({ opacity: direction === 1 ? 0.6 : 0.4 }),
    [direction]
  );

  const hexFast1Style = useMemo(
    () => ({ scale: velocity > 2 ? 1.1 : 1 }),
    [velocity]
  );

  const hexFg2Style = useMemo(
    () => ({ x: direction === 1 ? "10px" : "-10px" }),
    [direction]
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
        style={{ y: layers.background.y, scale: layers.background.scale }}
      />
      <motion.div
        className={styles.hexagonBg2}
        style={{ y: layers.background.y, scale: layers.background.scale }}
      />

      {/* Capa media - hexágonos medianos con rotación */}
      <motion.div
        className={styles.hexagonMiddle1}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
      />
      <motion.div
        className={styles.hexagonMiddle2}
        style={{
          y: layers.middle.y,
          rotate: layers.middle.rotate,
          ...hexMiddle2Style,
        }}
      />
      <motion.div
        className={styles.hexagonMiddle3}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
      />

      {/* Capa rápida - hexágonos pequeños con movimiento dinámico */}
      <motion.div
        className={styles.hexagonFast1}
        style={{
          y: layers.fast.y,
          x: layers.fast.x,
          ...hexFast1Style,
        }}
      />
      <motion.div
        className={styles.hexagonFast2}
        style={{
          y: layers.fast.y,
          x: layers.fast.x,
        }}
      />
      <motion.div
        className={styles.hexagonFast3}
        style={{
          y: layers.fast.y,
          x: layers.fast.x,
        }}
      />

      {/* Capa frontal - elementos decorativos pequeños */}
      <motion.div
        className={styles.hexagonFg1}
        style={{
          y: layers.foreground.y,
          scale: layers.foreground.scale,
        }}
      />
      <motion.div
        className={styles.hexagonFg2}
        style={{
          y: layers.foreground.y,
          scale: layers.foreground.scale,
          ...hexFg2Style,
        }}
      />

      {/* Hexágono principal decorativo */}
      <motion.div
        className={styles.hexagon}
        style={{
          y: layers.slow.y,
          rotate: layers.middle.rotate,
        }}
      />

      {/* ═══════════════════════════════════════════════
          CONTENIDO PRINCIPAL
      ═══════════════════════════════════════════════ */}

      <motion.div
        className={styles.container}
        style={{ y: layers.slow.y }}
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
