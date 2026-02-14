import { useRef } from "react";
import styles from "./Services.module.css";
import { servicesList } from "@/data/servicesData";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";

export const Services = () => {
  const { ref, controls } = useScrollAnimation();
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className={styles.services}>
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

        {/* Scroll horizontal */}
        <div className={styles.scrollWrapper}>
          <div className={styles.scrollContainer} ref={scrollRef}>
            {servicesList.map((service, index) => (
              <motion.div
                key={index}
                className={styles.serviceCard}
                initial={{ opacity: 0, y: 30 }}
                animate={controls}
                transition={{ delay: index * 0.1 }}
              >
                <div className={styles.imageContainer}>
                  <img
                    src={service.image}
                    alt={service.name}
                    className={styles.serviceImage}
                  />
                </div>

                <div className={styles.cardContent}>
                  <h3 className={styles.serviceName}>{service.name}</h3>

                  <div className={styles.serviceInfo}>
                    <div className={styles.infoItem}>
                      <div className={styles.icon}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <rect
                            x="2"
                            y="6"
                            width="20"
                            height="16"
                            rx="2"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M8 2v4M16 2v4M2 10h20"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>Valor</div>
                        <div className={styles.infoValue}>{service.price}</div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.icon}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                          <path
                            d="M12 6v6l4 2"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>Duración</div>
                        <div className={styles.infoValue}>
                          {service.duration}
                        </div>
                      </div>
                    </div>

                    <div className={styles.infoItem}>
                      <div className={styles.icon}>
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <path
                            d="M20 6L9 17l-5-5"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                      <div>
                        <div className={styles.infoLabel}>Incluye</div>
                        <div className={styles.infoValue}>
                          {service.includes}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className={styles.serviceDescription}>
                    {service.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
