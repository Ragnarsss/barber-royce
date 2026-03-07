import { Card, CardContent } from "@/components/ui/card";
import styles from "./Reviews.module.css";
import { reviewsList, type Review } from "@/data/reviewsData";
import { AnimatedGridSection } from "@/components/common/AnimatedGridSection/AnimatedGridSection";

// ✅ React 19: memo() eliminado - bailout automático mejorado
export function Reviews() {
  return (
    <AnimatedGridSection<Review>
      id="reviews"
      className={styles.reviews}
      containerClassName={styles.container}
      headerClassName={styles.header}
      titleClassName={styles.title}
      subtitleClassName={styles.subtitle}
      gridClassName={styles.grid}
      title="Lo Que Dicen Nuestros Clientes"
      subtitle="Testimonios reales de quienes confían en nosotros"
      items={reviewsList}
      renderItem={(review) => (
        <Card className={styles.card}>
          <CardContent className={styles.cardContent}>
            <div className={styles.rating}>{"★".repeat(review.rating)}</div>
            <p className={styles.comment}>"{review.comment}"</p>
            <div className={styles.author}>{review.name}</div>
          </CardContent>
        </Card>
      )}
    />
  );
}
