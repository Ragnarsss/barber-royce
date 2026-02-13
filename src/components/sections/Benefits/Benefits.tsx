import { Droplet } from "lucide-react";
import styles from "./Benefits.module.css";
import { benefitsList } from "@/data/benefitsData";

export const Benefits = () => {
  const benefits = benefitsList.map((benefit) => ({
    icon: <benefit.icon size={32} />,
    title: benefit.title,
    description: benefit.description,
  }));

  return (
    <section id="benefits" className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>
              Estilo que te acompaña,
              <br />
              donde sea que vayas
            </h2>
            <p className={styles.subtitle}>
              En Royce Barbería ofrecemos una experiencia para realzar tu
              estilo. Nos enfocamos en la calidad y la exclusividad, ofreciendo
            </p>
          </div>

          <div className={styles.grid}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.card}>
                <h3 className={styles.cardTitle}>{benefit.title}</h3>
                <div className={styles.cardIcon}>{benefit.icon}</div>
                <div className={styles.accent}></div>
                <p className={styles.cardDescription}>{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.imageWrapper}>
          <div className={styles.imagePlaceholder}>
            <Droplet size={64} strokeWidth={1.5} />
          </div>
        </div>
      </div>
    </section>
  );
};
