import { motion, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
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
import { FocusText } from "@/components/common/FocusText/FocusText";
import { usePinnedScene } from "@/hooks/usePinnedScene";
import { ramp } from "@/utils/scrollReveal";
import { BOLT, LASER_CUT, REVEAL, boltWindow } from "./laserCut";

const PHOTO_SRCSET = `${socialProof560w} 560w, ${socialProof1120w} 1120w, ${socialProof1680w} 1680w`;
const PHOTO_SIZES = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 560px";

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

  // Corte láser cinematográfico con scrub (BR-062) y, desde BR-075, con la sección fija en pantalla en escritorio: todo
  // sigue el avance de ese recorrido fijo. En pantallas chicas los rayos se ocultan, la sección sube normal y el corte
  // ocurre una vez al entrar; con reducir movimiento, todo aparece revelado y nítido.
  const reducedMotion = useReducedMotion() ?? false;
  const { pinRef, pinned: scrub, progress: pinProgress } = usePinnedScene();
  // El movimiento de fondo (hexágonos, haces) sigue el recorrido fijo si la sección está fija; si no, el scroll de siempre
  const motionProgress = scrub ? pinProgress : scrollYProgress;
  const layers = {
    background: useBackgroundLayer(motionProgress),
    middle: useMiddleLayer(motionProgress),
    foreground: useForegroundLayer(motionProgress),
    slow: useSlowLayer(motionProgress),
    fast: useFastLayer(motionProgress),
  };
  const photoCutX = useTransform(pinProgress, LASER_CUT.PHOTO, ["0%", LASER_CUT.COVER_TRAVEL]);
  const cardCutX = useTransform(pinProgress, LASER_CUT.CARD, ["0%", LASER_CUT.COVER_TRAVEL_BACK]);
  const frameFlash = useTransform(pinProgress, LASER_CUT.FLASH, [0, 1, 0]);
  const underline = useTransform(motionProgress, scrub ? LASER_CUT.UNDERLINE : LASER_CUT.UNDERLINE_FREE, [0, 1]);

  // Revelado después del láser (BR-075): cada cosa se ve borrosa hasta su tramo y se enfoca con el scroll, una tras otra
  const titleFocus = useTransform(pinProgress, (value) => ramp(REVEAL.TITLE[0], REVEAL.TITLE[1])(value));
  const photoFocus = useTransform(pinProgress, (value) => ramp(REVEAL.PHOTO[0], REVEAL.PHOTO[1])(value));
  const quoteFocus = useTransform(pinProgress, (value) => ramp(REVEAL.QUOTE[0], REVEAL.QUOTE[1])(value));
  // La foto nítida y su copia desenfocada se cruzan por opacidad; el desenfoque es de radio fijo (animarlo no es barato)
  const photoBlurOpacity = useTransform(photoFocus, (value) => 1 - value);

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
    <div ref={pinRef} className={`${styles.pin} ${scrub ? styles.pinned : ""}`}>
      <section
        id="social-proof-1"
        className={styles.socialProof}
        ref={sectionRef}
      >
        {/* Pistas láser diagonales con un haz que viaja por cada una al hacer scroll (BR-062) */}
        {Array.from({ length: BOLT.TRACKS }, (_, index) => (
          <div key={index} className={`${styles.laserTrack} ${styles[`laserTrack${index + 1}`]}`} aria-hidden="true" data-laser-track>
            {!reducedMotion && <LaserBolt index={index} progress={motionProgress} />}
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
            initial={scrub ? false : "hidden"}
            animate={scrub ? undefined : controls}
            variants={fadeInUp}
          >
            {/* Con la sección fija, el título se ve borroso hasta su tramo y se enfoca con el scroll (BR-075) */}
            <FocusText as="h2" className={styles.title} progress={titleFocus} focusFrom={0} blurPx={18} enabled={scrub}>
              {siteText("socialproof1.titulo")}
            </FocusText>
            {/* Subrayado láser que se dibuja con el scroll (BR-062) */}
            <motion.span
              className={styles.titleUnderline}
              aria-hidden="true"
              data-title-underline
              style={reducedMotion ? undefined : { scaleX: underline }}
            />
            <FocusText as="p" className={styles.subtitle} progress={titleFocus} focusFrom={0} blurPx={10} enabled={scrub}>
              {siteText("socialproof1.subtitulo")}
            </FocusText>
          </motion.div>

          <div className={styles.content}>
            <motion.div
              className={styles.imageContainer}
              initial={scrub ? false : "hidden"}
              animate={scrub ? undefined : controls}
              variants={fadeInLeft}
              style={scrub ? undefined : { y: layers.slow.y }}
            >
              <div className={styles.imageFrame}>
                {/* El marco rojo se enciende una vez cuando el láser termina de cortar la foto */}
                {!reducedMotion && (
                  <motion.div className={styles.frameFlash} aria-hidden="true" style={{ opacity: scrub ? frameFlash : 0 }} />
                )}
                <div className={styles.imageClip}>
                {/* Foto nítida; con la sección fija se cruza con su copia desenfocada (más abajo) al enfocarse (BR-075) */}
                <motion.picture className={styles.pictureLayer} style={scrub ? { opacity: photoFocus } : undefined}>
                  <source srcSet={PHOTO_SRCSET} sizes={PHOTO_SIZES} type="image/webp" />
                  <img
                    src={socialProof560w}
                    className={styles.image}
                    loading="lazy"
                    alt={`Cliente satisfecho en ${SITE.name}`}
                    width="560"
                    height="330"
                    onLoad={refreshLenis}
                  />
                </motion.picture>
                {/* Copia desenfocada de la misma foto (mismos archivos: no baja nada más): decorativa y de radio fijo */}
                {scrub && (
                  <motion.picture className={`${styles.pictureLayer} ${styles.pictureBlur}`} aria-hidden="true" data-photo-blur style={{ opacity: photoBlurOpacity }}>
                    <source srcSet={PHOTO_SRCSET} sizes={PHOTO_SIZES} type="image/webp" />
                    <img src={socialProof560w} className={styles.image} loading="lazy" alt="" width="560" height="330" />
                  </motion.picture>
                )}
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
              className={styles.testimonialCard}
              initial={scrub ? false : "hidden"}
              animate={scrub ? undefined : controls}
              variants={fadeInRight}
              style={scrub ? undefined : { y: testimonialY }}
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
              {/* El texto del testimonio se ve borroso hasta su tramo y se enfoca con el scroll, al final (BR-075) */}
              <FocusText as="div" block className={styles.testimonialContent} progress={quoteFocus} focusFrom={0} blurPx={9} enabled={scrub}>
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
              </FocusText>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
