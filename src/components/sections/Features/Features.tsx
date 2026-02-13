import styles from "./Features.module.css";
import { featuresList } from "@/data/featuresData";

export const Features = () => {
  const features = featuresList.map((feature) => ({
    icon: <feature.icon size={36} />,
    title: feature.title,
    description: feature.description,
  }));

  return (
    <section id="features" className={styles.features}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Innovación y Calidad en Cada Detalle.</h2>
          <p className={styles.subtitle}>
            Combinamos la tradición con la vanguardia para ofrecerte:
          </p>
        </div>

        <div className={styles.grid}>
          {features.map((feature, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardIcon}>{feature.icon}</div>
              <h3 className={styles.cardTitle}>{feature.title}</h3>
              <p className={styles.cardDescription}>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
