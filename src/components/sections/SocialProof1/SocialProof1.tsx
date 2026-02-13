import { motion } from "framer-motion";
import styles from "./SocialProof1.module.css";
import socialProofImage from "@/assets/social_proof_1.png";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, fadeInLeft, fadeInRight } from "@/lib/animations";

export const SocialProof1 = () => {
  const { ref, controls } = useScrollAnimation();

  return (
    <section id="social-proof-1" className={styles.socialProof} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <h2 className={styles.title}>Respaldados por los mejores</h2>
          <p className={styles.subtitle}>
            Sabemos lo importante que es el cuidado e imagen para quienes viven
            de ella. Desde hace años somos casa de destacados Artistas musicales
            y Deportistas, quienes nos eligen por nuestro talento y elogian la
            calidad y profesionalismo de nuestro servicio
          </p>
        </motion.div>

        <div className={styles.content}>
          <motion.div
            className={styles.imageContainer}
            initial="hidden"
            animate={controls}
            variants={fadeInLeft}
          >
            <div className={styles.imageFrame}>
              <img src={`${socialProofImage}`} className={styles.image}></img>
            </div>
          </motion.div>

          <motion.div
            className={styles.testimonialCard}
            initial="hidden"
            animate={controls}
            variants={fadeInRight}
          >
            <div className={styles.testimonialContent}>
              <p className={styles.testimonialText}>
                "Cuando necesito un corte que hable por sí solo, confío en Royce
                Barbería. Su profesionalismo y atención al detalle son
                inigualables."
              </p>
              <div className={styles.author}>
                <strong>DrefQuila</strong>
                <span>Artista Urbano Chileno</span>
                <strong className={styles.clientBadge}>
                  Cliente nuestro hace 5 años
                </strong>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
