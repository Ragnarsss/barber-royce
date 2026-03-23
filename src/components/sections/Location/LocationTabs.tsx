import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Location } from "@/types/location.types";
import styles from "@/pages/LocationPage.module.css";
import { LocationCard } from "./LocationCard";
import { toLocationTabItems } from "./location.utils";

/**
 * Props para el componente de tabs de ubicaciones.
 */
interface LocationTabsProps {
  locations: Location[];
}

/**
 * Renderiza tabs dinamicos para navegar entre sucursales.
 *
 * @param props - Props del componente.
 * @param props.locations - Lista de sucursales disponibles.
 * @returns Bloque de tabs con tarjetas por sucursal o null sin datos.
 */
export const LocationTabs = ({ locations }: LocationTabsProps) => {
  const tabItems = toLocationTabItems(locations);

  if (tabItems.length === 0) {
    return null;
  }

  return (
    <Tabs
      defaultValue={tabItems[0].value}
      className={styles.tabs}
      orientation="horizontal"
    >
      <TabsList className={styles.tabsList}>
        {tabItems.map(({ value, location }) => (
          <TabsTrigger key={value} value={value} className={styles.tabTrigger}>
            {location.name.toUpperCase()}
          </TabsTrigger>
        ))}
      </TabsList>

      <div className={styles.tabsSeparator}></div>

      {tabItems.map(({ value, location }) => (
        <TabsContent key={value} value={value} className={styles.tabContent}>
          <LocationCard location={location} />
        </TabsContent>
      ))}
    </Tabs>
  );
};
