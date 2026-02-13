import { motion } from "framer-motion";
import styles from "./Reviews.module.css";
import { reviewsList } from "@/data/reviewsData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";

export const Reviews = () => {
  const { ref, controls } = useScrollAnimation();
  const reviews = reviewsList;

  return (
    <section id="reviews" className={styles.reviews} ref={ref}>
      <div className={styles.container}>
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
            <motion.div key={index} className={styles.card} variants={scaleIn}>
              <div className={styles.rating}>{"★".repeat(review.rating)}</div>
              <p className={styles.comment}>"{review.comment}"</p>
              <div className={styles.author}>{review.name}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
