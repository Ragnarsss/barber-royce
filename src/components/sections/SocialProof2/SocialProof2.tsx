import { Camera } from "lucide-react";
import styles from "./SocialProof2.module.css";

export const SocialProof2 = () => {
  return (
    <section id="social-proof-2" className={styles.socialProof}>
      {/* Hexágono decorativo que se asoma */}
      <div className={styles.hexagon}></div>

      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.textContent}>
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
          </div>

          <div className={styles.bentoGrid}>
            {/* Fila 1: 2 items grandes + imagen lateral */}
            <div className={`${styles.bentoItem} ${styles.bentoLarge}`}>
              <Camera size={40} strokeWidth={1.5} />
            </div>
            <div className={`${styles.bentoItem} ${styles.bentoLarge}`}>
              <Camera size={40} strokeWidth={1.5} />
            </div>
            <div className={`${styles.bentoItem} ${styles.bentoTall}`}>
              <Camera size={48} strokeWidth={1.5} />
            </div>

            {/* Fila 2: 2 items */}
            <div className={`${styles.bentoItem} ${styles.bentoLarge}`}>
              <Camera size={40} strokeWidth={1.5} />
            </div>
            <div className={`${styles.bentoItem} ${styles.bentoLarge}`}>
              <Camera size={40} strokeWidth={1.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
