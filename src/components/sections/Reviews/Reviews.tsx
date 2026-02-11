import styles from "./Reviews.module.css";

export const Reviews = () => {
  const reviews = [
    {
      name: "Carlos M.",
      rating: 5,
      comment:
        "Excelente servicio, siempre salgo satisfecho. El mejor lugar para un corte profesional.",
    },
    {
      name: "Miguel R.",
      rating: 5,
      comment:
        "Ambiente increíble y barberos expertos. Totalmente recomendado.",
    },
    {
      name: "Juan P.",
      rating: 5,
      comment:
        "Llevo años viniendo aquí y nunca me ha decepcionado. La atención es de primera.",
    },
  ];

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
