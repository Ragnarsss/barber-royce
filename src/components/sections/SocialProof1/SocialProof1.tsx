import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./SocialProof1.module.css";
import socialProofImage from "@/assets/social_proof_1.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import {
  fadeInUp,
  fadeInLeft,
  fadeInRight,
  parallaxLayers,
} from "@/lib/animations";

export const SocialProof1 = () => {
  const { ref, controls } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const { direction, velocity } = useLenisScroll();

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

  // Rayos láser diagonales - movimiento combinado X e Y

  // RAYO DIAGONAL 1: Tipo "/" - de abajo-izquierda a arriba-derecha
  const diagonal1X = useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]);
  const diagonal1Y = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);

  // RAYO DIAGONAL 2: Tipo "\" - de arriba-izquierda a abajo-derecha
  const diagonal2X = useTransform(scrollYProgress, [0, 1], ["-80%", "120%"]);
  const diagonal2Y = useTransform(scrollYProgress, [0, 1], ["-80%", "120%"]);

  // RAYO DIAGONAL 3: Tipo "/" - más lento
  const diagonal3X = useTransform(scrollYProgress, [0, 1], ["120%", "-120%"]);
  const diagonal3Y = useTransform(scrollYProgress, [0, 1], ["120%", "-120%"]);

  // RAYO DIAGONAL 4: Tipo "\" - desde centro
  const diagonal4X = useTransform(scrollYProgress, [0, 1], ["-60%", "140%"]);
  const diagonal4Y = useTransform(scrollYProgress, [0, 1], ["-60%", "140%"]);

  // RAYO DIAGONAL 5: Tipo "/" - rápido
  const diagonal5X = useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]);
  const diagonal5Y = useTransform(scrollYProgress, [0, 1], ["150%", "-150%"]);

  return (
    <section
      id="social-proof-1"
      className={styles.socialProof}
      ref={sectionRef}
    >
      {/* ═══════════════════════════════════════════════
          RAYOS LÁSER DIAGONALES - Cruzados / y \
      ═══════════════════════════════════════════════ */}

      {/* Rayos tipo "/" - ascendentes de izquierda a derecha */}
      <motion.div
        className={styles.diagonalLaser1}
        style={{ x: diagonal1X, y: diagonal1Y }}
      />
      <motion.div
        className={styles.diagonalLaser3}
        style={{ x: diagonal3X, y: diagonal3Y }}
      />
      <motion.div
        className={styles.diagonalLaser5}
        style={{ x: diagonal5X, y: diagonal5Y }}
      />

      {/* Rayos tipo "\" - descendentes de izquierda a derecha */}
      <motion.div
        className={styles.diagonalLaser2}
        style={{ x: diagonal2X, y: diagonal2Y }}
      />
      <motion.div
        className={styles.diagonalLaser4}
        style={{ x: diagonal4X, y: diagonal4Y }}
      />

      {/* ═══════════════════════════════════════════════
          CAPA DE FONDO - Hexágonos grandes
      ═══════════════════════════════════════════════ */}
      <motion.div
        className={styles.hexagonBackground1}
        style={{ y: bgHexY, scale: bgHexScale }}
      />
      <motion.div
        className={styles.hexagonBackground2}
        style={{ y: bgHexY, scale: bgHexScale }}
      />
      <motion.div
        className={styles.hexagonBackground3}
        style={{ y: bgHexY, scale: bgHexScale }}
      />
      <motion.div
        className={styles.hexagonBackground4}
        style={{ y: bgHexY, scale: bgHexScale }}
      />

      {/* ═══════════════════════════════════════════════
          CAPA MEDIA - Hexágonos medianos con rotación
      ═══════════════════════════════════════════════ */}
      <motion.div
        className={styles.hexagonMiddle1}
        style={{ y: middleHexY, rotate: middleHexRotate }}
      />
      <motion.div
        className={styles.hexagonMiddle2}
        style={{
          y: middleHexY,
          rotate: middleHexRotate,
          opacity: direction === 1 ? 0.6 : 0.5,
        }}
      />
      <motion.div
        className={styles.hexagonMiddle3}
        style={{ y: middleHexY, rotate: middleHexRotate }}
      />
      <motion.div
        className={styles.hexagonMiddle4}
        style={{ y: middleHexY, rotate: middleHexRotate }}
      />

      {/* ═══════════════════════════════════════════════
          CAPA FRONTAL - Hexágonos destacados
      ═══════════════════════════════════════════════ */}
      <motion.div
        className={styles.hexagonForeground1}
        style={{ y: fgHexY, scale: velocity > 1 ? 1.1 : 1 }}
      />
      <motion.div className={styles.hexagonForeground2} style={{ y: fgHexY }} />

      {/* ═══════════════════════════════════════════════
          CAPA RÁPIDA - Hexágonos pequeños dinámicos
      ═══════════════════════════════════════════════ */}
      <motion.div
        className={styles.hexagonSmall1}
        style={{ y: smallHexY, x: smallHexX }}
      />
      <motion.div
        className={styles.hexagonSmall2}
        style={{ y: smallHexY, x: smallHexX }}
      />
      <motion.div
        className={styles.hexagonSmall3}
        style={{ y: smallHexY, x: smallHexX }}
      />
      <motion.div
        className={styles.hexagonSmall4}
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
