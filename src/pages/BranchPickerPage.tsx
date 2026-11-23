import { Navigate } from "react-router-dom";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/constants";
import { useBranch } from "@/branch/useBranch";
import { useSiteContent } from "@/content/useSiteContent";
import { hairSalonJsonLd } from "@/seo/structuredData";
import { BranchPicker } from "../components/sections/BranchPicker/BranchPicker";

/**
 * `/`: la portada partida para elegir sucursal (BR-106). Se elige una sola vez: quien ya eligió (o entró por una portada)
 * pasa directo a la suya y, desde ahí, cambia con el control del menú. Quien nunca eligió, y los buscadores, ven las dos
 * mitades y los datos estructurados de las dos sucursales.
 */
export function BranchPickerPage() {
  const { business, locations } = useSiteContent();
  const { branch, source } = useBranch();

  if (source === "stored") return <Navigate to={`/${branch}`} replace />;

  return (
    <>
      <SEOHelmet route={ROUTES.home} jsonLd={hairSalonJsonLd({ site: SITE, business, locations })} />
      <BranchPicker />
    </>
  );
}
