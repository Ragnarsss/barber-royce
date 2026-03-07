import { motion } from "framer-motion";
import styles from "./Hero.module.css";
import { HERO_BENEFITS_VIEW_DATA } from "@/data/heroData.tsx";
import backgroundImage from "@/assets/hero_model_left_profile.png";
import {
  fadeInUp,
  fadeInLeft,
  staggerContainer,
} from "@/lib/animations";
import { useParallaxLayers } from "@/hooks/useParallaxLayers";

export function Hero() {
  // Hook de parallax centralizado
  const { ref: sectionRef, layers } = useParallaxLayers<HTMLElement>(undefined, {
    offset: ["start start", "end start"],
  });

  return (
    <motion.section
      id="hero"
      ref={sectionRef}
      className={styles.hero}
      initial="hidden"
      animate="visible"
      variants={staggerContainer}
    >
      {/* Capa de fondo - triángulos con opacidad reducida */}
      <motion.div
        className={styles.leftTriangleBackground}
        style={{ y: layers.background.y, scale: layers.background.scale }}
      ></motion.div>
      <motion.div
        className={styles.rightTriangleBackground}
        style={{ y: layers.background.y, scale: layers.background.scale }}
      ></motion.div>

      {/* Capa principal - triángulos principales */}
      <motion.div
        className={styles.leftTriangle}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
      ></motion.div>
      <motion.div
        className={styles.rightTriangle}
        style={{ y: layers.middle.y, rotate: layers.middle.rotate }}
      ></motion.div>

      {/* Capa frontal - pequeños triángulos decorativos */}
      <motion.div
        className={styles.leftTriangleForeground}
        style={{ y: layers.fast.y, x: layers.fast.x }}
      ></motion.div>
      <motion.div
        className={styles.rightTriangleForeground}
        style={{ y: layers.fast.y, x: layers.fast.x }}
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
        style={{
          y: layers.foreground.y,
          scale: layers.foreground.scale,
        }}
      />

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.h1 className={styles.title} variants={fadeInUp}>
            Barbería Premium
            <br />
            Tu Estilo, Nuestra Pasión
          </motion.h1>
          <motion.p className={styles.subtitle} variants={fadeInUp}>
            En nuestra Barbería, transformamos tu corte en una expresión
            personal. Disfruta de un servicio premium y exclusivo donde la
            calidad se la roba.
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
