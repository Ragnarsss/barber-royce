import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useTransform, type Variants } from "framer-motion";
import { Calendar, ArrowRight } from "lucide-react";
import styles from "./CTA1.module.css";
import cta700w from "@/assets/optimized/cta1_model_700w.webp";
import cta1400w from "@/assets/optimized/cta1_model_1400w.webp";
import profile842w from "@/assets/optimized/hero_model_left_profile_842w.webp";
import profile1060w from "@/assets/optimized/hero_model_left_profile_1060w.webp";
import profile1684w from "@/assets/optimized/hero_model_left_profile_1684w.webp";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { useParallaxProgress, useMiddleLayer, useSlowLayer, useFastLayer } from "@/hooks/useParallaxLayers";
import { useLenisScrollActive } from "@/hooks/useScrollActive";
import { edgeDraw, fadeInLeft, fadeInRight, lightBarIgnite } from "@/config/animations.config";
import { SITE } from "@/config/constants";
import { Link } from "react-router-dom";
import { trackReserve } from "@/analytics/track";
import { useSiteContent, useSiteText } from "@/content/useSiteContent";
import { useMagnetic } from "./magnetic";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA } from "@/config/breakpoints";
import { CTA_ZOOM, CTA_ZOOM_ORIGIN, CTA_ZOOM_WINDOW } from "./ctaZoom";
import { CTA_SHAPES } from "./ctaShapes";
import { AssemblePiece } from "./AssemblePiece";
import { assembleOffset, CTA_ASSEMBLE, type AssembleOffsets } from "./ctaAssemble";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";

/** Hexágono regular de puntas laterales (232 × 200), como las barras de luz del techo de la barbería (BR-058). */
const HEXAGON = "M60 3H172L228 100L172 197H60L4 100Z";

/**
 * El contorno de cada hexágono del texto se dibuja una vez al entrar la sección, con su propio desfase (BR-096): primero
 * el de atrás, después el rojo y por último el pequeño. Constantes de módulo: no son objetos nuevos en cada render.
 */
const EDGE = { background: edgeDraw(0.1), text: edgeDraw(0.3), foreground: edgeDraw(0.5) };

/**
 * Separa la primera frase del subtítulo (hasta el primer «?», «!» o «.») del resto, para ponerla en negrita en móvil
 * (BR-061). El texto sigue siendo uno solo de la hoja; si no hay un resto, no se separa nada.
 */
function splitLead(text: string): { lead: string; rest: string } | null {
  const match = text.match(/^(.+?[?!.])(\s+\S[\s\S]*)$/);
  return match ? { lead: match[1], rest: match[2] } : null;
}

