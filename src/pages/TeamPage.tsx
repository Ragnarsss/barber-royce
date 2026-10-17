import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { HoneycombPage } from "@/components/common/HoneycombPage/HoneycombPage";
import { SEOHelmet } from "@/components/common/SEOHelmet/SEOHelmet";
import { BarberProfileDialog } from "@/components/team/BarberProfileDialog";
import { TeamHoneycomb } from "@/components/team/TeamHoneycomb";
import { ROUTES } from "@/config/routes";
import { useSiteContent } from "@/content/useSiteContent";
import type { TeamMember } from "@/types/team.types";

/**
 * Página del equipo (BR-060): el panal de hexágonos sobre las diagonales del hero. Cada barbero abre su ficha en un
 * diálogo (BR-063).
 */
export const TeamPage = () => {
  const team = useSiteContent().team;
  const [selected, setSelected] = useState<TeamMember | null>(null);

  return (
    <>
      <SEOHelmet route={ROUTES.team} />
      <HoneycombPage title="Nuestro equipo" subtitle="Profesionales apasionados por su oficio">
        <TeamHoneycomb team={team} onSelect={setSelected} />
      </HoneycombPage>

      <AnimatePresence>
        {selected && <BarberProfileDialog key={selected.name} member={selected} onClose={() => setSelected(null)} />}
      </AnimatePresence>
    </>
  );
};
