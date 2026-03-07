import { motion } from "framer-motion";
import { Helmet } from "react-helmet-async";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import styles from "./LocationPage.module.css";
import { locationsList, type Location } from "@/data/locationsData";
import { MapPinIcon, ClockIcon, PhoneIcon, EmailIcon, WhatsAppIcon, ExternalLinkIcon } from "@/components/icons";

const locations: Location[] = locationsList;

const LocationCard = ({ location }: { location: Location }) => (
  <Card className={styles.locationContent}>
    <div className={styles.info}>
      {/* Dirección */}
      <motion.div
        className={styles.section}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className={styles.iconHeader}>
          <MapPinIcon className={styles.icon} />
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
          <ClockIcon className={styles.icon} />
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
          <PhoneIcon className={styles.icon} />
          <h2 className={styles.sectionTitle}>Contacto</h2>
        </div>
        <div className={styles.contactInfo}>
          <a href={`tel:${location.phone}`} className={styles.contactLink}>
            <PhoneIcon className={styles.smallIcon} />
            {location.phone}
          </a>
          <a href={`mailto:${location.email}`} className={styles.contactLink}>
            <EmailIcon className={styles.smallIcon} />
            {location.email}
          </a>
          <a href={`https://wa.me/${location.whatsapp.replace(/\D/g, '')}`} className={styles.contactLink} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon className={styles.smallIcon} />
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
      <div className={styles.mapWrapper}>
        <a
          href={location.mapUrl.replace('/embed', '')}
          target="_blank"
          rel="noopener noreferrer"
          className={styles.mapLink}
        >
          <ExternalLinkIcon className={styles.mapIcon} />
          Abrir en Maps
        </a>
      </div>
      <iframe
        src={location.mapUrl}
        className={styles.map}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Mapa de ${location.name}`}
      />
    </motion.div>
  </Card>
);

export const LocationPage = () => {
  return (
    <div className={styles.page}>
      <Helmet>
        <title>Ubicación y Horarios - Encuéntranos en Coquimbo | Royce Barbería</title>
        <meta name="description" content="Visítanos en Presidente Alessandri 1871, Coquimbo. Abierto de lunes a sábado. Descubre cómo llegar, horarios de atención y contáctanos para reservar tu cita." />
        <link rel="canonical" href="https://roycebarber.com/ubicacion" />
        <meta property="og:title" content="Ubicación y Horarios | Royce Barbería Coquimbo" />
        <meta property="og:description" content="Encuéntranos en Presidente Alessandri 1871, Coquimbo. Agenda tu cita hoy." />
        <meta property="og:url" content="https://roycebarber.com/ubicacion" />
      </Helmet>
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
          <Tabs defaultValue="centro" className={styles.tabs} orientation="horizontal">
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
