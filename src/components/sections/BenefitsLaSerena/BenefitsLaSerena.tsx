import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useMotionValue, useMotionValueEvent, useReducedMotion, useTransform, type MotionValue } from "framer-motion";
import { Pause, Play } from "lucide-react";
import { BENEFITS_SERENA_TIMELINE as T } from "@/config/animations.config";
import { SITE } from "@/config/constants";
import { useSiteText } from "@/content/useSiteContent";
import { benefitsList, type Benefit } from "@/data/benefitsData";
import { LA_SERENA_PHOTOS } from "@/data/laSerenaPhotos";
import { usePinnedScene } from "@/hooks/usePinnedScene";
import { DrawnIcon } from "../Benefits/DrawnIcon";
import { fitsViewport } from "./fitsViewport";
import styles from "./BenefitsLaSerena.module.css";

/** Las fotos dos veces seguidas: la franja avanza media pista y vuelve al inicio sin salto. */
const STRIP = [...LA_SERENA_PHOTOS, ...LA_SERENA_PHOTOS];
const EASE = [0.22, 1, 0.36, 1] as const;
/** Alto de la barra de navegación fija (`padding-top` de `Layout.module.css`): el espacio visible empieza debajo de ella. */
const NAVBAR_PX = 80;
/** Umbrales finos, para que el observador avise cada pocos píxeles de avance y no solo al entrar y al salir. */
const FIT_THRESHOLDS = Array.from({ length: 51 }, (_, i) => i / 50);

/**
 * Tarjeta de beneficio sobre la franja de fotos. Con la escena fija (escritorio), entra con el scroll en su tramo de la
 * línea de tiempo: sube, crece y su ícono se dibuja al ritmo del avance, y se deshace al volver. Sin escena fija (celular)
 * entra una sola vez al llegar a la vista, y con «reducir movimiento» se ve completa y quieta.
 */
function BenefitCardLaSerena({
  benefit,
  index,
  reducedMotion,
  progress,
}: {
  benefit: Benefit;
  index: number;
  reducedMotion: boolean;
  /** Avance de la escena fija (0..1), o `null` si no hay escena fija. */
  progress: MotionValue<number> | null;
}) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -12% 0px" });
  const own = useMotionValue(reducedMotion ? 1 : 0);
  const [from, to] = T.cards[index] ?? T.cards[T.cards.length - 1];

  // Con escena fija, el avance propio sale del scroll (en función, para que no se «acelere» con una línea de tiempo nativa)
  const scrubbed = useTransform(progress ?? own, (value) => (progress ? Math.min(1, Math.max(0, (value - from) / (to - from))) : value));
  const y = useTransform(scrubbed, (t) => (1 - t) * 80);
  const scale = useTransform(scrubbed, (t) => 0.94 + t * 0.06);

  // Sin escena fija: el ícono se dibuja una vez, al entrar a la vista
  useEffect(() => {
    if (progress || reducedMotion || !inView) return;
    const controls = animate(own, 1, { duration: 1.1, delay: 0.25 + index * 0.12, ease: EASE });
    return () => controls.stop();
  }, [own, inView, index, progress, reducedMotion]);

  const description = benefit.description.map((part, i) => (typeof part === "string" ? part : <strong key={i}>{part.strong}</strong>));
  const scene = progress !== null && !reducedMotion;

  return (
    <motion.article
      ref={ref}
      className={styles.card}
      style={scene ? { opacity: scrubbed, y, scale } : undefined}
      initial={scene || reducedMotion ? false : { opacity: 0, y: 36 }}
      animate={!scene && (reducedMotion || inView) ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.7, delay: index * 0.12, ease: EASE }}
      data-benefit
    >
      <span className={styles.cardNumber} aria-hidden="true">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className={styles.cardIcon}>
        <DrawnIcon name={benefit.icon} progress={reducedMotion ? undefined : scene ? scrubbed : own} />
      </div>
      <h3 className={styles.cardTitle}>{benefit.title}</h3>
      <p className={styles.cardDescription}>{description}</p>
    </motion.article>
  );
}

/**
 * «Estilo que te acompaña» de La Serena (BR-117, HU-SUC-002 CA-11): variante propia de Beneficios. De fondo, una franja
 * horizontal de fotos del local, pegadas y sin marco, que avanza sola; un velo espresso la oscurece para que el texto se
 * lea, y encima van el título, el subtítulo y las tres tarjetas (los mismos textos de la sección de Coquimbo).
 *
 * En escritorio la sección queda fija en pantalla (`usePinnedScene`, como la de Coquimbo) y el scroll arma la escena: el velo
 * se cierra, la franja se aleja, sube el título, aparece el subtítulo y entran las tarjetas; la segunda mitad del recorrido
 * deja la vista quieta unos segundos, con la franja corriendo, antes de pasar a la siguiente sección. La franja empieza a
 * avanzar cuando la sección encaja en el espacio visible y sigue girando después, aunque se scrollee a otra sección. Se pausa solo con el botón (no con el cursor ni con el foco: la
 * sección llena la ventana y casi nunca correría); con «reducir
 * movimiento» no hay escena fija: todo queda completo y quieto, y sin botón.
 */
