import { motion } from "framer-motion";
import { useMemo, useCallback } from "react";
import styles from "./Hero.module.css";
import { HERO_BENEFITS_VIEW_DATA } from "@/data/heroData.tsx";
import backgroundImage from "@/assets/hero_model_left_profile.png";

import { useParallaxLayers } from "@/hooks/useParallaxLayers";
import { useLenisReady, useRefreshLenis } from "@/contexts/LenisContext";
import { staggerContainer, fadeInUp, fadeInLeft } from "@/config/animations.config";

export function Hero() {
  const isReady = useLenisReady();
  const refreshLenis = useRefreshLenis();

  const { ref: sectionRef, layers } = useParallaxLayers<HTMLElement>(undefined, {
    offset: ["start start", "end start"],
  });

  const handleImageLoad = useCallback(() => {
    refreshLenis();
  }, [refreshLenis]);

  // Memoizar estilos para evitar recreación en cada render
  const bgTriangleStyle = useMemo(
    () => (isReady ? { y: layers.background.y, scale: layers.background.scale } : {}),
    [isReady, layers.background.y, layers.background.scale]
  );

  const middleTriangleStyle = useMemo(
    () => (isReady ? { y: layers.middle.y, rotate: layers.middle.rotate } : {}),
    [isReady, layers.middle.y, layers.middle.rotate]
  );

  const fastTriangleStyle = useMemo(
    () => (isReady ? { y: layers.fast.y, x: layers.fast.x } : {}),
    [isReady, layers.fast.y, layers.fast.x]
  );

  const imageStyle = useMemo(
    () => (isReady ? { y: layers.foreground.y, scale: layers.foreground.scale } : {}),
    [isReady, layers.foreground.y, layers.foreground.scale]
  );

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
        className={styles.leftTriangleBackground}
        style={bgTriangleStyle}
      ></motion.div>
      <motion.div
        className={styles.rightTriangleBackground}
        style={bgTriangleStyle}
      ></motion.div>

      {/* Capa principal - triángulos principales */}
      <motion.div
        className={styles.leftTriangle}
        style={middleTriangleStyle}
      ></motion.div>
      <motion.div
        className={styles.rightTriangle}
        style={middleTriangleStyle}
      ></motion.div>

      {/* Capa frontal - pequeños triángulos decorativos */}
      <motion.div
        className={styles.leftTriangleForeground}
        style={fastTriangleStyle}
      ></motion.div>
      <motion.div
        className={styles.rightTriangleForeground}
        style={fastTriangleStyle}
      ></motion.div>

      {/* Imagen del modelo - <img> tag para SEO con parallax */}
      <motion.img
        src={backgroundImage}
        alt="Barbero profesional mostrando corte moderno premium en Royce Barbería"
        className={styles.heroImageSEO}
        loading="eager"
        fetchPriority="high"
        width="800"
        height="1200"
        onLoad={handleImageLoad}
        style={imageStyle}
      />

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
