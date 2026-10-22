import { motion, useReducedMotion, useTransform } from "framer-motion";
import { useCallback } from "react";
import styles from "./Hero.module.css";
import { HERO_BENEFITS_VIEW_DATA } from "@/data/heroData.tsx";
import heroImage842w from "@/assets/optimized/hero_model_left_profile_842w.webp";
import heroImage1060w from "@/assets/optimized/hero_model_left_profile_1060w.webp";
import heroImage1684w from "@/assets/optimized/hero_model_left_profile_1684w.webp";
import heroMobile780w from "@/assets/optimized/hero_mobile_780w.webp";
import heroMobile1170w from "@/assets/optimized/hero_mobile_1170w.webp";

import { useParallaxProgress, useBackgroundLayer, useMiddleLayer, useForegroundLayer, useFastLayer } from "@/hooks/useParallaxLayers";
import { useLenisReady, useRefreshLenis } from "@/hooks/useLenisContext";
import { useLenisScrollActive } from "@/hooks/useScrollActive";
import { staggerContainer, fadeInUp, letterRise, letterStagger, edgeDraw } from "@/config/animations.config";
import { SITE } from "@/config/constants";
import { useSiteText } from "@/content/useSiteContent";
import { useNeonLoaderDone } from "@/loader/neonLoader";
import { SPOTLIGHT_SIZE, usePointerSpotlight } from "./spotlight";
import { BenefitCard } from "./BenefitCard";
import { HERO_DIAGONAL, HERO_SHAPES } from "./heroShapes";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";
import { HERO_ZOOM, HERO_ZOOM_ORIGIN } from "./heroZoom";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA } from "@/config/breakpoints";

/** Cómo se dibuja el filo de luz de las diagonales: una constante, para que no sea un objeto nuevo en cada render. */
const HERO_EDGE_DRAW = edgeDraw(0.35);

