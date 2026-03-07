import { motion, useTransform } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./CTA2.module.css";
import backgroundImage from "@/assets/cta2_crew.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useLenisScroll } from "@/hooks/useLenisScroll";
import { scaleIn } from "@/lib/animations";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";

// ✅ React 19: memo() eliminado - bailout automático mejorado
export function CTA2() {
  const { ref, controls } = useScrollAnimation();
  const { direction } = useLenisScroll();

  // Hook de parallax centralizado
  const { ref: sectionRef, layers } = useParallaxLayers();

  // Escala de imagen basada en dirección del scroll
  const imageScale = useTransform(layers.scrollYProgress, [0, 0.5, 1], [1, 1.15, 1.3]);

  return (
    <section id="cta-2" ref={sectionRef} className={styles.cta}>
      {/* Imagen de fondo animada */}
      <motion.div
        className={styles.background}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          scale: imageScale,
          // Efecto adicional según dirección
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
        <Button className={styles.ctaButton} size="lg">
          <Calendar size={20} />
          Agendar Ahora
        </Button>
      </motion.div>
    </section>
  );
}
