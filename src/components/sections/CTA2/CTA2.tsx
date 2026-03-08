import { motion, useTransform } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./CTA2.module.css";
import backgroundImage from "@/assets/cta2_crew.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import { CONTACT } from "@/config/constants";
import { scaleIn } from "@/config/animations.config";

export function CTA2() {
  const { ref, controls } = useScrollAnimation();
  const { direction } = useLenisScroll();

  const { ref: sectionRef, layers } = useParallaxLayers();

  const imageScale = useTransform(layers.scrollYProgress, [0, 0.5, 1], [1, 1.15, 1.3]);

  return (
    <section id="cta-2" ref={sectionRef} className={styles.cta}>
      {/* Imagen de fondo - <img> tag para SEO */}
      <motion.img
        src={backgroundImage}
        alt="Equipo profesional de barberos de Royce Barbería trabajando en un ambiente moderno y exclusivo"
        className={styles.backgroundImage}
        loading="lazy"
        width="1920"
        height="1080"
        style={{
          scale: imageScale,
          filter: direction === 1 ? "brightness(1)" : "brightness(0.95)",
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
        <h2 className={styles.title}>
          ¿Ya te decidiste a brillar con el flow?
        </h2>
        <p className={styles.subtitle}>
          <strong>Agenda tu hora rápido.</strong> Estamos semanalmente llenando
          agenda a un ritmo increíble, gracias a que nuestros clientes tienen
          <strong> confianza en nuestra calidad.</strong>
        </p>
        <div className={styles.ctaButtons}>
          <Button className={styles.ctaButton} size="lg">
            <Calendar size={20} />
            Agendar Ahora
          </Button>
          <a
            href={CONTACT.whatsapp.link}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.ctaButtonGhost}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
            </svg>
            Escríbenos por WhatsApp
          </a>
        </div>
      </motion.div>
    </section>
  );
}