export function CTA1() {
  const { business } = useSiteContent();
  const siteText = useSiteText();
  const subtitle = siteText("cta1.subtitulo");
  const subtitleParts = splitLead(subtitle);
  const reducedMotion = useReducedMotion() ?? false;
  const { ref, controls } = useScrollAnimation();
  const isWide = useMediaQuery(MEDIA.desktop);
  // El borde que se dibuja de cada hexágono, con el mismo disparador que la foto. Solo donde los hexágonos se ven (desde
  // 769 px): en móvil están ocultos y animarlos solo sumaría trabajo a la carga. Con «reducir movimiento», ninguno.
  const edgeProps = (variants: Variants) =>
    reducedMotion || !isWide ? undefined : { initial: "hidden", animate: controls, variants };
  const magnetRef = useRef<HTMLSpanElement>(null);
  const magnet = useMagnetic(magnetRef);

  // will-change solo mientras hay scroll (patrón del hero): fijo, cada capa ocupa memoria de GPU todo el tiempo.
  const animating = useLenisScrollActive() ? "isAnimating" : "";

  const { ref: sectionRef, scrollYProgress } = useParallaxProgress<HTMLElement>(undefined, {
    offset: ["start end", "end start"],
  });
  // La foto va dentro de la figura y se mueve con ella: con parallax propio se desplazaba dos veces.
  const layers = {
    middle: useMiddleLayer(scrollYProgress),
    slow: useSlowLayer(scrollYProgress),
    fast: useFastLayer(scrollYProgress),
  };
  // Zoom-in de la foto mientras la sección cruza la pantalla (BR-079); sin zoom con reducir movimiento
  const zoom = useTransform(scrollYProgress, CTA_ZOOM_WINDOW, [1, isWide ? CTA_ZOOM.DESKTOP : CTA_ZOOM.MOBILE]);

  // Ensamble de los hexágonos con el scroll (BR-097): llegan desfasados y encajan antes de que la sección quede alineada.
  // Solo en escritorio y con movimiento: en móvil las figuras no existen y con «reducir movimiento» quedan en su sitio.
  const assemble = useTransform(scrollYProgress, CTA_ASSEMBLE.WINDOW, [0, 1]);
  const barsY = useTransform(assemble, (value) => assembleOffset(CTA_ASSEMBLE.bars.y, value));
  const assembling = isWide && !reducedMotion;
  const piece = (from: AssembleOffsets, shape: ReactNode) =>
    assembling ? (
      <AssemblePiece progress={assemble} from={from}>
        {shape}
      </AssemblePiece>
    ) : (
      shape
    );
  const imageStyle = reducedMotion ? undefined : { scale: zoom, transformOrigin: isWide ? CTA_ZOOM_ORIGIN.DESKTOP : CTA_ZOOM_ORIGIN.MOBILE };

  return (
    <section id="cta-1" className={styles.cta} ref={sectionRef}>
      {/* Capa de fondo - hexágonos con opacidad reducida. Los del texto son SVG de geometría fija (BR-091) */}
      <motion.div
        className={`${styles.textHexagonBackground} ${animating}`}
        style={{ y: layers.slow.y, x: layers.slow.x }}
        data-shape
      >
        {piece(CTA_ASSEMBLE.background, <FixedShape shape={CTA_SHAPES.textHexagonBackground} edge={edgeProps(EDGE.background)} />)}
      </motion.div>
      <motion.div
        className={`${styles.imageHexagonBackground} ${animating}`}
        style={{ y: layers.slow.y, x: layers.slow.x }}
      ></motion.div>

      {/* Capa principal - hexágono rojo del texto */}
      <motion.div
        className={`${styles.textHexagon} ${animating}`}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
        data-shape="text"
      >
        {piece(CTA_ASSEMBLE.text, <FixedShape shape={CTA_SHAPES.textHexagon} edge={edgeProps(EDGE.text)} />)}
      </motion.div>

      {/* Capa frontal - hexágono decorativo */}
      <motion.div
        className={`${styles.textHexagonForeground} ${animating}`}
        style={{ y: layers.fast.y, x: layers.fast.x }}
        data-shape
      >
        {piece(CTA_ASSEMBLE.foreground, <FixedShape shape={CTA_SHAPES.textHexagonForeground} edge={edgeProps(EDGE.foreground)} />)}
      </motion.div>

      {/* Barras de luz hexagonales del techo de la barbería, arriba y cortadas por el borde: se encienden una vez (BR-058) */}
      <motion.svg
        className={styles.lightBars}
        viewBox="0 0 572 300"
        aria-hidden="true"
        data-light-bars
        style={assembling ? { y: barsY } : undefined}
        initial={reducedMotion ? false : "hidden"}
        animate={reducedMotion ? undefined : controls}
        variants={reducedMotion ? undefined : lightBarIgnite}
      >
        {/* Fila de panal: cada hexágono se encaja con el anterior, como las barras del techo vistas desde abajo */}
        <path d={HEXAGON} />
        <path d={HEXAGON} transform="translate(170 98)" />
        <path d={HEXAGON} transform="translate(340 0)" />
      </motion.svg>

      {/* Figura blanca con la foto adentro: el recorte la contiene y se mueven juntas (BR-058). Sin parallax en móvil: ahí es solo el recuadro de la foto */}
      <motion.div className={`${styles.imageHexagon} ${animating}`} style={isWide ? { y: layers.slow.y } : undefined} data-figure>
        <motion.div
          className={`${styles.imageHexagonForeground} ${animating}`}
          style={{ y: layers.fast.y, x: layers.fast.x }}
          data-shape
        >
          <FixedShape shape={CTA_SHAPES.imageHexagonForeground} />
        </motion.div>
        <motion.picture
          className={`${styles.ctaImage} ${animating}`}
          initial="hidden"
          animate={controls}
          variants={fadeInRight}
          style={imageStyle}
        >
          {/* Escritorio (desde 769 px): la foto propia de esta sección. Va primero: gana la primera fuente que coincide */}
          <source
            media={MEDIA.desktop}
            srcSet={`${cta700w} 700w, ${cta1400w} 1400w`}
            sizes="700px"
            type="image/webp"
          />
          {/* Móvil: la foto del Hero de escritorio, que muestra mejor al modelo (BR-061); son los mismos archivos del Hero */}
          <source
            srcSet={`${profile842w} 842w, ${profile1060w} 1060w, ${profile1684w} 1684w`}
            sizes="140vw"
            type="image/webp"
          />
          <img src={profile842w} alt={`Modelo con corte premium de ${SITE.name}`} loading="lazy" width="700" height="667" />
        </motion.picture>
      </motion.div>

      <div className={styles.container} ref={ref}>
        <motion.div
          className={styles.content}
          initial="hidden"
          animate={controls}
          variants={fadeInLeft}
        >
          <div className={styles.textContent}>
            <h2 className={styles.title}>{siteText("cta1.titulo")}</h2>
            <p className={styles.subtitle}>
              {subtitleParts ? (
                <>
                  <strong className={styles.lead}>{subtitleParts.lead}</strong>
                  {subtitleParts.rest}
                </>
              ) : (
                subtitle
              )}
            </p>
            <div className={styles.ctaButtons}>
              {/* El envoltorio se mueve con el cursor y dibuja el foco: el chaflán (clip-path) recortaría el contorno */}
              <motion.span ref={magnetRef} className={styles.magnet} style={{ x: magnet.x, y: magnet.y }}>
                <a className={styles.ctaButton} href={business.booking.url} target="_blank" rel="noopener noreferrer" onClick={trackReserve("cta1")}>
                  <Calendar size={20} />
                  Agendar Ahora
                </a>
              </motion.span>
              <Link to="/servicios" className={styles.ctaButtonGhost}>
                Conocer Servicios
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
