import { useReducedMotion, type Variants } from "framer-motion";
import type { UseScrollAnimationReturn } from "@/hooks/useScrollAnimation";
import styles from "./Reviews.module.css";
import { useSiteText } from "@/content/useSiteContent";
import { reviewsList } from "@/data/reviewsData";
import type { Review } from "@/types/review.types";
import { AnimatedGridSection } from "@/components/common/AnimatedGridSection/AnimatedGridSection";
import { FixedShape } from "@/components/common/FixedShape/FixedShape";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { MEDIA } from "@/config/breakpoints";
import { REVIEWS_EDGE, REVIEWS_SHAPES } from "./reviewsShapes";

// ✅ React 19: memo() eliminado - bailout automático mejorado
export function Reviews() {
  const siteText = useSiteText();
  // El borde del octágono y del hexágono de fondo se dibuja al entrar la sección, solo en escritorio y con movimiento
  // (BR-096): en móvil no suma JavaScript, y con «reducir movimiento» aparecen dibujados.
  const reducedMotion = useReducedMotion() ?? false;
  const isDesktop = useMediaQuery(MEDIA.desktop);
  const edge = (controls: UseScrollAnimationReturn["controls"], variants: Variants) =>
    isDesktop && !reducedMotion ? { initial: "hidden", animate: controls, variants } : undefined;

  return (
    <AnimatedGridSection<Review>
      id="reviews"
      className={styles.reviews}
      containerClassName={styles.container}
      headerClassName={styles.header}
      titleClassName={styles.title}
      subtitleClassName={styles.subtitle}
      gridClassName={styles.grid}
      title={siteText("reviews.titulo")}
      subtitle={siteText("reviews.subtitulo")}
      items={reviewsList}
      carouselLabel="Reseñas de clientes"
      carouselDesktopVisible={3}
      decoration={(controls) => (
        <>
          <div className={styles.shapeTop} data-edge-shape aria-hidden="true">
            <FixedShape shape={REVIEWS_SHAPES.octagon} edge={edge(controls, REVIEWS_EDGE.top)} />
          </div>
          <div className={styles.shapeBottom} data-edge-shape aria-hidden="true">
            <FixedShape shape={REVIEWS_SHAPES.hexagon} edge={edge(controls, REVIEWS_EDGE.bottom)} />
          </div>
        </>
      )}
      renderItem={(review) => (
        // Tarjeta de vidrio con esquinas cortadas, como las del Hero (BR-069)
        <article className={styles.card}>
          <div className={styles.rating}>{"★".repeat(review.rating)}</div>
          <p className={styles.comment}>"{review.comment}"</p>
          <div className={styles.author}>{review.name}</div>
        </article>
      )}
    />
  );
}
