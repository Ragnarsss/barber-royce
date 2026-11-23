import { BRANCH_LOCATION_ID, type Branch } from "@/config/branches";
import { useSiteContent } from "@/content/useSiteContent";
import type { Location } from "@/types/location.types";

/** La fila de la pestaña `sucursales` (o su respaldo) que corresponde a una sucursal; `undefined` si la hoja no la trae. */
export function useBranchLocation(branch: Branch): Location | undefined {
  const { locations } = useSiteContent();
  return locations.find((location) => location.id === BRANCH_LOCATION_ID[branch]);
}