export function BenefitsLaSerena() {
  const siteText = useSiteText();
  const reducedMotion = useReducedMotion() ?? false;
  const [paused, setPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const { pinRef, pinned, progress: pinProgress } = usePinnedScene();

  // Copia del avance en un MotionValue propio: framer-motion «acelera» con una línea de tiempo nativa lo que se ata directo
  // a `useScroll`, y en una sección alta calcula mal el tramo (BR-114). Así todo se calcula en JavaScript, sin `setState`.
  const progress = useMotionValue(pinProgress.get());
  useMotionValueEvent(pinProgress, "change", (value) => progress.set(value));

  const veil = useTransform(progress, (v) => 0.35 + 0.65 * Math.min(1, Math.max(0, (v - T.veil[0]) / (T.veil[1] - T.veil[0]))));
  const stripScale = useTransform(progress, (v) => 1.18 - 0.18 * Math.min(1, Math.max(0, (v - T.strip[0]) / (T.strip[1] - T.strip[0]))));
  const titleT = useTransform(progress, (v) => Math.min(1, Math.max(0, (v - T.title[0]) / (T.title[1] - T.title[0]))));
  const titleY = useTransform(titleT, (t) => (1 - t) * 48);
  const subtitleT = useTransform(progress, (v) => Math.min(1, Math.max(0, (v - T.subtitle[0]) / (T.subtitle[1] - T.subtitle[0]))));
  const subtitleY = useTransform(subtitleT, (t) => (1 - t) * 24);
  const scene = pinned && !reducedMotion;

  // La franja empieza a avanzar cuando la sección encaja en el espacio visible, y desde entonces no se detiene: sigue
  // girando aunque el visitante pase a otra sección (decisión del usuario, 2026-11-27). El aviso se escribe directo en el DOM
  // (`data-fitted`), no con un estado de React, y el CSS enciende la animación. Una vez encendida ya no hace falta observar.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    if (typeof IntersectionObserver === "undefined") {
      section.dataset.fitted = "1";
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        const root = entry.rootBounds?.height ?? window.innerHeight - NAVBAR_PX;
        if (fitsViewport(entry.intersectionRect.height, entry.boundingClientRect.height, root)) {
          section.dataset.fitted = "1";
          observer.disconnect();
        } else if (section.dataset.fitted !== "1") {
          section.dataset.fitted = "0";
        }
      },
      { rootMargin: `-${NAVBAR_PX}px 0px 0px 0px`, threshold: FIT_THRESHOLDS },
    );
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={pinRef} className={`${styles.pin} ${scene ? styles.pinned : ""}`}>
      <section
        ref={sectionRef}
        id="benefits"
        className={`${styles.benefits} ${paused ? styles.paused : ""}`}
        aria-labelledby="benefits-la-serena-title"
      >
        <motion.div className={styles.strip} aria-hidden="true" style={scene ? { scale: stripScale } : undefined}>
          <div className={styles.track}>
            {STRIP.map((photo, index) => (
              <figure key={index} className={styles.photo}>
                <img src={photo.src} alt="" width={874} height={583} loading="lazy" decoding="async" style={{ objectPosition: photo.position }} />
              </figure>
            ))}
          </div>
        </motion.div>
        <motion.div className={styles.veil} aria-hidden="true" style={scene ? { opacity: veil } : undefined} />

        <div className={styles.content}>
          <motion.h2
            id="benefits-la-serena-title"
            className={styles.title}
            style={scene ? { opacity: titleT, y: titleY } : undefined}
          >
            {siteText("benefits.titulo")}
          </motion.h2>
          {/* La frase continúa en las tarjetas: por eso termina en dos puntos */}
          <motion.p className={styles.subtitle} style={scene ? { opacity: subtitleT, y: subtitleY } : undefined}>
            En {SITE.name}, cada visita es una oportunidad para realzar tu estilo. Nos enfocamos en la calidad y la exclusividad,
            ofreciendo:
          </motion.p>
          <div className={styles.cards}>
            {benefitsList.map((benefit, index) => (
              <BenefitCardLaSerena key={benefit.title} benefit={benefit} index={index} reducedMotion={reducedMotion} progress={scene ? progress : null} />
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
    </div>
  );
}
