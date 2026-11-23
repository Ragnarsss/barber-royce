import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/constants";
import { useSiteContent } from "@/content/useSiteContent";
import { hairSalonJsonLd } from "@/seo/structuredData";
import { BranchPicker } from "../components/sections/BranchPicker/BranchPicker";

/** `/`: la portada partida para elegir sucursal (BR-106). Declara las dos sucursales en sus datos estructurados. */
export function BranchPickerPage() {
  const { business, locations } = useSiteContent();

  return (
    <>
      <SEOHelmet route={ROUTES.home} jsonLd={hairSalonJsonLd({ site: SITE, business, locations })} />
      <BranchPicker />
    </>
  );
}
