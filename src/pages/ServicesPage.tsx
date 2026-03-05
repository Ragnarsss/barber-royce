import { motion } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import styles from "./ServicesPage.module.css";
import { servicesList } from "../data/servicesData";

export const ServicesPage = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleWheel = (e: WheelEvent) => {
      if (isHovering) {
        // Prevenir el scroll de la página
        e.preventDefault();
        e.stopPropagation();

        // Convertir el scroll vertical en horizontal
        const scrollAmount = e.deltaY;
        scrollContainer.scrollLeft += scrollAmount;
      }
    };

    // Agregar el event listener en la fase de captura para interceptar antes
    scrollContainer.addEventListener("wheel", handleWheel, {
      passive: false,
      capture: true
    });

    return () => {
      scrollContainer.removeEventListener("wheel", handleWheel, true);
    };
  }, [isHovering]);

  // Pausar/reanudar Lenis cuando se hace hover
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (!lenis) return;

    if (isHovering) {
      lenis.stop();
    } else {
      lenis.start();
    }

    // Cleanup: asegurarse de que Lenis esté activo al desmontar
    return () => {
      if (lenis) {
        lenis.start();
      }
    };
  }, [isHovering]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Nuestros Servicios</h1>
          <p className={styles.subtitle}>
            Calidad premium y atención personalizada en cada detalle
          </p>
        </div>
      </div>

      <div className={styles.content}>
        {/* Wrapper con fade gradient */}
        <div className={styles.scrollWrapper}>
          {/* Fade gradient izquierdo */}
          <div className={styles.fadeLeft} />

          {/* Scroll horizontal container */}
          <div
            ref={scrollContainerRef}
            className={styles.scrollContainer}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
          >
            <div className={styles.scrollContent}>
              {servicesList.map((service, idx) => (
                <motion.div
                  key={idx}
                  className={styles.serviceCard}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  viewport={{ once: true, margin: "-100px" }}
                >
                  {/* Imagen de fondo */}
                  <div
                    className={styles.cardBackground}
                    style={{ backgroundImage: `url(${service.image})` }}
                  />

                  {/* Overlay oscuro */}
                  <div className={styles.cardOverlay} />

                  {/* Contenido de la tarjeta */}
                  <div className={styles.cardContent}>
                    <h3 className={styles.serviceName}>{service.name}</h3>

                    {/* Iconos con información */}
                    <div className={styles.serviceIcons}>
                      <div className={styles.iconItem}>
                        <svg
                          className={styles.icon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <rect x="3" y="3" width="18" height="18" rx="2" />
                          <line x1="3" y1="9" x2="21" y2="9" />
                          <line x1="9" y1="21" x2="9" y2="9" />
                        </svg>
                        <span className={styles.iconLabel}>{service.price}</span>
                      </div>

                      <div className={styles.iconItem}>
                        <svg
                          className={styles.icon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <circle cx="12" cy="12" r="10" />
                          <polyline points="12 6 12 12 16 14" />
                        </svg>
                        <span className={styles.iconLabel}>{service.duration}</span>
                      </div>

                      <div className={styles.iconItem}>
                        <svg
                          className={styles.icon}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                        >
                          <path d="M20 6L9 17l-5-5" />
                        </svg>
                        <span className={styles.iconLabel}>{service.includes}</span>
                      </div>
                    </div>

                    {/* Descripción */}
                    <p className={styles.serviceDescription}>{service.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Fade gradient derecho */}
          <div className={styles.fadeRight} />
        </div>
      </div>
    </div>
  );
};
