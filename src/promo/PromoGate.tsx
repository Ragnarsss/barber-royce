import { lazy, Suspense, useEffect, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { runAfterLoad } from "@/analytics/runAfterLoad";
import { useSiteText } from "@/content/useSiteContent";
import { useNeonLoaderDone } from "@/loader/neonLoader";
import {
  PROMO_DELAY_MS,
  isPromoActive,
  isPromoReady,
  readPromoDismissed,
  writePromoDismissed,
} from "./promoState";
import { useConsentPending } from "./useConsentPending";

// El modal y sus estilos viajan en un trozo aparte: con la promoción apagada, o antes de que se cumpla la espera, no
// se descarga (RNF-PERF-003, HU-RES-003 CA-04 y CA-09).
const WelcomePromo = lazy(() => import("./WelcomePromo").then((m) => ({ default: m.WelcomePromo })));

/**
 * Decide cuándo sale el modal de bienvenida (BR-100, HU-RES-003). Espera a que el letrero de neón se haya ido y a que
 * el visitante responda el aviso de privacidad (si existe: solo hay aviso con un ID de medición), y después a que la
 * página cargue y pasen `PROMO_DELAY_MS`. Cerrarlo se anota en el navegador y no vuelve a salir. No pinta nada por sí
 * mismo, así que con la promoción apagada no cuesta un nodo.
 */
export const PromoGate = () => {
  const siteText = useSiteText();
  const active = isPromoActive(siteText("promo.activa"));
  const loaderDone = useNeonLoaderDone();
  const consentPending = useConsentPending();
  const [dismissed, setDismissed] = useState(readPromoDismissed);
  const [open, setOpen] = useState(false);

  const ready = isPromoReady({ active, dismissed, loaderDone, consentPending });

  useEffect(() => {
    if (!ready) return;
    let timer: number | undefined;
    const cancelLoad = runAfterLoad(() => {
      timer = window.setTimeout(() => setOpen(true), PROMO_DELAY_MS);
    });
    return () => {
      cancelLoad();
      window.clearTimeout(timer);
    };
  }, [ready]);

  const close = () => {
    setOpen(false);
    setDismissed(true);
    writePromoDismissed();
  };

  return (
    <AnimatePresence>
      {open && active && (
        <Suspense key="promo" fallback={null}>
          <WelcomePromo onClose={close} />
        </Suspense>
      )}
    </AnimatePresence>
  );
};
