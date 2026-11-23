import { BranchVines } from "@/components/decor/BranchVines";
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
import { Reviews } from "../components/sections/Reviews/Reviews";
import { SocialProof1 } from "../components/sections/SocialProof1/SocialProof1";
import { SocialProof2 } from "../components/sections/SocialProof2/SocialProof2";
import { HeroLaSerena } from "../components/sections/HeroLaSerena/HeroLaSerena";

/**
 * Portada de La Serena (BR-106): su hero propio y, debajo, las mismas secciones de la home, que ya se ven con el tema de la
 * sucursal activa (BR-104). Las fotos y los textos de esas secciones son los de siempre hasta que haya los de La Serena.
 * Es una página aparte y se carga con `lazy`: con Coquimbo no se descarga.
 */
export function LaSerenaPage() {
  const { business, locations } = useSiteContent();
  const own = locations.filter((location) => location.id === BRANCH_LOCATION_ID["la-serena"]);

  return (
    <>
      <SEOHelmet route={ROUTES.laSerena} jsonLd={hairSalonJsonLd({ site: SITE, business, locations: own })} />
      <HeroLaSerena />
      <CTA1 />
      <SocialProof1 />
      <Benefits />
      <Reviews />
      <BranchVines sides="both">
        <Features />
      </BranchVines>
      <SocialProof2 />
      <CTA2 />
      <BackToTop />
    </>
  );
}
