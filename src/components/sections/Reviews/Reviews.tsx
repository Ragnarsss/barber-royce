import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import styles from "./Reviews.module.css";
import { reviewsList } from "@/data/reviewsData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import {
  fadeInUp,
  scaleIn,
  staggerContainer,
  parallaxLayers,
} from "@/lib/animations";

export const Reviews = () => {
  const { ref, controls } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const reviews = reviewsList;

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

  return (
    <section id="reviews" className={styles.reviews} ref={sectionRef}>
      <motion.div
        className={styles.container}
        style={{ y: containerY }}
        ref={ref}
      >
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <h2 className={styles.title}>Lo Que Dicen Nuestros Clientes</h2>
          <p className={styles.subtitle}>
            Testimonios reales de quienes confían en nosotros
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {reviews.map((review, index) => (
            <motion.div key={index} variants={scaleIn}>
              <Card className={styles.card}>
                <CardContent className={styles.cardContent}>
                  <div className={styles.rating}>{"★".repeat(review.rating)}</div>
                  <p className={styles.comment}>"{review.comment}"</p>
                  <div className={styles.author}>{review.name}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};
