import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import styles from "./LocationPage.module.css";

interface Location {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  whatsapp: string;
  mapUrl: string;
  schedule: Array<{
    day: string;
    hours: string;
  }>;
}

const locations: Location[] = [
  {
    name: "Barber Royce Centro",
    address: "Av. Principal #123",
    city: "Centro, Ciudad",
    phone: "(123) 456-7890",
    email: "centro@barberroyce.com",
    whatsapp: "(123) 456-7890",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.955!2d-74.0817!3d4.6097!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzYnMzUuMCJOIDc0wrAwNCc1NC4xIlc!5e0!3m2!1sen!2sco!4v1234567890",
    schedule: [
      { day: "Lunes - Viernes", hours: "9:00 AM - 8:00 PM" },
      { day: "Sábado", hours: "9:00 AM - 6:00 PM" },
      { day: "Domingo", hours: "10:00 AM - 4:00 PM" },
    ],
  },
  {
    name: "Barber Royce Norte",
    address: "Calle 123 #45-67",
    city: "Zona Norte, Ciudad",
    phone: "(123) 456-7891",
    email: "norte@barberroyce.com",
    whatsapp: "(123) 456-7891",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.512!2d-74.0719!3d4.6789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwNDAnNDQuMCJOIDc0wrAwNCcxOC44Ilc!5e0!3m2!1sen!2sco!4v1234567891",
    schedule: [
      { day: "Lunes - Viernes", hours: "10:00 AM - 9:00 PM" },
      { day: "Sábado", hours: "9:00 AM - 7:00 PM" },
      { day: "Domingo", hours: "10:00 AM - 5:00 PM" },
    ],
  },
  {
    name: "Barber Royce Sur",
    address: "Carrera 50 #10-20",
    city: "Zona Sur, Ciudad",
    phone: "(123) 456-7892",
    email: "sur@barberroyce.com",
    whatsapp: "(123) 456-7892",
    mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3977.123!2d-74.0654!3d4.5234!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNMKwMzEnMjQuMiJOIDc0wrAwMyczOS40Ilc!5e0!3m2!1sen!2sco!4v1234567892",
    schedule: [
      { day: "Lunes - Viernes", hours: "9:00 AM - 8:00 PM" },
      { day: "Sábado", hours: "9:00 AM - 6:00 PM" },
      { day: "Domingo", hours: "Cerrado" },
    ],
  },
];

const LocationCard = ({ location }: { location: Location }) => (
  <div className={styles.locationContent}>
    <div className={styles.info}>
      {/* Dirección */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.iconHeader}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          <h2 className={styles.sectionTitle}>Dirección</h2>
        </div>
        <p className={styles.text}>
          {location.address}
          <br />
          {location.city}
        </p>
      </motion.div>

      {/* Horarios */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className={styles.iconHeader}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <h2 className={styles.sectionTitle}>Horarios</h2>
        </div>
        <div className={styles.schedule}>
          {location.schedule.map((item, idx) => (
            <div key={idx} className={styles.scheduleRow}>
              <span>{item.day}</span>
              <span>{item.hours}</span>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Contacto */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <div className={styles.iconHeader}>
          <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
          </svg>
          <h2 className={styles.sectionTitle}>Contacto</h2>
        </div>
        <div className={styles.contactInfo}>
          <a href={`tel:${location.phone}`} className={styles.contactLink}>
            <svg className={styles.smallIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            {location.phone}
          </a>
          <a href={`mailto:${location.email}`} className={styles.contactLink}>
            <svg className={styles.smallIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
              <polyline points="22,6 12,13 2,6" />
            </svg>
            {location.email}
          </a>
          <a href={`https://wa.me/${location.whatsapp.replace(/\D/g, '')}`} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
            <svg className={styles.smallIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
            </svg>
            WhatsApp: {location.whatsapp}
          </a>
        </div>
      </motion.div>
    </div>

    {/* Mapa */}
    <motion.div
      className={styles.mapContainer}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <iframe
        src={location.mapUrl}
        className={styles.map}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${location.name}`}
      />
    </motion.div>
  </div>
);

export const LocationPage = () => {
  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.container}>
          <motion.h1
            className={styles.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Ubicación y Horarios
          </motion.h1>
          <motion.p
            className={styles.subtitle}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Encuéntranos en nuestras sucursales
          </motion.p>
        </div>
      </div>

      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs defaultValue="centro" className={styles.tabs}>
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="centro" className={styles.tabTrigger}>
                Centro
              </TabsTrigger>
              <TabsTrigger value="norte" className={styles.tabTrigger}>
                Norte
              </TabsTrigger>
              <TabsTrigger value="sur" className={styles.tabTrigger}>
                Sur
              </TabsTrigger>
            </TabsList>

            <TabsContent value="centro" className={styles.tabContent}>
              <LocationCard location={locations[0]} />
            </TabsContent>

            <TabsContent value="norte" className={styles.tabContent}>
              <LocationCard location={locations[1]} />
            </TabsContent>

            <TabsContent value="sur" className={styles.tabContent}>
              <LocationCard location={locations[2]} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
