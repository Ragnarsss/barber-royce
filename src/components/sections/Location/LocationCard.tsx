import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { fadeInScale, fadeInUpShort } from "@/config/animations.config";
import { trackPhone, trackWhatsApp } from "@/analytics/track";
import type { Location } from "@/types/location.types";
import { Clock, Mail, MapPin, Phone } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import styles from "@/pages/LocationPage.module.css";

/**
 * Props para la tarjeta de ubicacion.
 */
interface LocationCardProps {
  location: Location;
}

/**
 * Renderiza la informacion de una sucursal y su mapa embebido.
 *
 * @param props - Props del componente.
 * @param props.location - Datos de la sucursal a mostrar.
 * @returns Tarjeta de detalle de ubicacion.
 */
export const LocationCard = ({ location }: LocationCardProps) => (
  <Card className={styles.locationContent}>
    <div className={styles.info}>
      <motion.div
        className={styles.section}
        variants={fadeInUpShort}
        initial="hidden"
        animate="visible"
      >
        <div className={styles.iconHeader}>
          <MapPin className={styles.icon} />
          <h2 className={styles.sectionTitle}>Dirección</h2>
        </div>
        <p className={styles.text}>
          {location.address}
          <br />
          {location.city}
        </p>
      </motion.div>

      <motion.div
        className={styles.section}
        variants={fadeInUpShort}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <div className={styles.iconHeader}>
          <Clock className={styles.icon} />
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

      <motion.div
        className={styles.section}
        variants={fadeInUpShort}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
      >
        <div className={styles.iconHeader}>
          <Phone className={styles.icon} />
          <h2 className={styles.sectionTitle}>Contacto</h2>
        </div>
        <div className={styles.contactInfo}>
          <a href={`tel:${location.phone}`} className={styles.contactLink} onClick={trackPhone("ubicacion")}>
            <Phone className={styles.smallIcon} />
            {location.phone}
          </a>
          <a href={`mailto:${location.email}`} className={styles.contactLink}>
            <Mail className={styles.smallIcon} />
            {location.email}
          </a>
          <a
            href={`https://wa.me/${location.whatsapp.replace(/\D/g, "")}`}
            className={styles.contactLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={trackWhatsApp("ubicacion")}
          >
            <WhatsAppIcon className={styles.smallIcon} />
            WhatsApp: {location.whatsapp}
          </a>
        </div>
      </motion.div>
    </div>

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
