import { motion } from "framer-motion";
import { Camera } from "lucide-react";
import styles from "./SocialProof2.module.css";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";

export const SocialProof2 = () => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="social-proof-2" className={styles.socialProof} ref={ref}>
      {/* Hexágono decorativo que se asoma */}
      <div className={styles.hexagon}></div>

      <div className={styles.container}>
        <div className={styles.content}>
          <motion.div
            className={styles.textContent}
            initial="hidden"
            animate={controls}
            variants={fadeInUp}
          >
            <h2 className={styles.title}>
              Clientes Felices,
              <br />
              Estilos Impecables.
            </h2>
            <p className={styles.subtitle}>
              El trabajo realizado y la felicidad en nuestros clientes es el
              verdadero pago. Tu satisfacción es nuestra mejor carta de
              presentación.
            </p>
          </motion.div>

          <motion.div
            className={styles.bentoGrid}
            initial="hidden"
            animate={controls}
            variants={staggerContainer}
          >
            {/* Fila 1: 2 items grandes + imagen lateral */}
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoTall}`}
              variants={scaleIn}
            >
              <Camera size={48} strokeWidth={1.5} />
            </motion.div>

            {/* Fila 2: 2 items */}
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
            <motion.div
              className={`${styles.bentoItem} ${styles.bentoLarge}`}
              variants={scaleIn}
            >
              <Camera size={40} strokeWidth={1.5} />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
