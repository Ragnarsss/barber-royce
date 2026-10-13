import { motion, useTransform } from "framer-motion";
import styles from "./SocialProof1.module.css";
import socialProof560w from "@/assets/optimized/social_proof_560w.webp";
import socialProof1120w from "@/assets/optimized/social_proof_1120w.webp";
import socialProof1680w from "@/assets/optimized/social_proof_1680w.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxProgress, useBackgroundLayer, useMiddleLayer, useForegroundLayer, useSlowLayer, useFastLayer } from "@/hooks/useParallaxLayers";
import { useScrollDirection, useScrollSpeed } from "@/hooks/useScrollMotion";
import { SCROLL_SPEED_FAST } from "@/utils/scrollMotion";
import { siteText } from "@/content/siteContent";
import { useRefreshLenis } from "@/hooks/useLenisContext";
import { fadeInUp, fadeInLeft, fadeInRight } from "@/config/animations.config";

export function SocialProof1() {
  const { ref, controls } = useScrollAnimation();
  const direction = useScrollDirection();
  const speed = useScrollSpeed();
  const refreshLenis = useRefreshLenis();

  // Usar hook optimizado para parallax
  const { ref: sectionRef, scrollYProgress } = useParallaxProgress<HTMLElement>();
  const layers = {
    background: useBackgroundLayer(scrollYProgress),
    middle: useMiddleLayer(scrollYProgress),
    foreground: useForegroundLayer(scrollYProgress),
    slow: useSlowLayer(scrollYProgress),
    fast: useFastLayer(scrollYProgress),
  };

  // Rayos láser diagonales. Los que se mueven igual en x e y comparten un solo transform (BR-016)
  const diagonal1 = {
    x: useTransform(scrollYProgress, [0, 1], ["-100%", "100%"]),
    y: useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]),
  };
  const diagonal2Offset = useTransform(scrollYProgress, [0, 1], ["-80%", "120%"]);
  const diagonal2 = { x: diagonal2Offset, y: diagonal2Offset };
  const diagonal3Offset = useTransform(scrollYProgress, [0, 1], ["120%", "-120%"]);
  const diagonal3 = { x: diagonal3Offset, y: diagonal3Offset };
  const diagonal4Offset = useTransform(scrollYProgress, [0, 1], ["-60%", "140%"]);
  const diagonal4 = { x: diagonal4Offset, y: diagonal4Offset };
  const diagonal5 = {
    x: useTransform(scrollYProgress, [0, 1], ["100%", "-100%"]),
    y: useTransform(scrollYProgress, [0, 1], ["150%", "-150%"]),
  };

  // Movimiento personalizado para testimonial
  const testimonialY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", "8%"],
  );

  // Derivados de MotionValue: cambian sin re-renderizar (BR-015)
  const hexMiddle2Style = { opacity: useTransform(direction, (value) => (value === 1 ? 0.6 : 0.5)) };
  const hexFg1Style = { scale: useTransform(speed, (value) => (value > SCROLL_SPEED_FAST ? 1.1 : 1)) };

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
          <h2 className={styles.title}>{siteText("socialproof1.titulo")}</h2>
          <p className={styles.subtitle}>{siteText("socialproof1.subtitulo")}</p>
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
                <img
                  src={socialProof560w}
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
                  Cliente hace 5 años
                </strong>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
