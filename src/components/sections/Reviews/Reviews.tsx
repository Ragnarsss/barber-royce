import styles from "./Reviews.module.css";
import { reviewsList } from "@/data/reviewsData";

export const Reviews = () => {
  const reviews = reviewsList;

  return (
    <section id="reviews" className={styles.reviews}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Lo Que Dicen Nuestros Clientes</h2>
          <p className={styles.subtitle}>
            Testimonios reales de quienes confían en nosotros
          </p>
        </div>

        <div className={styles.grid}>
          {reviews.map((review, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.rating}>{"★".repeat(review.rating)}</div>
              <p className={styles.comment}>"{review.comment}"</p>
              <div className={styles.author}>{review.name}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
