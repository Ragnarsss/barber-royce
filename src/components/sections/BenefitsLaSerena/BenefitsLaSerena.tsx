import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useReducedMotion } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { SITE } from "@/config/constants";
import { useSiteText } from "@/content/useSiteContent";
import { benefitsList, type Benefit } from "@/data/benefitsData";
import { LA_SERENA_PHOTOS } from "@/data/laSerenaPhotos";
import { DrawnIcon } from "../Benefits/DrawnIcon";
import styles from "./BenefitsLaSerena.module.css";

/** Las fotos dos veces seguidas: la franja avanza media pista y vuelve al inicio sin salto. */
const STRIP = [...LA_SERENA_PHOTOS, ...LA_SERENA_PHOTOS];
const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Tarjeta de beneficio sobre la franja de fotos: entra desde abajo al llegar a la vista (una sola vez) y su ícono se
 * dibuja. Con «reducir movimiento» se ve completa y quieta.
 */
function BenefitCardLaSerena({ benefit, index, reducedMotion }: { benefit: Benefit; index: number; reducedMotion: boolean }) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const draw = useMotionValue(reducedMotion ? 1 : 0);

  useEffect(() => {
    if (reducedMotion || !inView) return;
    const controls = animate(draw, 1, { duration: 1.1, delay: 0.25 + index * 0.12, ease: EASE });
    return () => controls.stop();
  }, [draw, inView, index, reducedMotion]);

  const description = benefit.description.map((part, i) => (typeof part === "string" ? part : <strong key={i}>{part.strong}</strong>));

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      initial={reducedMotion ? false : { opacity: 0, y: 36 }}
      animate={reducedMotion || inView ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      data-benefit
    >
      <span className={styles.cardNumber} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={styles.cardIcon}>
        <DrawnIcon name={benefit.icon} progress={reducedMotion ? undefined : draw} />
      </div>
      <h3 className={styles.cardTitle}>{benefit.title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </motion.article>
  );
}

/**
 * «Estilo que te acompaña» de La Serena (BR-117, HU-SUC-002 CA-11): variante propia de Beneficios. De fondo, una franja
 * horizontal de fotos del local, pegadas y sin marco, que avanza sola; un velo espresso la oscurece para que el texto se
 * lea, y encima van el título, el subtítulo y las tres tarjetas (los mismos textos de la sección de Coquimbo). Se pausa
 * con el cursor, con el foco o con el botón; con «reducir movimiento» queda quieta y sin botón.
 */
export function BenefitsLaSerena() {
  const siteText = useSiteText();
  const reducedMotion = useReducedMotion() ?? false;
  const [paused, setPaused] = useState(false);

  return (
    <section id="benefits" className={`${styles.benefits} ${paused ? styles.paused : ""}`} aria-labelledby="benefits-la-serena-title">
      <div className={styles.strip} aria-hidden="true">
        <div className={styles.track}>
          {STRIP.map((photo, index) => (
            <figure key={index} className={styles.photo}>
              <img src={photo.src} alt="" width={874} height={583} loading="lazy" decoding="async" style={{ objectPosition: photo.position }} />
            </figure>
          ))}
        </div>
      </div>
      <div className={styles.veil} aria-hidden="true" />

      <div className={styles.content}>
        <h2 id="benefits-la-serena-title" className={styles.title}>
          {siteText("benefits.titulo")}
        </h2>
        {/* La frase continúa en las tarjetas: por eso termina en dos puntos */}
        <p className={styles.subtitle}>
          En {SITE.name}, cada visita es una oportunidad para realzar tu estilo. Nos enfocamos en la calidad y la exclusividad,
          ofreciendo:
        </p>
        <div className={styles.cards}>
          {benefitsList.map((benefit, index) => (
            <BenefitCardLaSerena key={benefit.title} benefit={benefit} index={index} reducedMotion={reducedMotion} />
          ))}
        </div>
      </div>

      {!reducedMotion && (
        <button
          type="button"
          className={styles.pause}
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={paused ? "Reanudar las fotos" : "Pausar las fotos"}
        >
          {paused ? <Play aria-hidden="true" focusable="false" /> : <Pause aria-hidden="true" focusable="false" />}
        </button>
      )}
    </section>
  );
}
