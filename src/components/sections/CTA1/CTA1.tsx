import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import styles from "./CTA1.module.css";
import cta700w from "@/assets/optimized/cta1_model_700w.webp";
import cta1400w from "@/assets/optimized/cta1_model_1400w.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxProgress, useMiddleLayer, useForegroundLayer, useSlowLayer, useFastLayer } from "@/hooks/useParallaxLayers";
import { fadeInLeft, fadeInRight } from "@/config/animations.config";
import { Link } from "react-router-dom";
import { BOOKING } from "@/config/constants";
import { trackReserve } from "@/analytics/track";
import { siteText } from "@/content/siteContent";

export function CTA1() {
  const { ref, controls } = useScrollAnimation();

  const { ref: sectionRef, scrollYProgress } = useParallaxProgress<HTMLElement>(undefined, {
    offset: ["start end", "end start"],
  });
  const layers = {
    middle: useMiddleLayer(scrollYProgress),
    foreground: useForegroundLayer(scrollYProgress),
    slow: useSlowLayer(scrollYProgress),
    fast: useFastLayer(scrollYProgress),
  };

  return (
    <section id="cta-1" className={styles.cta} ref={sectionRef}>
      {/* Capa de fondo - hexágonos con opacidad reducida */}
      <motion.div
        className={styles.textHexagonBackground}
        style={{ y: layers.slow.y, x: layers.slow.x }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagonBackground}
        style={{ y: layers.slow.y, x: layers.slow.x }}
      ></motion.div>

      {/* Capa principal - hexágonos principales */}
      <motion.div
        className={styles.textHexagon}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagon}
        style={{ y: layers.middle.y }}
      ></motion.div>

      {/* Capa frontal - hexágonos pequeños decorativos */}
      <motion.div
        className={styles.textHexagonForeground}
        style={{ y: layers.fast.y, x: layers.fast.x }}
      ></motion.div>
      <motion.div
        className={styles.imageHexagonForeground}
        style={{ y: layers.fast.y, x: layers.fast.x }}
      ></motion.div>

      <div className={styles.container} ref={ref}>
        <motion.div
          className={styles.content}
          initial="hidden"
          animate={controls}
          variants={fadeInLeft}
        >
          <div className={styles.textContent}>
            <h2 className={styles.title}>{siteText("cta1.titulo")}</h2>
            <p className={styles.subtitle}>{siteText("cta1.subtitulo")}</p>
            <div className={styles.ctaButtons}>
              <a className={styles.ctaButton} href={BOOKING.url} target="_blank" rel="noopener noreferrer" onClick={trackReserve("cta1")}>
                <Calendar size={20} />
                Agendar Ahora
              </a>
              <Link to="/servicios" className={styles.ctaButtonGhost}>
                Conocer Servicios
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
        <motion.picture
          className={styles.ctaImage}
          initial="hidden"
          animate={controls}
          variants={fadeInRight}
          style={{ y: layers.foreground.y, scale: layers.foreground.scale }}
        >
          <source
            srcSet={`${cta700w} 700w, ${cta1400w} 1400w`}
            sizes="(max-width: 768px) 100vw, 700px"
            type="image/webp"
          />
          <img
            src={cta700w}
            alt="Modelo con corte premium de Royce Barbería"
            loading="lazy"
            width="700"
            height="925"
            style={{ width: "100%", height: "auto" }}
          />
        </motion.picture>
      </div>
    </section>
  );
}
