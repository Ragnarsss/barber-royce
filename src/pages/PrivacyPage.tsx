import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { PageHero } from "@/components/common/PageHero/PageHero";
import { ROUTES } from "@/config/routes";
import { CONTACT, SITE } from "@/config/constants";
import styles from "./PrivacyPage.module.css";

/**
 * Política de privacidad y cookies (BR-044, HU-MED-003).
 *
 * BORRADOR TÉCNICO: describe lo que el sitio hace, pero no es asesoría legal.
 * Debe revisarlo el dueño o un abogado antes de activar Google Analytics en
 * producción (Ley 19.628 y su actualización, Ley 21.719).
 */
export const PrivacyPage = () => (
  <div className={styles.page}>
    <SEOHelmet route={ROUTES.privacy} noindex />

    <PageHero title="Privacidad y cookies" subtitle="Qué datos recoge este sitio y cómo decides tú" />

    <div className={styles.content}>
      <section aria-labelledby="privacidad-datos">
        <h2 id="privacidad-datos">1. Qué datos se recogen</h2>
        <p>
          Por defecto, este sitio no recoge datos sobre ti: no te pide registrarte ni tiene formularios. Si el sitio tiene
          activada la medición de visitas y tú la aceptas, se registra de forma anónima qué páginas visitas, de qué
          sitio llegaste y si tocas los botones de reservar, de WhatsApp o de teléfono. No se registra tu nombre, tu
          teléfono ni nada que escribas.
        </p>
        <p>
          Para medir, Google Analytics guarda dos cookies en tu navegador (<code>_ga</code> y <code>_ga_*</code>), que
          duran hasta 2 años. Si rechazas, no se guarda ninguna.
        </p>
      </section>

      <section aria-labelledby="privacidad-fin">
        <h2 id="privacidad-fin">2. Para qué se usan</h2>
        <p>
          Solo para saber cuántas personas visitan el sitio y cuántas intentan reservar o escribirnos, y así mejorar la
          página. No se usan para publicidad ni se venden a terceros.
        </p>
      </section>

      <section aria-labelledby="privacidad-responsable">
        <h2 id="privacidad-responsable">3. Quién trata los datos</h2>
        <p>
          El responsable es {SITE.name}. Los datos de medición los procesa Google (Google Analytics 4) y, para contar
          visitas sin cookies, Vercel (Vercel Analytics). Al reservar, pasas a AgendaPro, que tiene su propia política
          de privacidad.
        </p>
      </section>

      <section aria-labelledby="privacidad-derechos">
        <h2 id="privacidad-derechos">4. Tus derechos y cómo cambiar tu elección</h2>
        <p>
          Puedes aceptar o rechazar la medición cuando quieras desde «Preferencias de privacidad», al final de cada
          página; al rechazar se detiene la medición y se borran las cookies de analítica. También puedes pedir acceso,
          rectificación o eliminación de tus datos escribiendo a{" "}
          <a href={CONTACT.email.link}>{CONTACT.email.display}</a>.
        </p>
      </section>
    </div>
  </div>
);
