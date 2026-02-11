import { Button } from "../../common/Button";
import styles from "./Hero.module.css";

export const Hero = () => {
  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Estilo y Elegancia
            <br />
            <span className={styles.highlight}>Para el Hombre Moderno</span>
          </h1>
          <p className={styles.description}>
            Cortes de vanguardia, servicio premium y una experiencia única.
            Descubre el arte del barbering profesional.
          </p>
          <div className={styles.actions}>
            <Button size="large">Reservar Cita Ahora</Button>
            <Button variant="outline" size="large">
              Ver Servicios
            </Button>
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <div className={styles.imagePlaceholder}>
            {/* Placeholder para imagen */}
            <span>Hero Image</span>
          </div>
        </div>
      </div>
    </section>
  );
};
