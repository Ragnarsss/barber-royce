import styles from "./SocialProof.module.css";

interface SocialProofProps {
  id: string;
}

export const SocialProof = ({ id }: SocialProofProps) => {
  const stats = [
    { number: "10K+", label: "Clientes Satisfechos" },
    { number: "15+", label: "Años de Experiencia" },
    { number: "4.9", label: "Rating Promedio" },
    { number: "98%", label: "Recomendaciones" },
  ];

  return (
    <section id={id} className={styles.socialProof}>
      <div className={styles.container}>
        <div className={styles.grid}>
          {stats.map((stat, index) => (
            <div key={index} className={styles.stat}>
              <div className={styles.number}>{stat.number}</div>
              <div className={styles.label}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
