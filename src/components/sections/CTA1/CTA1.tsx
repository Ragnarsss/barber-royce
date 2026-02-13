import { Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import styles from "./CTA1.module.css";
import ctaImage from "@/assets/cta1_model.png";

export const CTA1 = () => {
  return (
    <section id="cta-1" className={styles.cta}>
      <div className={styles.textHexagon}></div>
      <div className={styles.imageHexagon}></div>
      <div className={styles.container}>
        <div className={styles.content}>
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
            <Button className={styles.ctaButton} size="lg">
              <Calendar size={20} />
              Agendar Ahora
            </Button>
          </div>
        </div>
        <img
          src={ctaImage}
          alt="Modelo con corte premium de Royce Barbería"
          className={styles.ctaImage}
        />
      </div>
    </section>
  );
};
