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
      carouselLabel="Innovación y calidad"
      renderItem={(feature) => (
        // Tarjeta de vidrio con esquinas cortadas, como las del Hero (BR-072)
        <article className={styles.card}>
          <div className={styles.cardIcon}>{feature.icon}</div>
          <h3 className={styles.cardTitle}>{feature.title}</h3>
          <p className={styles.cardDescription}>{feature.description}</p>
        </article>
      )}
    />
  );
}
