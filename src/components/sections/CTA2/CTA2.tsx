import { motion, useTransform } from "framer-motion";
import { Calendar } from "lucide-react";
import styles from "./CTA2.module.css";
import backgroundImage from "@/assets/optimized/cta2_crew_455w.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useScrollDirection } from "@/hooks/useScrollMotion";
import { useParallaxProgress, useSlowLayer } from "@/hooks/useParallaxLayers";
import { BOOKING, CONTACT } from "@/config/constants";
import { trackReserve, trackWhatsApp } from "@/analytics/track";
import { siteText } from "@/content/siteContent";
import { scaleIn } from "@/config/animations.config";

export function CTA2() {
  const { ref, controls } = useScrollAnimation();
  const direction = useScrollDirection();

  const { ref: sectionRef, scrollYProgress } = useParallaxProgress();
  const layers = { slow: useSlowLayer(scrollYProgress) };

  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.15, 1.3]);
  const imageFilter = useTransform(direction, (value) => (value === 1 ? "brightness(1)" : "brightness(0.95)"));

  return (
    <section id="cta-2" ref={sectionRef} className={styles.cta}>
      {/* Imagen de fondo - <img> tag para SEO */}
      <motion.img
        src={backgroundImage}
        alt="Equipo profesional de barberos de Royce Barbería trabajando en un ambiente moderno y exclusivo"
        className={styles.backgroundImage}
        loading="lazy"
        width="455"
        height="705"
        style={{
          scale: imageScale,
          filter: imageFilter,
        }}
      />
      <div className={styles.overlay}></div>
      <motion.div
        className={styles.content}
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={scaleIn}
        style={{ y: layers.slow.y }}
      >
        <h2 className={styles.title}>{siteText("cta2.titulo")}</h2>
        <p className={styles.subtitle}>
          <strong>Agenda tu hora rápido.</strong> Estamos semanalmente llenando
          agenda a un ritmo increíble, gracias a que nuestros clientes tienen
          <strong> confianza en nuestra calidad.</strong>
        </p>
        <div className={styles.ctaButtons}>
          <a className={styles.ctaButton} href={BOOKING.url} target="_blank" rel="noopener noreferrer" onClick={trackReserve("cta2")}>
            <Calendar size={20} />
            Agendar Ahora
          </a>
          <a
            href={CONTACT.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButtonGhost}
            onClick={trackWhatsApp("cta2")}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Hablemos por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
