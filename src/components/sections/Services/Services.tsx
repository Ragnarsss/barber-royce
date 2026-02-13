import { motion } from "framer-motion";
import styles from "./Services.module.css";
import { servicesList } from "@/data/servicesData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, scaleIn, staggerContainer } from "@/lib/animations";

export const Services = () => {
  const { ref, controls } = useScrollAnimation();
  const services = servicesList;

  return (
    <section id="services" className={styles.services} ref={ref}>
      <div className={styles.container}>
        <motion.div
          className={styles.header}
          initial="hidden"
          animate={controls}
          variants={fadeInUp}
        >
          <h2 className={styles.title}>Nuestros Servicios</h2>
          <p className={styles.subtitle}>
            Servicios profesionales para tu mejor versión
          </p>
        </motion.div>

        <motion.div
          className={styles.grid}
          initial="hidden"
          animate={controls}
          variants={staggerContainer}
        >
          {services.map((service, index) => (
            <motion.div key={index} className={styles.card} variants={scaleIn}>
              <div className={styles.cardContent}>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
              </div>
              <div className={styles.price}>{service.price}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
