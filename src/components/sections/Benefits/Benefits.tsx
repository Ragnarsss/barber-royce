import styles from "./Benefits.module.css";

export const Benefits = () => {
  const benefits = [
    {
      title: "Profesionales Expertos",
      description:
        "Equipo certificado con años de experiencia en técnicas modernas y clásicas.",
    },
    {
      title: "Productos Premium",
      description:
        "Utilizamos solo las mejores marcas y productos de cuidado masculino.",
    },
    {
      title: "Ambiente Exclusivo",
      description: "Espacio diseñado para tu comodidad y relajación.",
    },
    {
      title: "Atención Personalizada",
      description: "Cada servicio adaptado a tu estilo y preferencias únicas.",
    },
  ];

  return (
    <section id="benefits" className={styles.benefits}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>¿Por Qué Elegirnos?</h2>
          <p className={styles.subtitle}>
            Más que un corte de cabello, una experiencia completa
          </p>
        </div>

        <div className={styles.grid}>
          {benefits.map((benefit, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.icon}>{index + 1}</div>
              <h3 className={styles.cardTitle}>{benefit.title}</h3>
              <p className={styles.cardDescription}>{benefit.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
