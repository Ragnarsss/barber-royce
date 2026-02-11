import styles from "./Hero.module.css";

export const Hero = () => {
  const benefits = [
    {
      icon: "⚙️",
      text: "Cortes de cabello que marcan tendencia, con un profesionalismo inigualable.",
    },
    {
      icon: "💎",
      text: "Una experiencia sorprendente y premium, diseñada para que te sientas exclusivo.",
    },
    {
      icon: "🤝",
      text: "Atención personalizada que te asegura un resultado impecable, sin prisas.",
    },
  ];

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>
            Tu Estilo,
            <br />
            Nuestra Pasión
          </h1>
          <p className={styles.subtitle}>
            En nuestra Barbería, transformamos tu corte en una expresión
            personal. Disfruta de un servicio premium y exclusivo donde la
            calidad se la roba.
          </p>

          <div className={styles.benefits}>
            {benefits.map((benefit, index) => (
              <div key={index} className={styles.benefit}>
                <div className={styles.benefitIcon}>{benefit.icon}</div>
                <p className={styles.benefitText}>{benefit.text}</p>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.imageWrapper}>
          <div className={styles.imagePlaceholder}>
            {/* Placeholder para imagen del cliente */}
            <span>📸</span>
          </div>
        </div>
      </div>
    </section>
  );
};
