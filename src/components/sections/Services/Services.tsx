import styles from "./Services.module.css";

export const Services = () => {
  const services = [
    {
      name: "Corte Clásico",
      description: "Corte tradicional con acabado impecable",
      price: "$25",
    },
    {
      name: "Corte + Barba",
      description: "Servicio completo de corte y arreglo de barba",
      price: "$35",
    },
    {
      name: "Afeitado Premium",
      description: "Experiencia de afeitado con toallas calientes",
      price: "$30",
    },
    {
      name: "Diseño de Barba",
      description: "Perfilado y diseño personalizado",
      price: "$20",
    },
  ];

  return (
    <section id="services" className={styles.services}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h2 className={styles.title}>Nuestros Servicios</h2>
          <p className={styles.subtitle}>
            Servicios profesionales para tu mejor versión
          </p>
        </div>

        <div className={styles.grid}>
          {services.map((service, index) => (
            <div key={index} className={styles.card}>
              <div className={styles.cardContent}>
                <h3 className={styles.serviceName}>{service.name}</h3>
                <p className={styles.serviceDescription}>
                  {service.description}
                </p>
              </div>
              <div className={styles.price}>{service.price}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
