import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
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
import { staggerContainer, fadeInUp, letterRise, letterStagger } from "@/config/animations.config";
import { SITE } from "@/config/constants";
import { useSiteText } from "@/content/useSiteContent";
import { useNeonLoaderDone } from "@/loader/neonLoader";
import { SPOTLIGHT_SIZE, usePointerSpotlight } from "./spotlight";
import { BenefitCard } from "./BenefitCard";

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
  const [isWide] = useState(() => typeof window !== "undefined" && window.matchMedia?.("(min-width: 769px)").matches === true);
  const hasCardDepth = isWide && !reducedMotion;
  const layers = {
    background: useBackgroundLayer(scrollYProgress),
    middle: useMiddleLayer(scrollYProgress),
    foreground: useForegroundLayer(scrollYProgress),
    fast: useFastLayer(scrollYProgress),
  };

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
      <motion.div
        className={`${styles.leftTriangleBackground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.background.y, scale: layers.background.scale } : {}}
      ></motion.div>
      <motion.div
        className={`${styles.rightTriangleBackground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.background.y, scale: layers.background.scale } : {}}
      ></motion.div>

      {/* Capa principal - triángulos principales */}
      <motion.div
        className={`${styles.leftTriangle} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.middle.y, rotate: layers.middle.rotate } : {}}
      ></motion.div>
      <motion.div
        className={`${styles.rightTriangle} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.middle.y, rotate: layers.middle.rotate } : {}}
      ></motion.div>

      {/* Capa frontal - pequeños triángulos decorativos */}
      <motion.div
        className={`${styles.leftTriangleForeground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.fast.y, x: layers.fast.x } : {}}
      ></motion.div>
      <motion.div
        className={`${styles.rightTriangleForeground} ${isScrolling ? 'isAnimating' : ''}`}
        style={isReady ? { y: layers.fast.y, x: layers.fast.x } : {}}
      ></motion.div>

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
      <motion.picture
        className={styles.heroImageSEO}
        style={isReady ? { y: layers.foreground.y, scale: layers.foreground.scale } : {}}
      >
        {/* Móvil: foto a pantalla completa como fondo (BR-061). El mismo <picture> elige el archivo, no se baja otro. */}
        <source
          media="(max-width: 768px)"
          srcSet={`${heroMobile780w} 780w, ${heroMobile1170w} 1170w`}
          sizes="100vw"
          type="image/webp"
        />
        <source
          srcSet={`${heroImage842w} 842w, ${heroImage1060w} 1060w, ${heroImage1684w} 1684w`}
          sizes="(max-width: 1400px) 50vw, 842px"
          type="image/webp"
        />
        <motion.img
          src={heroImage842w}
          alt={`Barbero profesional mostrando corte moderno premium en ${SITE.name}`}
          loading="eager"
          fetchPriority="high"
          width="842"
          height="925"
          onLoad={handleImageLoad}
          style={{ width: "100%", height: "auto" }}
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
