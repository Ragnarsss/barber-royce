import { BackToTop } from "@/components/common/BackToTop/BackToTop";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/constants";
import { BRANCH_LOCATION_ID } from "@/config/branches";
import { useSiteContent } from "@/content/useSiteContent";
import { hairSalonJsonLd } from "@/seo/structuredData";
import { BranchVisit } from "../components/sections/BranchVisit/BranchVisit";
import { HeroLaSerena } from "../components/sections/HeroLaSerena/HeroLaSerena";

/** Portada básica de La Serena (BR-106). Es una página aparte y se carga con `lazy`: con Coquimbo no se descarga. */
export function LaSerenaPage() {
  const { business, locations } = useSiteContent();
  const own = locations.filter((location) => location.id === BRANCH_LOCATION_ID["la-serena"]);

  return (
    <>
      <SEOHelmet route={ROUTES.laSerena} jsonLd={hairSalonJsonLd({ site: SITE, business, locations: own })} />
      <HeroLaSerena />
      <BranchVisit branch="la-serena" />
      <BackToTop />
    </>
  );
}
