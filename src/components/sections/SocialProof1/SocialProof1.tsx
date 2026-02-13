import styles from "./SocialProof1.module.css";
import socialProofImage from "@/assets/social_proof_1.png";

export const SocialProof1 = () => {
  return (
    <section id="social-proof-1" className={styles.socialProof}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Respaldados por los mejores</h2>
          <p className={styles.subtitle}>
            Sabemos lo importante que es el cuidado e imagen para quienes viven
            de ella. Desde hace años somos casa de destacados Artistas musicales
            y Deportistas, quienes nos eligen por nuestro talento y elogian la
            calidad y profesionalismo de nuestro servicio
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.imageContainer}>
            <div className={styles.imageFrame}>
              <img src={`${socialProofImage}`} className={styles.image}></img>
            </div>
          </div>

          <div className={styles.testimonialCard}>
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
          </div>
        </div>
      </div>
    </section>
  );
};
