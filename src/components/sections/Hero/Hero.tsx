import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import styles from "./Hero.module.css";
import { heroBenefits } from "@/data/heroData";
import backgroundImage from "@/assets/hero_model_left_profile.png";
import {
  fadeInUp,
  fadeInLeft,
  staggerContainer,
  parallaxLayers,
} from "@/lib/animations";

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect para múltiples capas
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  // Imagen principal - capa frontal
  const imageY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.y,
  );
  const imageScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.foreground.scale,
  );

  // Triángulos principales - capa media
  const trianglesY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.y,
  );
  const trianglesRotate = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.middle.rotate,
  );

  // Capas decorativas de fondo - más lentas
  const bgLayerY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.y,
  );
  const bgLayerScale = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.background.scale,
  );

  // Capa superior - más rápida
  const fgLayerY = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.y);
  const fgLayerX = useTransform(scrollYProgress, [0, 1], parallaxLayers.fast.x);

  const benefits = heroBenefits.map((benefit) => ({
    icon: <benefit.icon size={24} />,
    text: benefit.text,
  }));

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
        style={{ y: bgLayerY, scale: bgLayerScale }}
      ></motion.div>
      <motion.div
        className={styles.rightTriangleBackground}
        style={{ y: bgLayerY, scale: bgLayerScale }}
      ></motion.div>

      {/* Capa principal - triángulos principales */}
      <motion.div
        className={styles.leftTriangle}
        style={{ y: trianglesY, rotate: trianglesRotate }}
      ></motion.div>
      <motion.div
        className={styles.rightTriangle}
        style={{ y: trianglesY, rotate: trianglesRotate }}
      ></motion.div>

      {/* Capa frontal - pequeños triángulos decorativos */}
      <motion.div
        className={styles.leftTriangleForeground}
        style={{ y: fgLayerY, x: fgLayerX }}
      ></motion.div>
      <motion.div
        className={styles.rightTriangleForeground}
        style={{ y: fgLayerY, x: fgLayerX }}
      ></motion.div>

      {/* Imagen del modelo con parallax */}
      <motion.div
        className={styles.heroImage}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          y: imageY,
          scale: imageScale,
        }}
      ></motion.div>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.h1 className={styles.title} variants={fadeInUp}>
            Tu Estilo,
            <br />
            Nuestra Pasión
          </motion.h1>
          <motion.p className={styles.subtitle} variants={fadeInUp}>
            En nuestra Barbería, transformamos tu corte en una expresión
            personal. Disfruta de un servicio premium y exclusivo donde la
            calidad se la roba.
          </motion.p>

          <motion.div className={styles.benefits} variants={staggerContainer}>
            {benefits.map((benefit, index) => (
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
