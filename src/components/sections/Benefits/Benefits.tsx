import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import styles from "./Benefits.module.css";
import { BENEFITS_VIEW_DATA } from "@/data/benefitsData.tsx";
import { AnimatedGridSection } from "@/components/common/AnimatedGridSection/AnimatedGridSection";

export function Benefits() {
  return (
    <AnimatedGridSection
      id="benefits"
      className={styles.benefits}
      containerClassName={styles.container}
      headerClassName={styles.header}
      titleClassName={styles.title}
      subtitleClassName={styles.subtitle}
      gridClassName={styles.grid}
      title="Estilo que te acompaña, donde sea que vayas"
      subtitle="En Royce Barbería ofrecemos una experiencia para realzar tu estilo. Nos enfocamos en la calidad y la exclusividad, ofreciendo"
      items={BENEFITS_VIEW_DATA}
      renderItem={(benefit) => (
        <Card className={styles.card}>
          <CardHeader>
            <CardTitle className={styles.cardTitle}>{benefit.title}</CardTitle>
            <div className={styles.cardIcon}>{benefit.icon}</div>
          </CardHeader>
          <div className={styles.accent}></div>
          <CardContent>
            <CardDescription className={styles.cardDescription}>{benefit.description}</CardDescription>
          </CardContent>
        </Card>
      )}
    />
  );
}
