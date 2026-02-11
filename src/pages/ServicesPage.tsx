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
            <div key={idx} className={styles.category}>
              <h2 className={styles.categoryTitle}>{category.category}</h2>
              <div className={styles.items}>
                {category.items.map((item, index) => (
                  <div key={index} className={styles.serviceCard}>
                    <div className={styles.serviceInfo}>
                      <h3 className={styles.serviceName}>{item.name}</h3>
                      <p className={styles.duration}>{item.duration}</p>
                    </div>
                    <div className={styles.price}>{item.price}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
