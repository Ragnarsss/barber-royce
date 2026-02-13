import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./SocialProof1.module.css";
import socialProofImage from "@/assets/social_proof_1.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  parallaxLayers,
} from "@/lib/animations";

export const SocialProof1 = () => {
  const { ref, controls } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);

  // Configurar parallax scroll
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Transforms para hexágonos decorativos (diferentes velocidades)
  const bgHexY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.y,
  );
  const bgHexScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.scale,
  );

  const middleHexY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.y,
  );
  const middleHexRotate = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.rotate,
  );

  const fgHexY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.y,
  );

  // Hexágonos pequeños (movimiento rápido)
  const smallHexY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.fast.y,
  );
  const smallHexX = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.fast.x,
  );

  // Transforms para imagen y testimonial
  const imageY = useTransform(scrollYProgress, [0, 1], parallaxLayers.slow.y);
  const testimonialY = useTransform(scrollYProgress, [0, 1], ["0%", "8%"]);

  return (
    <section
      id="social-proof-1"
      className={styles.socialProof}
      ref={sectionRef}
    >
      {/* Hexágonos decorativos con parallax - Capa de fondo */}
      <motion.div
        className={styles.hexagonBackground1}
        style={{ y: bgHexY, scale: bgHexScale }}
      />
      <motion.div
        className={styles.hexagonBackground2}
        style={{ y: bgHexY, scale: bgHexScale }}
      />

      {/* Hexágonos decorativos - Capa media */}
      <motion.div
        className={styles.hexagonMiddle1}
        style={{ y: middleHexY, rotate: middleHexRotate }}
      />
      <motion.div
        className={styles.hexagonMiddle2}
        style={{ y: middleHexY, rotate: middleHexRotate }}
      />

      {/* Hexágono decorativo - Capa frontal */}
      <motion.div className={styles.hexagonForeground1} style={{ y: fgHexY }} />

      {/* Hexágonos pequeños adicionales */}
      <motion.div
        className={styles.hexagonSmall1}
        style={{ y: smallHexY, x: smallHexX }}
      />
      <motion.div
        className={styles.hexagonSmall2}
        style={{ y: smallHexY, x: smallHexX }}
      />

      <div className={styles.container} ref={ref}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <h2 className={styles.title}>Respaldados por los mejores</h2>
          <p className={styles.subtitle}>
            Sabemos lo importante que es el cuidado e imagen para quienes viven
            de ella. Desde hace años somos casa de destacados Artistas musicales
            y Deportistas, quienes nos eligen por nuestro talento y elogian la
            calidad y profesionalismo de nuestro servicio
          </p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.imageContainer}
            initial="hidden"
            animate={controls}
            variants={fadeInLeft}
            style={{ y: imageY }}
          >
            <div className={styles.imageFrame}>
              <img src={`${socialProofImage}`} className={styles.image}></img>
            </div>
          </motion.div>

          <motion.div
            className={styles.testimonialCard}
            initial="hidden"
            animate={controls}
            variants={fadeInRight}
            style={{ y: testimonialY }}
          >
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "Cuando necesito un corte que hable por sí solo, confío en Royce
                Barbería. Su profesionalismo y atención al detalle son
                inigualables."
              </p>
              <div className={styles.author}>
                <strong>DrefQuila</strong>
                <span>Artista Urbano Chileno</span>
                <strong className={styles.clientBadge}>
                  Cliente nuestro hace 5 años
                </strong>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
