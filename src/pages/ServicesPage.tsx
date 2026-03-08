import { motion } from "framer-motion";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { Card, CardContent } from "@/components/ui/card";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { ROUTES } from "@/config/routes";
import styles from "./ServicesPage.module.css";
import { servicesList, serviceCategories } from "@/data/servicesData";
import type { ServiceCategory } from "@/types/service.types";
import { useScrollContainer } from "@/hooks/useScrollContainer";
import { useState } from "react";
import { staggerFast, cardAnimation } from "@/config/animations.config";

export const ServicesPage = () => {
  const {
    scrollContainerRef,
    handleMouseEnter,
    handleMouseLeave,
  } = useScrollContainer();

  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>("Todos");
  const route = ROUTES.services;

  const filteredServices = selectedCategory === "Todos"
    ? servicesList
    : servicesList.filter(service => service.category === selectedCategory);

  return (
    <div className={styles.page}>
      <SEOHelmet route={route} />

      <PageHero
        title="Nuestros Servicios"
        subtitle="Calidad premium y atención personalizada en cada detalle"
        animated={false}
      />

      <div className={styles.content}>
        {/* Filtros de categorías */}
        <div className={styles.filtersContainer}>
          <div className={styles.filters}>
            {serviceCategories.map((category) => (
              <motion.button
                key={category}
                className={`${styles.filterButton} ${selectedCategory === category ? styles.filterButtonActive : ''}`}
                onClick={() => setSelectedCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ duration: 0.2 }}
              >
                {category}
              </motion.button>
            ))}
          </div>
          <div className={styles.filterSeparator} />
        </div>

        {/* Wrapper con fade gradient */}
        <div className={styles.scrollWrapper}>
          {/* Fade gradient izquierdo */}
          <div className={styles.fadeLeft} />

          {/* Scroll horizontal container */}
          <div
            ref={scrollContainerRef}
            className={styles.scrollContainer}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              className={styles.scrollContent}
              key={selectedCategory}
              variants={staggerFast}
              initial="hidden"
              animate="visible"
            >
              {filteredServices.map((service, idx) => (
                <motion.div
                  key={`${selectedCategory}-${service.name}-${idx}`}
                  variants={cardAnimation}
                >
                  <Card className={styles.serviceCard}>
                    {/* Imagen de fondo */}
                    <div
                      className={styles.cardBackground}
                      style={{ backgroundImage: `url(${service.image})` }}
                    />

                    {/* Overlay oscuro */}
                    <div className={styles.cardOverlay} />

                    {/* Contenido de la tarjeta */}
                    <CardContent className={styles.cardContent}>
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
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Fade gradient derecho */}
          <div className={styles.fadeRight} />
        </div>
      </div>
    </div>
  );
};
