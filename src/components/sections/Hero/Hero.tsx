import { motion } from "framer-motion";
import { useCallback } from "react";
import styles from "./Hero.module.css";
import { HERO_BENEFITS_VIEW_DATA } from "@/data/heroData.tsx";
import heroImage842w from "@/assets/optimized/hero_model_left_profile_842w.webp";
import heroImage1060w from "@/assets/optimized/hero_model_left_profile_1060w.webp";
import heroImage1684w from "@/assets/optimized/hero_model_left_profile_1684w.webp";
import heroImageAvif from "@/assets/optimized/hero_model_left_profile_842w.avif";
import backgroundImage from "@/assets/hero_model_left_profile.png";

import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import { useLenisReady, useRefreshLenis } from "@/contexts/LenisContext";
import { useLenisScrollActive } from "@/hooks/useScrollActive";
import { staggerContainer, fadeInUp, fadeInLeft } from "@/config/animations.config";

export function Hero() {
  const isReady = useLenisReady();
  const refreshLenis = useRefreshLenis();

  // OPTIMIZACIÓN FASE 3: will-change dinámico (solo durante scroll activo)
  const isScrolling = useLenisScrollActive();

  const { ref: sectionRef, layers } = useParallaxLayers<HTMLElement>(undefined, {
    offset: ["start start", "end start"],
  });

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

      {/* Imagen del modelo - <picture> tag para SEO con parallax y responsive images */}
      <motion.picture
        className={styles.heroImageSEO}
        style={isReady ? { y: layers.foreground.y, scale: layers.foreground.scale } : {}}
      >
        <source
          srcSet={`${heroImage842w} 842w, ${heroImage1060w} 1060w, ${heroImage1684w} 1684w`}
          sizes="(max-width: 768px) 100vw, (max-width: 1400px) 50vw, 842px"
          type="image/webp"
        />
        <source
          srcSet={heroImageAvif}
          type="image/avif"
        />
        <motion.img
          src={backgroundImage}
          alt="Barbero profesional mostrando corte moderno premium en Royce Barbería"
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
          <motion.h1 className={styles.title} variants={fadeInUp}>
            Barbería Royce,
            <br />
            profesionalismo, pasión y arte.
          </motion.h1>
          <motion.p className={styles.subtitle} variants={fadeInUp}>
            Donde el estilo se encuentra con la excelencia. <strong>Un servicio dedicado, detallista y a tu altura.</strong> ¡Descubre una experiencia única en cada visita!
          </motion.p>

          <motion.div className={styles.benefits} variants={staggerContainer}>
            {HERO_BENEFITS_VIEW_DATA.map((benefit, index) => (
              <motion.div
                key={index}
                className={styles.benefit}
                variants={fadeInLeft}
              >
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <p className={styles.benefitText}>{benefit.text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
