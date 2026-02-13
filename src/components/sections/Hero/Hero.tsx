import styles from "./Hero.module.css";
import { heroBenefits } from "@/data/heroData";
import backgroundImage from "@/assets/hero_model_left_profile.png";

export function Hero() {
  const benefits = heroBenefits.map((benefit) => ({
    icon: <benefit.icon size={24} />,
    text: benefit.text,
  }));

  return (
    <section id="hero" className={styles.hero}>
      <div className={styles.leftTriangle}></div>
      <div className={styles.rightTriangle}></div>
      <div
        className={styles.heroImage}
        style={{ backgroundImage: `url(${backgroundImage})` }}
      ></div>
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
      </div>
    </section>
  );
}
