import { motion, useReducedMotion } from "framer-motion";
import styles from "./Benefits.module.css";
import { useSiteText } from "@/content/useSiteContent";
import { benefitsList } from "@/data/benefitsData";
import { SITE } from "@/config/constants";
import { fadeInUp, staggerContainer } from "@/config/animations.config";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { DrawnIcon } from "./DrawnIcon";
import barberBack954w from "@/assets/optimized/barber_background_954w.webp";
import barberBack1908w from "@/assets/optimized/barber_background_1908w.webp";

/**
 * «Estilo que te acompaña» (BR-064), fiel al Figma «Beneficios v2»: fondo charcoal, franja roja diagonal y la foto
 * clara a la derecha; tarjetas blancas con los textos del diseño. Gesto: las tarjetas entran escalonadas y sus
 * íconos se dibujan con un trazo. Con reducir movimiento, todo aparece visible y dibujado.
 */
export function Benefits() {
  const siteText = useSiteText();
  const reducedMotion = useReducedMotion() ?? false;
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="benefits" className={styles.benefits}>
      <div className={styles.imageBackground}>
        <picture>
          <source
            srcSet={`${barberBack954w} 954w, ${barberBack1908w} 1908w`}
            sizes="(max-width: 768px) 100vw, (max-width: 1400px) 45vw, 954px"
            type="image/webp"
          />
          <img
            src={barberBack954w}
            alt="Barbero profesional trabajando"
            className={styles.backgroundImage}
            loading="lazy"
            width="954"
            height="1304"
          />
        </picture>
      </div>
      {/* Franja roja diagonal entre el contenido y la foto */}
      <div className={styles.band} aria-hidden="true" />

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>{siteText("benefits.titulo")}</h2>
            {/* La frase continúa en las tarjetas: por eso termina en dos puntos */}
            <p className={styles.subtitle}>
              En {SITE.name}, cada visita es una oportunidad para realzar tu estilo. Nos enfocamos en la calidad y la
              exclusividad, ofreciendo:
            </p>
          </div>
          <motion.div
            ref={ref}
            className={styles.grid}
            initial={reducedMotion ? false : "hidden"}
            animate={controls}
            variants={staggerContainer}
          >
            {benefitsList.map((benefit) => (
              <motion.article key={benefit.title} className={styles.card} variants={fadeInUp} data-benefit>
                <h3 className={styles.cardTitle}>{benefit.title}</h3>
                <div className={styles.cardIcon}>
                  <DrawnIcon name={benefit.icon} animate={!reducedMotion} />
                </div>
                <div className={styles.accent} />
                <p className={styles.cardDescription}>
                  {benefit.description.map((part, index) =>
                    typeof part === "string" ? part : <strong key={index}>{part.strong}</strong>,
                  )}
                </p>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
