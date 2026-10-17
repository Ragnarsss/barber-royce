import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import styles from "./Benefits.module.css";
import { useSiteText } from "@/content/useSiteContent";
import { benefitsList } from "@/data/benefitsData";
import { SITE } from "@/config/constants";
import { cardBlurFade, cardBodyFocus, cardSpinReveal, iconHeartbeat, staggerContainer } from "@/config/animations.config";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { DrawnIcon } from "./DrawnIcon";
import { FocusText } from "./FocusText";
import { CardCarousel } from "@/components/common/CardCarousel/CardCarousel";
import barberBack954w from "@/assets/optimized/barber_background_954w.webp";
import barberBack1908w from "@/assets/optimized/barber_background_1908w.webp";

/**
 * «Estilo que te acompaña» (BR-064), fiel al Figma «Beneficios v2»: fondo charcoal, franja roja diagonal y la foto
 * clara a la derecha; tarjetas con los textos del diseño (de vidrio desde BR-069). Gesto: las tarjetas entran
 * escalonadas y sus íconos se dibujan con un trazo. Con el scroll, la franja entra en diagonal y se asienta, y la foto
 * se acerca hasta su tamaño; al pasar el ratón, el ícono se vuelve a dibujar (CSS: un whileHover de framer haría que la
 * tarjeta dejara de heredar la entrada de la grilla).
 *
 * Revelado con el scroll (BR-074): el título y el subtítulo se enfocan con el scroll (`FocusText`); cada tarjeta gira
 * 360° sobre su eje vertical y su contenido pasa de desenfocado a nítido, y el ícono da un latido al terminar. Con
 * reducir movimiento, todo queda en su posición final y nítido, sin giro ni latido.
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
  // Enfoque del título y el subtítulo: de que la sección asoma (borde superior al 85 % de la pantalla) a que sube al 35 %
  const { scrollYProgress: focusProgress } = useScroll({ target: sectionRef, offset: ["start 85%", "start 35%"] });

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
            <FocusText as="h2" className={styles.title} progress={focusProgress} blurPx={9} enabled={!reducedMotion}>
              {siteText("benefits.titulo")}
            </FocusText>
            {/* La frase continúa en las tarjetas: por eso termina en dos puntos */}
            <FocusText as="p" className={styles.subtitle} progress={focusProgress} blurPx={5} enabled={!reducedMotion}>
              En {SITE.name}, cada visita es una oportunidad para realzar tu estilo. Nos enfocamos en la calidad y la
              exclusividad, ofreciendo:
            </FocusText>
          </div>
          {/* En móvil las tarjetas son un carrusel con snap (BR-070); en escritorio, la grilla de siempre */}
          <CardCarousel label="Beneficios">
            <motion.div
              ref={ref}
              className={styles.grid}
              initial={reducedMotion ? false : "hidden"}
              animate={controls}
              variants={staggerContainer}
            >
              {benefitsList.map((benefit) => {
                const description = benefit.description.map((part, index) =>
                  typeof part === "string" ? part : <strong key={index}>{part.strong}</strong>,
                );
                return (
                  <motion.article
                    key={benefit.title}
                    className={styles.card}
                    variants={reducedMotion ? undefined : cardSpinReveal}
                    data-benefit
                  >
                    <motion.div className={styles.cardBody} variants={reducedMotion ? undefined : cardBodyFocus}>
                      <h3 className={styles.cardTitle}>{benefit.title}</h3>
                      <motion.div className={styles.cardIcon} variants={reducedMotion ? undefined : iconHeartbeat}>
                        <DrawnIcon name={benefit.icon} animate={!reducedMotion} />
                      </motion.div>
                      <div className={styles.accent} />
                      <p className={styles.cardDescription}>{description}</p>
                    </motion.div>
                    {/* Copia desenfocada del texto, encima del contenido nítido: se desvanece durante el giro. Solo
                        decorativa (aria-hidden) y sin ícono, que se dibuja aparte; reserva su lugar. */}
                    {!reducedMotion && (
                      <motion.div className={styles.cardBlur} aria-hidden="true" variants={cardBlurFade} data-card-blur>
                        <div className={styles.cardTitle}>{benefit.title}</div>
                        <div className={styles.cardIcon} />
                        <div className={styles.accent} />
                        <p className={styles.cardDescription}>{description}</p>
                      </motion.div>
                    )}
                  </motion.article>
                );
              })}
            </motion.div>
          </CardCarousel>
        </div>
      </div>
    </section>
  );
}
