import { BackToTop } from "@/components/common/BackToTop/BackToTop";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/constants";
import { BRANCH_LOCATION_ID } from "@/config/branches";
import { useSiteContent } from "@/content/useSiteContent";
import { hairSalonJsonLd } from "@/seo/structuredData";
import { Benefits } from "../components/sections/Benefits/Benefits";
import { CTA1 } from "../components/sections/CTA1/CTA1";
import { CTA2 } from "../components/sections/CTA2/CTA2";
import { Features } from "../components/sections/Features/Features";
import { Hero } from "../components/sections/Hero/Hero";
import { Reviews } from "../components/sections/Reviews/Reviews";
import { SocialProof1 } from "../components/sections/SocialProof1/SocialProof1";
import { SocialProof2 } from "../components/sections/SocialProof2/SocialProof2";

/** Portada de Coquimbo (`/coquimbo`): la home de siempre. `/` es ahora la portada partida (BR-106). */
export function HomePage() {
  const { business, locations } = useSiteContent();
  const own = locations.filter((location) => location.id === BRANCH_LOCATION_ID.coquimbo);

  return (
    <>
      {/* Datos estructurados de la sucursal, con los mismos datos que muestra el sitio (BR-006, BR-106) */}
      <SEOHelmet route={ROUTES.coquimbo} jsonLd={hairSalonJsonLd({ site: SITE, business, locations: own })} />
      <Hero />
      <CTA1 />
      <SocialProof1 />
      <Benefits />
      <Reviews />
      <Features />
      <SocialProof2 />
      <CTA2 />
      <BackToTop />
    </>
  );
}
