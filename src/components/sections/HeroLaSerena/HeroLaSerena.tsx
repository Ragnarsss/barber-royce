import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
  type MotionStyle,
} from "framer-motion";
import { Gem, HeartHandshake, Pause, Play, Star } from "lucide-react";
import { trackReserve } from "@/analytics/track";
import { useBookingUrl } from "@/branch/useBookingUrl";
import { HERO_SERENA_TIMELINE as T, wordmarkDraw } from "@/config/animations.config";
import { MEDIA } from "@/config/breakpoints";
import { SITE } from "@/config/constants";
import { useSiteText } from "@/content/useSiteContent";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { RAIL_IMAGES } from "./heroLaSerenaImages";
import { LETTERING_NAME_PATHS, LETTERING_PREFIX_PATHS, LETTERING_VIEWBOX } from "./letteringWordmark";
import { useBrandParticles } from "./useBrandParticles";
import styles from "./HeroLaSerena.module.css";

const POINTS = [
  { key: "heroserena.punto1", Icon: Star },
  { key: "heroserena.punto2", Icon: Gem },
  { key: "heroserena.punto3", Icon: HeartHandshake },
] as const;

/**
 * Rectángulos de neón encadenados, como los del techo de La Serena, detrás del bloque de tarjetas: el marco es más grande
 * que el bloque, así que los rectángulos asoman por los bordes y entre las tarjetas. `viewBox` 0 0 1000 400.
 */
const NEON_RECTS = [
  { x: 0, y: 30, width: 380, height: 300 },
  { x: 310, y: 0, width: 390, height: 250 },
  { x: 610, y: 90, width: 390, height: 310 },
  { x: 180, y: 220, width: 420, height: 180 },
] as const;

/** Las fotos dos veces seguidas: el carrusel avanza media pista y vuelve al inicio sin salto. */
const RAIL_LOOP = [...RAIL_IMAGES, ...RAIL_IMAGES];

/**
 * Hero de la portada de La Serena (BR-114, HU-SUC-002 CA-10, RF-SUC-009). Una sección alta con un escenario fijo: todo
 * avanza con el scroll. La marca «Barbería Royce» (el `h1`, visible al cargar) se deshace en partículas y deja el fondo
 * en blanco; sube el título, el subtítulo aparece letra por letra, entran tres tarjetas con gestos distintos y, al final,
 * los bordes se cierran con dos carruseles de fotos (uno sube y otro baja). Con «reducir movimiento» no hay secuencia:
 * todo se ve completo y quieto, en una sección de alto normal.
 */