export function Hero() {
  const siteText = useSiteText();
  const isLenisReady = useLenisReady();
  const reducedMotion = useReducedMotion() ?? false;
  // Con "reducir movimiento" no hay Lenis: el Hero se muestra sin esperarlo (BR-017).
  // Su entrada arranca cuando sale el letrero de neón de index.html (BR-054).
  const isLoaderDone = useNeonLoaderDone();
  const isReady = (isLenisReady || reducedMotion) && isLoaderDone;
  const refreshLenis = useRefreshLenis();

  // OPTIMIZACIÓN FASE 3: will-change dinámico (solo durante scroll activo)
  const isScrolling = useLenisScrollActive();

  const { ref: sectionRef, scrollYProgress } = useParallaxProgress<HTMLElement>(undefined, {
    offset: ["start start", "end start"],
  });
  const spotlight = usePointerSpotlight(sectionRef);
  // Profundidad de las tarjetas al hacer scroll (BR-056): en móvil quedan bajo el pliegue y se superpondrían al texto.
  const isWide = useMediaQuery(MEDIA.desktop);
  const hasCardDepth = isWide && !reducedMotion;
  const layers = {
    background: useBackgroundLayer(scrollYProgress),
    middle: useMiddleLayer(scrollYProgress),
    foreground: useForegroundLayer(scrollYProgress),
    fast: useFastLayer(scrollYProgress),
  };
  // Zoom-in de la foto mientras el Hero sale de la pantalla (BR-079): capa propia, más marcada que la «foreground»
  const zoom = useTransform(scrollYProgress, [0, 1], [1, isWide ? HERO_ZOOM.DESKTOP : HERO_ZOOM.MOBILE]);
  const heroImageStyle = !isReady
    ? {}
    : reducedMotion
      ? // Sin zoom. En móvil, sin ningún movimiento: el desplazamiento vertical dejaría una franja vacía arriba
        isWide
        ? { y: layers.foreground.y, scale: layers.foreground.scale }
        : {}
      : {
          // El parallax vertical solo en escritorio: en móvil la foto cubre toda la portada y el zoom no deja huecos
          ...(isWide ? { y: layers.foreground.y } : {}),
          scale: zoom,
          transformOrigin: isWide ? HERO_ZOOM_ORIGIN.DESKTOP : HERO_ZOOM_ORIGIN.MOBILE,
        };

  // El filo de luz de las diagonales se dibuja una vez cuando la portada se activa, después del neón (BR-096). Con
  // «reducir movimiento» no hay variantes: el filo aparece dibujado.
  const edgeVariants = reducedMotion ? undefined : HERO_EDGE_DRAW;

  const handleImageLoad = useCallback(() => {
    refreshLenis();
  }, [refreshLenis]);

  return (
    <motion.section
      id="hero"
      ref={sectionRef}
      className={styles.hero}
      initial="hidden"
      animate={isReady ? "visible" : "hidden"}
      variants={staggerContainer}
    >
      {/* Capa de fondo - triángulos con opacidad reducida */}
      {/* Cada triángulo es un SVG de geometría fija (BR-091) dentro de la capa que lleva su parallax */}
      <motion.div
        className={`${styles.leftTriangleBackground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.background.y, scale: layers.background.scale } : {}}
        data-shape
      >
        <FixedShape shape={HERO_SHAPES.leftTriangleBackground} />
      </motion.div>
      <motion.div
        className={`${styles.rightTriangleBackground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.background.y, scale: layers.background.scale } : {}}
        data-shape
      >
        <FixedShape shape={HERO_SHAPES.rightTriangleBackground} />
      </motion.div>

      {/* Capa principal - triángulos principales, con degradado y un filo de luz en la diagonal (BR-055) */}
      <motion.div
        className={`${styles.leftTriangle} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.middle.y, rotate: layers.middle.rotate } : {}}
        data-shape
      >
        <FixedShape shape={HERO_SHAPES.leftTriangle}>
          <defs>
            <linearGradient id="hero-red-left" x1="0.25" y1="0.07" x2="0.75" y2="0.93">
              <stop offset="0" className={styles.stopRedLight} />
              <stop offset="0.4" className={styles.stopRed} />
              <stop offset="1" className={styles.stopRedDeep} />
            </linearGradient>
          </defs>
          <motion.line className={styles.edge} {...HERO_DIAGONAL} variants={edgeVariants} />
        </FixedShape>
      </motion.div>
      <motion.div
        className={`${styles.rightTriangle} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.middle.y, rotate: layers.middle.rotate } : {}}
        data-shape
      >
        <FixedShape shape={HERO_SHAPES.rightTriangle}>
          <defs>
            <linearGradient id="hero-red-right" x1="0.25" y1="0.07" x2="0.75" y2="0.93">
              <stop offset="0" className={styles.stopRed} />
              <stop offset="1" className={styles.stopRedDeep} />
            </linearGradient>
          </defs>
          <motion.line className={styles.edge} {...HERO_DIAGONAL} variants={edgeVariants} />
        </FixedShape>
      </motion.div>

      {/* Capa frontal - pequeños triángulos decorativos */}
      <motion.div
        className={`${styles.leftTriangleForeground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.fast.y, x: layers.fast.x } : {}}
        data-shape
      >
        <FixedShape shape={HERO_SHAPES.leftTriangleForeground} />
      </motion.div>
      <motion.div
        className={`${styles.rightTriangleForeground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.fast.y, x: layers.fast.x } : {}}
        data-shape
      >
        <FixedShape shape={HERO_SHAPES.rightTriangleForeground} />
      </motion.div>

      {/* Grano y haz de luz que sigue al cursor (BR-055): bajo la foto y el texto */}
      <div className={styles.grain} aria-hidden="true" />
      {spotlight.enabled && (
        <motion.div
          className={styles.spotlight}
          aria-hidden="true"
          data-spotlight
          style={{ x: spotlight.x, y: spotlight.y, opacity: spotlight.opacity, width: SPOTLIGHT_SIZE, height: SPOTLIGHT_SIZE }}
        />
      )}

      {/* Imagen del modelo - <picture> tag para SEO con parallax y responsive images */}
      <motion.picture className={styles.heroImageSEO} style={heroImageStyle}>
        {/* Escritorio (desde 769 px): la foto a media pantalla. Va primero: gana la primera fuente que coincide */}
        <source
          media={MEDIA.desktop}
          srcSet={`${heroImage842w} 842w, ${heroImage1060w} 1060w, ${heroImage1684w} 1684w`}
          sizes="(max-width: 1400px) 50vw, 842px"
          type="image/webp"
        />
        {/* Móvil: foto a pantalla completa como fondo (BR-061). El mismo <picture> elige el archivo, no se baja otro. */}
        <source
          srcSet={`${heroMobile780w} 780w, ${heroMobile1170w} 1170w`}
          sizes="100vw"
          type="image/webp"
        />
        <motion.img
          src={heroMobile780w}
          alt={`Barbero profesional mostrando corte moderno premium en ${SITE.name}`}
          loading="eager"
          fetchPriority="high"
          width="842"
          height="925"
          onLoad={handleImageLoad}
          // Llena su caja en todo tamaño: el encuadre (object-fit y punto de enfoque) lo pone el CSS (BR-093)
          style={{ width: "100%", height: "100%" }}
        />
      </motion.picture>

      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            <motion.span className={styles.prefix} variants={fadeInUp}>
              {SITE.brand.prefix}
            </motion.span>{" "}
            <span className={styles.wordmark}>
              {/* Las letras se separan solo para animarlas: el lector de pantalla lee la palabra entera */}
              <span className={styles.srOnly}>{SITE.brand.name}</span>
              <motion.span className={styles.letters} aria-hidden="true" variants={letterStagger}>
                {[...SITE.brand.name].map((letter, index) =>
                  reducedMotion ? (
                    <span key={index} className={styles.letterMask}>
                      <span className={styles.letter} data-letter>{letter}</span>
                    </span>
                  ) : (
                    <span key={index} className={styles.letterMask}>
                      <motion.span className={styles.letter} variants={letterRise} data-letter>{letter}</motion.span>
                    </span>
                  ),
                )}
              </motion.span>
              {!reducedMotion && (
                <span className={styles.shine} aria-hidden="true" data-shine>
                  {SITE.brand.name}
                </span>
              )}
            </span>{" "}
            <motion.span className={styles.tagline} variants={fadeInUp}>
              {siteText("hero.lema")}
            </motion.span>
          </h1>
          <motion.p className={styles.subtitle} variants={fadeInUp}>
            Donde el estilo se encuentra con la excelencia. <strong>Un servicio dedicado, detallista y a tu altura.</strong> ¡Descubre una experiencia única en cada visita!
          </motion.p>

          <motion.div className={styles.benefits} variants={staggerContainer}>
            {HERO_BENEFITS_VIEW_DATA.map((benefit, index) => (
              <BenefitCard
                key={index}
                icon={benefit.icon}
                text={benefit.text}
                index={index}
                progress={scrollYProgress}
                depth={hasCardDepth}
              />
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
