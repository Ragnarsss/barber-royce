import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import styles from "./ServicesPage.module.css";

export const ServicesPage = () => {
  const services = [
    {
      category: "Cortes",
      items: [
        { name: "Corte Clásico", price: "$25", duration: "30 min" },
        { name: "Corte Moderno", price: "$30", duration: "40 min" },
        { name: "Fade & Taper", price: "$35", duration: "45 min" },
      ],
    },
    {
      category: "Barba",
      items: [
        { name: "Arreglo de Barba", price: "$15", duration: "20 min" },
        { name: "Diseño Completo", price: "$20", duration: "30 min" },
        { name: "Afeitado Premium", price: "$30", duration: "40 min" },
      ],
    },
    {
      category: "Combos",
      items: [
        { name: "Corte + Barba", price: "$35", duration: "50 min" },
        { name: "Paquete Premium", price: "$50", duration: "70 min" },
        { name: "Experiencia Completa", price: "$65", duration: "90 min" },
      ],
    },
  ];

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
        <div className={styles.container}>
          {services.map((category, idx) => (
            <CategorySection key={idx} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

// Componente separado para cada categoría con animaciones
const CategorySection = ({ category }: { category: any }) => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  // Movimiento horizontal basado en el número de items
  const itemCount = category.items.length;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["5%", `-${(itemCount - 2) * 30}%`],
  );

  return (
    <div ref={sectionRef} className={styles.category}>
      <h2 className={styles.categoryTitle}>{category.category}</h2>

      {/* Contenedor de scroll horizontal */}
      <div className={styles.horizontalScrollContainer}>
        <motion.div className={styles.items} style={{ x }}>
          {category.items.map((item: any, itemIndex: number) => {
            // Stagger effect para cada card
            const cardProgress = useTransform(
              scrollYProgress,
              [itemIndex * 0.1, (itemIndex + 1) * 0.15],
              [0, 1],
            );
            const opacity = useTransform(cardProgress, [0, 1], [0, 1]);
            const scale = useTransform(cardProgress, [0, 1], [0.9, 1]);
            const y = useTransform(cardProgress, [0, 1], [30, 0]);

            return (
              <motion.div
                key={itemIndex}
                className={styles.serviceCard}
                style={{ opacity, scale, y }}
              >
                <div className={styles.serviceInfo}>
                  <h3 className={styles.serviceName}>{item.name}</h3>
                  <p className={styles.duration}>{item.duration}</p>
                </div>
                <div className={styles.price}>{item.price}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </div>
  );
};
