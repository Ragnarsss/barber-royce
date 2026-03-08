import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import styles from "./Benefits.module.css";
import { BENEFITS_VIEW_DATA } from "@/data/benefitsData.tsx";
import barberBackImage from "@/assets/barber_back.png";

export function Benefits() {
  return (
    <section id="benefits" className={styles.benefits}>
      <div className={styles.imageBackground}>
        <img
          src={barberBackImage}
          alt="Barbero profesional trabajando"
          className={styles.backgroundImage}
        />
      </div>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.header}>
            <h2 className={styles.title}>Estilo que te acompaña, donde sea que vayas</h2>
            <p className={styles.subtitle}>
              En Royce Barbería ofrecemos una experiencia para realzar tu estilo. Nos enfocamos en la calidad y la exclusividad, ofreciendo
            </p>
          </div>
          <div className={styles.grid}>
            {BENEFITS_VIEW_DATA.map((benefit, index) => (
              <Card key={index} className={styles.card}>
                <CardHeader>
                  <CardTitle className={styles.cardTitle}>{benefit.title}</CardTitle>
                  <div className={styles.cardIcon}>{benefit.icon}</div>
                </CardHeader>
                <div className={styles.accent}></div>
                <CardContent>
                  <CardDescription className={styles.cardDescription}>{benefit.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
