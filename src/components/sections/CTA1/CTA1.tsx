import { motion } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import styles from "./CTA1.module.css";
import cta700w from "@/assets/optimized/cta1_model_700w.webp";
import cta1400w from "@/assets/optimized/cta1_model_1400w.webp";
import ctaAvif from "@/assets/optimized/cta1_model_700w.avif";
import ctaImage from "@/assets/cta1_model.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import { fadeInLeft, fadeInRight } from "@/config/animations.config";
import { Link } from "react-router-dom";

export function CTA1() {
  const { ref, controls } = useScrollAnimation();

  const { ref: sectionRef, layers } = useParallaxLayers<HTMLElement>(undefined, {
    offset: ["start end", "end start"],
  });

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
            <h2 className={styles.title}>
              Reserva tu
              <br />
              Experiencia
              <br />
              Premium Hoy.
            </h2>
            <p className={styles.subtitle}>
              ¿Listo para un cambio que te defina? Agenda tu cita y descubre por
              qué somos la barbería de elección para quienes buscan lo mejor.
            </p>
            <div className={styles.ctaButtons}>
              <Link className={styles.ctaButton} to="https://barberiaroyc.site.agendapro.com/cl/sucursal/400965" target="_blank">
                <Calendar size={20} />
                Agendar Ahora
              </Link>
              <a
                href="/servicios"
                className={styles.ctaButtonGhost}
              >
                Conocer Servicios
                <ArrowRight size={18} />
              </a>
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
          <source
            srcSet={ctaAvif}
            type="image/avif"
          />
          <img
            src={ctaImage}
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
