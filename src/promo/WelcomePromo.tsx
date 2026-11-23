import { useEffect, useId } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ModalDialog } from "@/components/common/ModalDialog/ModalDialog";
import { promoStripIn } from "@/config/animations.config";
import { trackEvent, trackReserve } from "@/analytics/track";
import { useSiteContent, useSiteText } from "@/content/useSiteContent";
import photo from "@/assets/optimized/cta1_model_700w.webp";
import styles from "./WelcomePromo.module.css";

interface WelcomePromoProps {
  onClose: () => void;
}

/**
 * Modal de bienvenida con la mascarilla facial gratis (BR-100, HU-RES-003): tres franjas cortadas en diagonal, como la
 * navaja: la foto, el titular sobre el rojo de la marca y, a la derecha, lo que el cliente debe decir, las condiciones
 * y el botón de reservar. Los textos salen de la hoja (`promo.*`) y la reserva, de `business.booking`. El foco, Escape,
 * el fondo y Lenis los resuelve `ModalDialog`. Con reducir movimiento las franjas no se animan (CA-07).
 */
export const WelcomePromo = ({ onClose }: WelcomePromoProps) => {
  const titleId = useId();
  const descriptionId = useId();
  const reducedMotion = useReducedMotion() ?? false;
  const siteText = useSiteText();
  const { business } = useSiteContent();

  useEffect(() => {
    trackEvent("promo_view");
  }, []);

  const close = () => {
    trackEvent("promo_close");
    onClose();
  };

  // Sin animación, las franjas parten ya visibles (no hay `initial` oculto que luego haya que revelar).
  const strip = (index: number) => ({
    variants: promoStripIn,
    custom: index,
    initial: reducedMotion ? false : "hidden",
    animate: "visible",
  });

  return (
    <ModalDialog
      onClose={close}
      titleId={titleId}
      descriptionId={descriptionId}
      className={styles.promo}
      closeLabel="Cerrar la promoción"
    >
      <motion.div className={styles.photo} {...strip(0)}>
        <img src={photo} alt="" width="700" height="700" />
      </motion.div>

      <motion.div className={styles.headline} {...strip(1)}>
        <span className={styles.badge} aria-hidden="true">
          Gratis
        </span>
        <h2 id={titleId} className={styles.title}>
          {siteText("promo.titulo")}
        </h2>
      </motion.div>

      <motion.div className={styles.detail} {...strip(2)}>
        <p className={styles.lead}>En tu próxima visita, di:</p>
        <p className={styles.phrase}>«{siteText("promo.frase")}»</p>
        <p id={descriptionId} className={styles.conditions}>
          {siteText("promo.condiciones")}
        </p>
        <a
          className={styles.reserve}
          href={business.booking.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={trackReserve("promo")}
        >
          {business.booking.label}
        </a>
      </motion.div>
    </ModalDialog>
  );
};
