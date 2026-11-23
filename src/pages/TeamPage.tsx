import { lazy, Suspense, useState, type ComponentType } from "react";
import { AnimatePresence } from "framer-motion";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { BarberProfileDialog } from "@/components/team/BarberProfileDialog";
import { TeamHoneycombView } from "@/components/team/TeamHoneycombView";
import type { TeamViewProps } from "@/components/team/teamView";
import { useBranch } from "@/branch/useBranch";
import type { Branch } from "@/config/branches";
import { ROUTES } from "@/config/routes";
import { useSiteContent } from "@/content/useSiteContent";
import type { TeamMember } from "@/types/team.types";

// La vista de La Serena es otro trozo de código: con Coquimbo no se descarga (BR-107).
const TeamCarouselLaSerena = lazy(() => import("@/components/team/TeamCarouselLaSerena"));

/** Qué vista del equipo se ve en cada sucursal (ADR-010 nivel 3). */
const TEAM_VIEW: Record<Branch, ComponentType<TeamViewProps>> = {
  coquimbo: TeamHoneycombView,
  "la-serena": TeamCarouselLaSerena,
};

/**
 * Página del equipo (BR-060, BR-107): el panal de hexágonos en Coquimbo y el carrusel en La Serena. Cada barbero abre su
 * ficha en un diálogo (BR-063), el mismo en las dos sucursales.
 */
export const TeamPage = () => {
  const team = useSiteContent().team;
  const [selected, setSelected] = useState<TeamMember | null>(null);
  const View = TEAM_VIEW[useBranch().branch];

  return (
    <>
      <SEOHelmet route={ROUTES.team} />
      <Suspense fallback={null}>
        <View team={team} onSelect={setSelected} />
      </Suspense>

      <AnimatePresence>
        {selected && <BarberProfileDialog key={selected.name} member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
};
