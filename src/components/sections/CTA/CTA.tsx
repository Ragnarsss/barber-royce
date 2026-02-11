import { Button } from "../../common/Button";
import styles from "./CTA.module.css";

interface CTAProps {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
}

export const CTA = ({ id, title, subtitle, buttonText }: CTAProps) => {
  return (
    <section id={id} className={styles.cta}>
      <div className={styles.container}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>
        <Button size="large">{buttonText}</Button>
      </div>
    </section>
  );
};
