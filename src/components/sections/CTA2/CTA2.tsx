import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./CTA2.module.css";
import backgroundImage from "@/assets/cta2_crew.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { scaleIn } from "@/lib/animations";

export const CTA2 = () => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section
      id="cta-2"
      ref={ref}
      className={styles.cta}
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className={styles.overlay}></div>
      <motion.div
        className={styles.content}
        initial="hidden"
        animate={controls}
        variants={scaleIn}
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
};
