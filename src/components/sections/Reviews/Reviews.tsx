import styles from "./Reviews.module.css";
import { useSiteText } from "@/content/useSiteContent";
import { reviewsList } from "@/data/reviewsData";
import type { Review } from "@/types/review.types";
import { AnimatedGridSection } from "@/components/common/AnimatedGridSection/AnimatedGridSection";

// ✅ React 19: memo() eliminado - bailout automático mejorado
export function Reviews() {
  const siteText = useSiteText();
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
