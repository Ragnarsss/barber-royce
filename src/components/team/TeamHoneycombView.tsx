import { HoneycombPage } from "@/components/common/HoneycombPage/HoneycombPage";
import { TeamHoneycomb } from "./TeamHoneycomb";
import type { TeamViewProps } from "./teamView";

/** La vista del equipo de Coquimbo (BR-060): el panal de hexágonos sobre las diagonales del hero. */
export const TeamHoneycombView = ({ team, onSelect }: TeamViewProps) => (
  <HoneycombPage title="Nuestro equipo" subtitle="Profesionales apasionados por su oficio">
    <TeamHoneycomb team={team} onSelect={onSelect} />
  </HoneycombPage>
);
