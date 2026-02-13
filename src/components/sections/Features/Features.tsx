import { motion } from "framer-motion";
import styles from "./Features.module.css";
import { featuresList } from "@/data/featuresData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";

export const Features = () => {
  const { ref, controls } = useScrollAnimation();

  const features = featuresList.map((feature) => ({
    icon: <feature.icon size={36} />,
    title: feature.title,
    description: feature.description,
  }));

  return (
    <section id="features" className={styles.features} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <h2 className={styles.title}>
            Innovación y Calidad en Cada Detalle.
          </h2>
          <p className={styles.subtitle}>
            Combinamos la tradición con la vanguardia para ofrecerte:
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {features.map((feature, index) => (
            <motion.div key={index} className={styles.card} variants={scaleIn}>
              <div className={styles.cardIcon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
