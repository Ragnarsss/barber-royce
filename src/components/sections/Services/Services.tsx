import styles from "./Services.module.css";
import { servicesList } from "@/data/servicesData";

export const Services = () => {
  const services = servicesList;

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
