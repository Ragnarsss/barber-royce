import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
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
 * íconos se dibujan con un trazo. Con el scroll, la franja entra en diagonal y se asienta, y la foto se acerca hasta
 * su tamaño; al pasar el ratón, el ícono se vuelve a dibujar (CSS: un whileHover de framer haría que la tarjeta dejara
 * de heredar la entrada de la grilla). Con reducir movimiento, todo queda en su posición final.
 */
export function Benefits() {
  const siteText = useSiteText();
  const reducedMotion = useReducedMotion() ?? false;
  const { ref, controls } = useScrollAnimation();

  // Escena ligada al scroll (scrub): de que la sección asoma por abajo a que queda centrada
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  // La franja se desliza por su propio eje (sube con la misma inclinación de sus bordes), no de costado:
  // 18,75 % de su alto (30 % de la sección) hacia abajo y lo que corresponde en x para seguir la diagonal
  const bandX = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);
  const bandY = useTransform(scrollYProgress, [0, 1], ["18.75%", "0%"]);
  const photoScale = useTransform(scrollYProgress, [0, 1], [1.14, 1]);
  const photoY = useTransform(scrollYProgress, [0, 1], ["-4%", "0%"]);

  return (
    <section id="benefits" className={styles.benefits} ref={sectionRef}>
      <div className={styles.imageBackground}>
        <motion.picture
          className={styles.photoMotion}
          data-photo-motion
          style={reducedMotion ? undefined : { scale: photoScale, y: photoY }}
        >
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
        </motion.picture>
      </div>
      {/* Franja roja diagonal entre el contenido y la foto: entra en diagonal con el scroll y se asienta */}
      <motion.div
        className={styles.band}
        aria-hidden="true"
        data-band
        style={reducedMotion ? undefined : { x: bandX, y: bandY }}
      />

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
              <motion.article
                key={benefit.title}
                className={styles.card}
                variants={fadeInUp}
                data-benefit
              >
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
