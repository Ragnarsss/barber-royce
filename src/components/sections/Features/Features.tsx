import { useReducedMotion, type Variants } from "framer-motion";
import type { UseScrollAnimationReturn } from "@/hooks/useScrollAnimation";
import styles from "./Features.module.css";
import { useSiteText } from "@/content/useSiteContent";
import { FEATURES_VIEW_DATA } from "@/data/featuresData.tsx";
import { AnimatedGridSection } from "@/components/common/AnimatedGridSection/AnimatedGridSection";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA } from "@/config/breakpoints";
import { FEATURES_EDGE, FEATURES_PENTAGON } from "./featuresShapes";

// ✅ React 19: memo() eliminado - bailout automático mejorado
export function Features() {
  const siteText = useSiteText();
  // El borde de los dos pentágonos de fondo se dibuja al entrar la sección, solo en escritorio y con movimiento (BR-096):
  // en móvil no suma JavaScript donde el TBT tiene poco margen, y con «reducir movimiento» aparecen dibujados.
  const reducedMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery(MEDIA.desktop);
  const edge = (controls: UseScrollAnimationReturn["controls"], variants: Variants) =>
    isDesktop && !reducedMotion ? { initial: "hidden", animate: controls, variants } : undefined;

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
      parallaxOnMobile={false}
      decoration={(controls) => (
        <>
          <div className={styles.shapeTop} data-edge-shape aria-hidden="true">
            <FixedShape shape={FEATURES_PENTAGON} edge={edge(controls, FEATURES_EDGE.top)} />
          </div>
          <div className={styles.shapeBottom} data-edge-shape aria-hidden="true">
            <FixedShape shape={FEATURES_PENTAGON} edge={edge(controls, FEATURES_EDGE.bottom)} />
          </div>
        </>
      )}
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
