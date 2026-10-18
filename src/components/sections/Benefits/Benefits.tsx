import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import styles from "./Benefits.module.css";
import { useSiteText } from "@/content/useSiteContent";
import { benefitsList } from "@/data/benefitsData";
import { SITE } from "@/config/constants";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { BenefitCard } from "./BenefitCard";
import { FocusText } from "./FocusText";
import { PIN_TITLE_END, photoLift, photoScale as pinnedPhotoScale, ramp } from "./reveal";
import { CardCarousel } from "@/components/common/CardCarousel/CardCarousel";
import barberBack954w from "@/assets/optimized/barber_background_954w.webp";
import barberBack1908w from "@/assets/optimized/barber_background_1908w.webp";

/**
 * «Estilo que te acompaña» (BR-064), fiel al Figma «Beneficios v2»: fondo charcoal, franja roja diagonal y la foto
 * clara a la derecha; tarjetas con los textos del diseño (de vidrio desde BR-069). Con el scroll, la franja entra en
 * diagonal y se asienta, y la foto se acerca hasta su tamaño; al pasar el ratón, el ícono se vuelve a dibujar (CSS).
 *
 * Revelado ligado al scroll (BR-074): el título y el subtítulo se enfocan (`FocusText`) y cada tarjeta (`BenefitCard`)
 * gira 360° sobre su eje vertical, enfoca su contenido, dibuja su ícono y le da un latido, todo al ritmo del scroll:
 * al subir de nuevo, se deshace. Con reducir movimiento, todo queda de frente, nítido y quieto.
 *
 * En escritorio la sección queda fija en pantalla mientras se revela (`position: sticky` dentro de un contenedor
 * alto): el scroll avanza la secuencia en vez de subir la sección y dejarla cortada. Al terminar, la página sigue. En
 * móvil no se fija: la sección sube normal y cada elemento se revela según dónde esté en la pantalla.
 */
export function Benefits() {
  const siteText = useSiteText();
  const reducedMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery("(min-width: 769px)");
  const pinned = isDesktop && !reducedMotion;
  const pinRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  // Escena ligada al scroll (scrub): de que la sección asoma por abajo a que queda centrada
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "center center"] });
  // La franja se desliza por su propio eje (sube con la misma inclinación de sus bordes), no de costado:
  // 18,75 % de su alto (30 % de la sección) hacia abajo y lo que corresponde en x para seguir la diagonal
  const bandX = useTransform(scrollYProgress, [0, 1], ["-10%", "0%"]);
  const bandY = useTransform(scrollYProgress, [0, 1], ["18.75%", "0%"]);
  // Sin fijar (móvil): la foto parte un 40 % más grande y se asienta mientras la sección sube
  const freePhotoScale = useTransform(scrollYProgress, [0, 1], [1.4, 1]);
  const freePhotoY = useTransform(scrollYProgress, [0, 1], ["-6%", "0%"]);
  // Sin fijar (móvil): el enfoque del título y el subtítulo va desde que la sección asoma por abajo hasta que sube al
  // 45 %, y el de las tarjetas, una tras otra, desde que el borde de la grilla está al 80 % hasta que sube al 20 %.
  const { scrollYProgress: freeFocus } = useScroll({ target: sectionRef, offset: ["start 100%", "start 45%"] });
  const { scrollYProgress: freeCards } = useScroll({ target: gridRef, offset: ["start 80%", "start 20%"] });
  // Fijada (escritorio): una sola línea de tiempo mientras la sección está fija, de que se pega arriba a que se suelta.
  // Primero se enfocan los títulos y después, una tras otra, las tarjetas; mientras no le toca, cada una se ve borrosa.
  const { scrollYProgress: pinProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });
  const pinFocus = useTransform(pinProgress, (value) => ramp(0, PIN_TITLE_END)(value));
  const pinCards = useTransform(pinProgress, (value) => ramp(PIN_TITLE_END, 1)(value));
  const focusProgress = pinned ? pinFocus : freeFocus;
  const cardsProgress = pinned ? pinCards : freeCards;
  // Fijada: la foto parte un 50 % más grande y se asienta, con desaceleración marcada, durante el primer 60 % del tiempo
  // en que la sección está fija, para que el alejamiento se note mientras la pantalla está quieta
  const pinPhotoScale = useTransform(pinProgress, pinnedPhotoScale);
  const pinPhotoY = useTransform(pinProgress, photoLift);
  const photoScale = pinned ? pinPhotoScale : freePhotoScale;
  const photoY = pinned ? pinPhotoY : freePhotoY;

  return (
    <div ref={pinRef} className={`${styles.pin} ${pinned ? styles.pinned : ""}`}>
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
              <FocusText as="h2" className={styles.title} progress={focusProgress} blurPx={18} enabled={!reducedMotion}>
                {siteText("benefits.titulo")}
              </FocusText>
              {/* La frase continúa en las tarjetas: por eso termina en dos puntos */}
              <FocusText as="p" className={styles.subtitle} progress={focusProgress} blurPx={10} enabled={!reducedMotion}>
                En {SITE.name}, cada visita es una oportunidad para realzar tu estilo. Nos enfocamos en la calidad y la
                exclusividad, ofreciendo:
              </FocusText>
            </div>
            {/* En móvil las tarjetas son un carrusel con snap (BR-070); en escritorio, la grilla de siempre */}
            <CardCarousel label="Beneficios">
              <div ref={gridRef} className={styles.grid}>
                {benefitsList.map((benefit, index) => (
                  <BenefitCard key={benefit.title} benefit={benefit} index={index} progress={cardsProgress} animated={!reducedMotion} />
                ))}
              </div>
            </CardCarousel>
          </div>
        </div>
      </section>
    </div>
  );
}