export function HeroLaSerena() {
  const text = useSiteText();
  const bookingUrl = useBookingUrl();
  const reducedMotion = useReducedMotion() ?? false;
  const desktop = useMediaQuery(MEDIA.desktop);
  const [paused, setPaused] = useState(false);
  // Los carruseles se ven recién al final del scroll: se montan cuando el navegador queda libre, no en la carga (TBT).
  const [railsReady, setRailsReady] = useState(false);
  useEffect(() => {
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(() => setRailsReady(true), { timeout: 3000 });
      return () => window.cancelIdleCallback(id);
    }
    const id = window.setTimeout(() => setRailsReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  const trackRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const brandRef = useRef<HTMLHeadingElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const { scrollYProgress } = useScroll({ target: trackRef, offset: ["start 80px", "end end"] });
  // Copia del avance en un MotionValue propio: framer-motion «acelera» con una línea de tiempo nativa la opacidad atada
  // directo a `useScroll`, y en esta sección alta calculaba mal el tramo (la marca y el título quedaban a medias). Así
  // todo se calcula en JavaScript, en el mismo cuadro, sin `setState`.
  const progress = useMotionValue(scrollYProgress.get());
  useMotionValueEvent(scrollYProgress, "change", (value) => progress.set(value));
  const explode = useTransform(progress, [...T.explode], [0, 1]);
  const brandOpacity = useTransform(progress, [T.explode[0], T.explode[0] + 0.004], [1, 0]);
  const hintOpacity = useTransform(progress, [...T.hint], [1, 0]);

  // El título sube desde fuera de la pantalla (el escenario recorta lo que queda abajo): sin desvanecimiento, solo movimiento.
  const titleY = useTransform(progress, [...T.title], ["100vh", "0vh"]);
  const titleScale = useTransform(progress, [...T.title], [1.25, 1]);

  // El neón del techo: se dibuja mientras entran las tarjetas y se enciende (un brillo) cuando terminan.
  const neonDraw = useTransform(progress, [...T.neon], [0, 1]);
  const neonGlow = useTransform(progress, [...T.neonOn], [0, 1]);

  const subtitle = text("heroserena.subtitulo");
  const typed = useTransform(progress, [...T.subtitle], [0, subtitle.length]);
  const typedText = useTransform(typed, (count) => subtitle.slice(0, Math.round(count)));

  // Tres gestos distintos: desde la izquierda, desde abajo creciendo y desde la derecha girando.
  const card1 = { x: useTransform(progress, [...T.cards[0]], [-90, 0]), opacity: useTransform(progress, [...T.cards[0]], [0, 1]) };
  const card2 = {
    y: useTransform(progress, [...T.cards[1]], [70, 0]),
    scale: useTransform(progress, [...T.cards[1]], [0.8, 1]),
    opacity: useTransform(progress, [...T.cards[1]], [0, 1]),
  };
  const card3 = {
    x: useTransform(progress, [...T.cards[2]], [90, 0]),
    rotate: useTransform(progress, [...T.cards[2]], [-6, 0]),
    opacity: useTransform(progress, [...T.cards[2]], [0, 1]),
  };
  const cardStyles: MotionStyle[] = [card1, card2, card3];

  const reveal = useTransform(progress, [...T.rails], [0, 1]);
  // Los carruseles entran pegados a los bordes, con las fotos juntas y sin marco: la zona blanca se estrecha hacia el centro.
  const railStartX = useTransform(reveal, [0, 1], ["-100%", "0%"]);
  const railEndX = useTransform(reveal, [0, 1], ["100%", "0%"]);
  const railBottomY = useTransform(reveal, [0, 1], ["100%", "0%"]);

  // Los carruseles entran quietos y solo se ponen a andar cuando terminaron de estrechar la zona blanca (reveal = 1). El
  // paso se marca en un atributo del escenario, directo en el DOM, y el CSS enciende la animación: ningún `setState`
  // por scroll. Sin el atributo (o con 0), la animación queda en pausa.
  useMotionValueEvent(reveal, "change", (value) => {
    const stage = stageRef.current;
    const next = value >= 1 ? "1" : "0";
    if (stage && stage.dataset.railsSettled !== next) stage.dataset.railsSettled = next;
  });

  useBrandParticles({ stageRef, brandRef, canvasRef, progress: explode, enabled: !reducedMotion, desktop });

  /** Con «reducir movimiento», ningún estilo atado al scroll: cada elemento queda en su estado final. */
  const animated = (style: MotionStyle): MotionStyle | undefined => (reducedMotion ? undefined : style);

  return (
    <section
      ref={trackRef}
      className={`${styles.hero} ${reducedMotion ? styles.static : ""}`}
      aria-labelledby="hero-la-serena-title"
    >
      <div ref={stageRef} className={styles.stage}>
        <motion.div
          className={`${styles.rail} ${styles.railStart}`}
          style={animated(desktop ? { x: railStartX } : { y: railBottomY })}
          aria-hidden="true"
        >
          {railsReady && <RailTrack direction="forward" paused={paused} />}
        </motion.div>
        <motion.div className={`${styles.rail} ${styles.railEnd}`} style={animated({ x: railEndX })} aria-hidden="true">
          {railsReady && <RailTrack direction="backward" paused={paused} />}
        </motion.div>

        <motion.h1 ref={brandRef} id="hero-la-serena-title" className={styles.brand} style={animated({ opacity: brandOpacity })}>
          {/* El lettering del dueño dibujado: se traza solo al cargar y se rellena; las partículas salen de sus contornos */}
          <svg data-particle-path className={styles.lettering} viewBox={LETTERING_VIEWBOX} aria-hidden="true" focusable="false">
            <g className={styles.letteringPrefix}>
              {LETTERING_PREFIX_PATHS.map((d, index) => (
                <motion.path
                  key={index}
                  d={d}
                  custom={index}
                  variants={wordmarkDraw}
                  initial={reducedMotion ? false : "hidden"}
                  animate="visible"
                />
              ))}
            </g>
            <g className={styles.letteringName}>
              {LETTERING_NAME_PATHS.map((d, index) => (
                <motion.path
                  key={index}
                  d={d}
                  custom={LETTERING_PREFIX_PATHS.length + index}
                  variants={wordmarkDraw}
                  initial={reducedMotion ? false : "hidden"}
                  animate="visible"
                />
              ))}
            </g>
          </svg>
          <span className="sr-only">
            {SITE.brand.prefix} {SITE.brand.name}
          </span>
          <span className="sr-only"> en La Serena</span>
        </motion.h1>

        {!reducedMotion && <canvas ref={canvasRef} className={styles.particles} aria-hidden="true" />}

        {!reducedMotion && (
          <motion.div className={styles.hint} style={{ opacity: hintOpacity }} aria-hidden="true">
            <svg className={styles.mouse} viewBox="0 0 24 36" focusable="false">
              <rect x="1.5" y="1.5" width="21" height="33" rx="10.5" />
              <line className={styles.wheel} x1="12" y1="8" x2="12" y2="13" />
            </svg>
            <span>Desliza para descubrir</span>
          </motion.div>
        )}

        <div className={styles.content}>
          <motion.h2 className={styles.title} style={animated({ y: titleY, scale: titleScale })}>
            {text("heroserena.titulo")}
          </motion.h2>

          {reducedMotion ? (
            <p className={styles.subtitle}>{subtitle}</p>
          ) : (
            <p className={styles.subtitle}>
              {/* La copia invisible reserva el alto final; encima se escribe letra por letra. El lector oye la frase entera. */}
              <span className={styles.subtitleGhost} aria-hidden="true">
                {subtitle}
              </span>
              <motion.span className={styles.subtitleTyped} aria-hidden="true">
                {typedText}
              </motion.span>
              <span className="sr-only">{subtitle}</span>
            </p>
          )}

          <div className={styles.cardsWrap}>
          {/* El neón del techo del local enmarca el bloque de tarjetas y asoma por sus bordes. Decorativo. */}
          <svg className={styles.neonField} viewBox="0 0 1000 400" aria-hidden="true" focusable="false" preserveAspectRatio="none">
            {NEON_RECTS.map((rect, index) => (
              <motion.rect key={index} {...rect} style={reducedMotion ? undefined : { pathLength: neonDraw }} />
            ))}
            <motion.g className={styles.neonGlow} style={animated({ opacity: neonGlow })}>
              {NEON_RECTS.map((rect, index) => (
                <rect key={index} {...rect} />
              ))}
            </motion.g>
          </svg>
          <ul className={styles.cards}>
            {POINTS.map(({ key, Icon }, index) => (
              <motion.li key={key} className={styles.card} style={animated(cardStyles[index])}>
                <span className={styles.cardNumber} aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={styles.cardIconWrap}>
                  <Icon className={styles.cardIcon} aria-hidden="true" focusable="false" />
                </span>
                <span className={styles.cardText}>{text(key)}</span>
              </motion.li>
            ))}
          </ul>
          </div>

          <motion.a
            className={styles.cta}
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackReserve("portada")}
            style={animated({ opacity: card3.opacity })}
          >
            Agendar Sesión
          </motion.a>
        </div>

        <motion.button
          type="button"
          className={styles.pause}
          onClick={() => setPaused((value) => !value)}
          aria-pressed={paused}
          aria-label={paused ? "Reanudar las fotos" : "Pausar las fotos"}
          style={animated({ opacity: reveal })}
        >
          {paused ? <Play aria-hidden="true" focusable="false" /> : <Pause aria-hidden="true" focusable="false" />}
        </motion.button>
      </div>
    </section>
  );
}

/** Una pista de fotos que avanza sola (CSS) y se pausa con el cursor encima o con el botón. */
function RailTrack({ direction, paused }: { direction: "forward" | "backward"; paused: boolean }) {
  return (
    <div className={`${styles.railTrack} ${direction === "backward" ? styles.backward : ""} ${paused ? styles.paused : ""}`}>
      {RAIL_LOOP.map((image, index) => (
        <figure key={index} className={styles.railCard}>
          <img src={image.src} alt="" width={874} height={583} loading="lazy" decoding="async" style={{ objectPosition: image.position }} />
        </figure>
      ))}
    </div>
  );
}
