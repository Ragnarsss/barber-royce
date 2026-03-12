import { motion, useTransform } from "framer-motion";
import styles from "./SocialProof1.module.css";
import socialProof560w from "@/assets/optimized/social_proof_560w.webp";
import socialProof1120w from "@/assets/optimized/social_proof_1120w.webp";
import socialProof1680w from "@/assets/optimized/social_proof_1680w.webp";
import socialProofAvif from "@/assets/optimized/social_proof_560w.avif";
import socialProofImage from "@/assets/social_proof_1.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useRefreshLenis } from "@/contexts/LenisContext";
import { fadeInUp, fadeInLeft, fadeInRight } from "@/config/animations.config";

export function SocialProof1() {
  const { ref, controls } = useScrollAnimation();
  const { direction, velocity } = useLenisScroll();
  const refreshLenis = useRefreshLenis();

  // Usar hook optimizado para parallax
  const { ref: sectionRef, layers } = useParallaxLayers<HTMLElement>();

  // Rayos láser diagonales - configuraciones centralizadas
  const diagonal1 = {
    x: useTransform(layers.scrollYProgress, [0, 1], ["-100%", "100%"]),
    y: useTransform(layers.scrollYProgress, [0, 1], ["100%", "-100%"]),
  };
  const diagonal2 = {
    x: useTransform(layers.scrollYProgress, [0, 1], ["-80%", "120%"]),
    y: useTransform(layers.scrollYProgress, [0, 1], ["-80%", "120%"]),
  };
  const diagonal3 = {
    x: useTransform(layers.scrollYProgress, [0, 1], ["120%", "-120%"]),
    y: useTransform(layers.scrollYProgress, [0, 1], ["120%", "-120%"]),
  };
  const diagonal4 = {
    x: useTransform(layers.scrollYProgress, [0, 1], ["-60%", "140%"]),
    y: useTransform(layers.scrollYProgress, [0, 1], ["-60%", "140%"]),
  };
  const diagonal5 = {
    x: useTransform(layers.scrollYProgress, [0, 1], ["100%", "-100%"]),
    y: useTransform(layers.scrollYProgress, [0, 1], ["150%", "-150%"]),
  };

  // Movimiento personalizado para testimonial
  const testimonialY = useTransform(layers.scrollYProgress, [0, 1], ["0%", "8%"]);

  // React 19: Estilos condicionales optimizados automáticamente por el compiler
  const hexMiddle2Style = { opacity: direction === 1 ? 0.6 : 0.5 };
  const hexFg1Style = { scale: velocity > 1 ? 1.1 : 1 };

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
        style={{ x: diagonal1.x, y: diagonal1.y }}
      />
      <motion.div
        className={styles.diagonalLaser3}
        style={{ x: diagonal3.x, y: diagonal3.y }}
      />
      <motion.div
        className={styles.diagonalLaser5}
        style={{ x: diagonal5.x, y: diagonal5.y }}
      />

      {/* Rayos tipo "\" - descendentes de izquierda a derecha */}
      <motion.div
        className={styles.diagonalLaser2}
        style={{ x: diagonal2.x, y: diagonal2.y }}
      />
      <motion.div
        className={styles.diagonalLaser4}
        style={{ x: diagonal4.x, y: diagonal4.y }}
      />

      {/* ═══════════════════════════════════════════════
          CAPA DE FONDO - Hexágonos grandes
      ═══════════════════════════════════════════════ */}
      <motion.div
        className={styles.hexagonBackground1}
        style={{ y: layers.background.y, scale: layers.background.scale }}
      />
      <motion.div
        className={styles.hexagonBackground2}
        style={{ y: layers.background.y, scale: layers.background.scale }}
      />
      <motion.div
        className={styles.hexagonBackground3}
        style={{ y: layers.background.y, scale: layers.background.scale }}
      />
      <motion.div
        className={styles.hexagonBackground4}
        style={{ y: layers.background.y, scale: layers.background.scale }}
      />

      {/* ═══════════════════════════════════════════════
          CAPA MEDIA - Hexágonos medianos con rotación
      ═══════════════════════════════════════════════ */}
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
      <motion.div
        className={styles.hexagonMiddle4}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
      />

      {/* ═══════════════════════════════════════════════
          CAPA FRONTAL - Hexágonos destacados
      ═══════════════════════════════════════════════ */}
      <motion.div
        className={styles.hexagonForeground1}
        style={{ y: layers.foreground.y, ...hexFg1Style }}
      />
      <motion.div
        className={styles.hexagonForeground2}
        style={{ y: layers.foreground.y }}
      />

      {/* ═══════════════════════════════════════════════
          CAPA RÁPIDA - Hexágonos pequeños dinámicos
      ═══════════════════════════════════════════════ */}
      <motion.div
        className={styles.hexagonSmall1}
        style={{ y: layers.fast.y, x: layers.fast.x }}
      />
      <motion.div
        className={styles.hexagonSmall2}
        style={{ y: layers.fast.y, x: layers.fast.x }}
      />
      <motion.div
        className={styles.hexagonSmall3}
        style={{ y: layers.fast.y, x: layers.fast.x }}
      />
      <motion.div
        className={styles.hexagonSmall4}
        style={{ y: layers.fast.y, x: layers.fast.x }}
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
            style={{ y: layers.slow.y }}
          >
            <div className={styles.imageFrame}>
              <picture>
                <source
                  srcSet={`${socialProof560w} 560w, ${socialProof1120w} 1120w, ${socialProof1680w} 1680w`}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px"
                  type="image/webp"
                />
                <source
                  srcSet={socialProofAvif}
                  type="image/avif"
                />
                <img
                  src={socialProofImage}
                  className={styles.image}
                  loading="lazy"
                  alt="Cliente satisfecho en Royce Barbería"
                  width="560"
                  height="330"
                  onLoad={refreshLenis}
                />
              </picture>
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
}
