import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import styles from "./Features.module.css";
import { useSiteText } from "@/content/useSiteContent";
import { FEATURES_VIEW_DATA } from "@/data/featuresData.tsx";
import { AnimatedGridSection } from "@/components/common/AnimatedGridSection/AnimatedGridSection";

// ✅ React 19: memo() eliminado - bailout automático mejorado
export function Features() {
  const siteText = useSiteText();
  // ✅ React 19: useMemo eliminado - datos pre-transformados en import
  return (
    <AnimatedGridSection
      id="features"
      className={styles.features}
      containerClassName={styles.container}
      headerClassName={styles.header}
      titleClassName={styles.title}
      subtitleClassName={styles.subtitle}
      gridClassName={styles.grid}
      title={siteText("features.titulo")}
      subtitle={siteText("features.subtitulo")}
      items={FEATURES_VIEW_DATA}
      renderItem={(feature) => (
        <Card className={styles.card}>
          <CardHeader>
            <div className={styles.cardIcon}>{feature.icon}</div>
            <CardTitle className={styles.cardTitle}>{feature.title}</CardTitle>
            <CardDescription className={styles.cardDescription}>{feature.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
    />
  );
}
