import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./Services.module.css";
import { servicesList } from "@/data/servicesData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp } from "@/lib/animations";

export const Services = () => {
  const { ref, controls } = useScrollAnimation();
  const sectionRef = useRef<HTMLElement>(null);
  const services = servicesList;

  // Configurar scroll horizontal
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Movimiento horizontal basado en scroll vertical
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["5%", `-${(services.length - 3) * 25}%`],
  );

  return (
    <section id="services" className={styles.services} ref={sectionRef}>
      <div className={styles.container} ref={ref}>
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

        {/* Contenedor de scroll horizontal */}
        <div className={styles.horizontalScrollContainer}>
          <motion.div className={styles.horizontalScroll} style={{ x }}>
            {services.map((service, index) => {
              // Cada card aparece con delay incremental (Técnica 8: Stagger)
              const cardProgress = useTransform(
                scrollYProgress,
                [index * 0.08, (index + 1) * 0.1],
                [0, 1],
              );
              const opacity = useTransform(cardProgress, [0, 1], [0, 1]);
              const scale = useTransform(cardProgress, [0, 1], [0.85, 1]);
              const y = useTransform(cardProgress, [0, 1], [40, 0]);

              return (
                <motion.div
                  key={index}
                  className={styles.card}
                  style={{ opacity, scale, y }}
                >
                  <div className={styles.cardContent}>
                    <h3 className={styles.serviceName}>{service.name}</h3>
                    <p className={styles.serviceDescription}>
                      {service.description}
                    </p>
                  </div>
                  <div className={styles.price}>{service.price}</div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
