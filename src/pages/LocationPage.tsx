import { motion } from "framer-motion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ROUTES } from "@/config/routes";
import styles from "./LocationPage.module.css";
import { locationsList } from "@/data/locationsData";
import type { Location } from "@/types/location.types";
import { MapPinIcon, ClockIcon, PhoneIcon, EmailIcon, WhatsAppIcon } from "@/components/icons";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { fadeInUpShort, fadeInScale } from "@/config/animations.config";

const locations: Location[] = locationsList;

const LocationCard = ({ location }: { location: Location }) => (
  <Card className={styles.locationContent}>
    <div className={styles.info}>
      {/* Dirección */}
      <motion.div
        className={styles.section}
        variants={fadeInUpShort}
        initial="hidden"
        animate="visible"
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
        variants={fadeInUpShort}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
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
        variants={fadeInUpShort}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
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
      variants={fadeInScale}
      initial="hidden"
      animate="visible"
      transition={{ delay: 0.3 }}
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
  </Card>
);

export const LocationPage = () => {
  const route = ROUTES.location;

  return (
    <div className={styles.page}>
      <SEOHelmet route={route} />

      <PageHero
        title="Ubicación y Horarios"
        subtitle="Encuéntranos en nuestras sucursales"
      />

      <div className={styles.content}>
        <div className={styles.container}>
          <Tabs defaultValue="coquimbo" className={styles.tabs} orientation="horizontal">
            <TabsList className={styles.tabsList}>
              <TabsTrigger value="serena" className={styles.tabTrigger}>
                {locations[0].name.toUpperCase()}
              </TabsTrigger>
              <TabsTrigger value="coquimbo" className={styles.tabTrigger}>
                {locations[1].name.toUpperCase()}
              </TabsTrigger>
            </TabsList>

            <div className={styles.tabsSeparator}></div>

            <TabsContent value="serena" className={styles.tabContent}>
              <LocationCard location={locations[0]} />
            </TabsContent>

            <TabsContent value="coquimbo" className={styles.tabContent}>
              <LocationCard location={locations[1]} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};
