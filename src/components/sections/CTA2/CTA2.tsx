import { motion, useTransform } from "framer-motion";
import { Calendar } from "lucide-react";
import styles from "./CTA2.module.css";
import { WhatsAppIcon } from "@/components/icons";
import backgroundImage from "@/assets/optimized/cta2_crew_455w.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useScrollDirection } from "@/hooks/useScrollMotion";
import { useParallaxProgress, useSlowLayer } from "@/hooks/useParallaxLayers";
import { trackReserve, trackWhatsApp } from "@/analytics/track";
import { useSiteContent, useSiteText } from "@/content/useSiteContent";
import { scaleIn } from "@/config/animations.config";

export function CTA2() {
  const { business } = useSiteContent();
  const siteText = useSiteText();
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
          <a className={styles.ctaButton} href={business.booking.url} target="_blank" rel="noopener noreferrer" onClick={trackReserve("cta2")}>
            <Calendar size={20} />
            Agendar Ahora
          </a>
          <a
            href={business.contact.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButtonGhost}
            onClick={trackWhatsApp("cta2")}
          >
            <WhatsAppIcon size={20} />
            Hablemos por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
