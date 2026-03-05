import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Droplet } from "lucide-react";
import styles from "./Benefits.module.css";
import { benefitsList } from "@/data/benefitsData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  parallaxLayers,
} from "@/lib/animations";

export const Benefits = () => {
  const { ref, controls } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);

  // Parallax effect con zoom
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const containerY = useTransform(
    scrollYProgress,
    [0, 1],
    parallaxLayers.slow.y,
  );

  const benefits = benefitsList.map((benefit) => ({
    icon: <benefit.icon size={32} />,
    title: benefit.title,
    description: benefit.description,
  }));

  return (
    <section id="benefits" className={styles.benefits} ref={sectionRef}>
      <motion.div
        className={styles.container}
        style={{ y: containerY }}
        ref={ref}
      >
        <div className={styles.content}>
          <motion.div
            className={styles.header}
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
          >
            <h2 className={styles.title}>
              Estilo que te acompaña,
              <br />
              donde sea que vayas
            </h2>
            <p className={styles.subtitle}>
              En Royce Barbería ofrecemos una experiencia para realzar tu
              estilo. Nos enfocamos en la calidad y la exclusividad, ofreciendo
            </p>
          </motion.div>

          <motion.div
            className={styles.grid}
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
          >
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                className={styles.card}
                variants={scaleIn}
              >
                <h3 className={styles.cardTitle}>{benefit.title}</h3>
                <div className={styles.cardIcon}>{benefit.icon}</div>
                <div className={styles.accent}></div>
                <p className={styles.cardDescription}>{benefit.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className={styles.imageWrapper}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <div className={styles.imagePlaceholder}>
            <Droplet size={64} strokeWidth={1.5} />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
