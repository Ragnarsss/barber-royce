import { useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform, type MotionValue } from "framer-motion";
import styles from "./SocialProof1.module.css";
import socialProof560w from "@/assets/optimized/social_proof_560w.webp";
import socialProof1120w from "@/assets/optimized/social_proof_1120w.webp";
import socialProof1680w from "@/assets/optimized/social_proof_1680w.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxProgress, useBackgroundLayer, useMiddleLayer, useForegroundLayer, useSlowLayer, useFastLayer } from "@/hooks/useParallaxLayers";
import { useScrollDirection, useScrollSpeed } from "@/hooks/useScrollMotion";
import { SCROLL_SPEED_FAST } from "@/utils/scrollMotion";
import { useSiteText } from "@/content/useSiteContent";
import { useRefreshLenis } from "@/hooks/useLenisContext";
import { fadeInUp, fadeInLeft, fadeInRight, laserCutOneShot } from "@/config/animations.config";
import { SITE } from "@/config/constants";
import { BOLT, LASER_CUT, boltWindow } from "./laserCut";

/** Haz corto que viaja por su pista diagonal con el scroll (BR-062). La pista rota por CSS; el haz se mueve en su eje. */
function LaserBolt({ index, progress }: { index: number; progress: MotionValue<number> }) {
  const x = useTransform(progress, boltWindow(index), BOLT.TRAVEL);
  return <motion.span className={styles.bolt} style={{ x }} />;
}

export function SocialProof1() {
  const siteText = useSiteText();
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

  // Corte láser cinematográfico con scrub (BR-062). En pantallas chicas los rayos se ocultan y el corte ocurre una
  // vez al entrar; con reducir movimiento, todo aparece revelado.
  const reducedMotion = useReducedMotion() ?? false;
  const [isWide] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(min-width: 769px)").matches === true);
  const scrub = isWide && !reducedMotion;
  // Cada corte sigue el scroll de su propio elemento: de asomar por abajo a llegar al centro de la pantalla
  const photoRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: photoProgress } = useScroll({ target: photoRef, offset: ["start end", "center center"] });
  const { scrollYProgress: cardProgress } = useScroll({ target: cardRef, offset: ["start end", "center center"] });
  const photoCutX = useTransform(photoProgress, LASER_CUT.PHOTO, ["0%", LASER_CUT.COVER_TRAVEL]);
  const cardCutX = useTransform(cardProgress, LASER_CUT.CARD, ["0%", LASER_CUT.COVER_TRAVEL_BACK]);
  const frameFlash = useTransform(photoProgress, LASER_CUT.FLASH, [0, 1, 0]);
  const underline = useTransform(scrollYProgress, LASER_CUT.UNDERLINE, [0, 1]);

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
      {/* Pistas láser diagonales con un haz que viaja por cada una al hacer scroll (BR-062) */}
      {Array.from({ length: BOLT.TRACKS }, (_, index) => (
        <div key={index} className={`${styles.laserTrack} ${styles[`laserTrack${index + 1}`]}`} aria-hidden="true" data-laser-track>
          {!reducedMotion && <LaserBolt index={index} progress={scrollYProgress} />}
        </div>
      ))}

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
          {/* Subrayado láser que se dibuja con el scroll (BR-062) */}
          <motion.span
            className={styles.titleUnderline}
            aria-hidden="true"
            data-title-underline
            style={reducedMotion ? undefined : { scaleX: underline }}
          />
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
            <div className={styles.imageFrame} ref={photoRef}>
              {/* El marco rojo se enciende una vez cuando el láser termina de cortar la foto */}
              {!reducedMotion && (
                <motion.div className={styles.frameFlash} aria-hidden="true" style={{ opacity: scrub ? frameFlash : 0 }} />
              )}
              <div className={styles.imageClip}>
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
                  alt={`Cliente satisfecho en ${SITE.name}`}
                  width="560"
                  height="330"
                  onLoad={refreshLenis}
                />
              </picture>
              {/* Panel del color del fondo que se retira en diagonal, con el láser en su borde (BR-062) */}
              {!reducedMotion && (
                <motion.div
                  className={styles.cutCover}
                  aria-hidden="true"
                  data-cut="photo"
                  style={scrub ? { x: photoCutX, skewX: -18 } : { skewX: -18 }}
                  initial={scrub ? false : "hidden"}
                  animate={scrub ? undefined : controls}
                  variants={scrub ? undefined : laserCutOneShot(LASER_CUT.COVER_TRAVEL)}
                />
              )}
              </div>
            </div>
          </motion.div>

          <motion.div
            ref={cardRef}
            className={styles.testimonialCard}
            initial="hidden"
            animate={controls}
            variants={fadeInRight}
            style={{ y: testimonialY }}
          >
            {/* Corte cruzado de la tarjeta, desde el lado contrario: con el de la foto dibujan una X (BR-062) */}
            {!reducedMotion && (
              <motion.div
                className={`${styles.cutCover} ${styles.cutCoverCard}`}
                aria-hidden="true"
                data-cut="card"
                style={scrub ? { x: cardCutX, skewX: 18 } : { skewX: 18 }}
                initial={scrub ? false : "hidden"}
                animate={scrub ? undefined : controls}
                variants={scrub ? undefined : laserCutOneShot(LASER_CUT.COVER_TRAVEL_BACK)}
              />
            )}
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "Cuando necesito un corte que hable por sí solo, confío en {SITE.name}. Su profesionalismo y atención
                al detalle son inigualables."
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
