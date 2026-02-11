import styles from "./LocationPage.module.css";

export const LocationPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <h1 className={styles.title}>Ubicación y Horarios</h1>
          <p className={styles.subtitle}>Encuéntranos fácilmente</p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <div className={styles.grid}>
            <div className={styles.info}>
              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Dirección</h2>
                <p className={styles.text}>
                  Calle Principal #123
                  <br />
                  Centro, Ciudad
                  <br />
                  CP 12345
                </p>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Horarios</h2>
                <div className={styles.schedule}>
                  <div className={styles.scheduleRow}>
                    <span>Lunes - Viernes</span>
                    <span>9:00 AM - 8:00 PM</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span>Sábado</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className={styles.scheduleRow}>
                    <span>Domingo</span>
                    <span>Cerrado</span>
                  </div>
                </div>
              </div>

              <div className={styles.section}>
                <h2 className={styles.sectionTitle}>Contacto</h2>
                <p className={styles.text}>
                  <strong>Teléfono:</strong> (123) 456-7890
                  <br />
                  <strong>Email:</strong> info@barberroyce.com
                  <br />
                  <strong>WhatsApp:</strong> (123) 456-7890
                </p>
              </div>
            </div>

            <div className={styles.mapContainer}>
              <div className={styles.mapPlaceholder}>
                <span>Google Maps</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
