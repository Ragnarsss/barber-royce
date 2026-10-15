/**
 * Días de atención de un barbero (BR-063): lo que el dueño escribe en la columna `dias` de la pestaña `equipo`.
 * Acepta días sueltos (`Lun, Mié, Sáb`), nombres completos y rangos (`Lun a Vie`, `Mar-Jue`), con o sin tilde.
 * Los días son índices de 0 (lunes) a 6 (domingo).
 */
export const WEEK_DAYS = [
  { short: "L", abbr: "Lun", long: "Lunes" },
  { short: "M", abbr: "Mar", long: "Martes" },
  { short: "M", abbr: "Mié", long: "Miércoles" },
  { short: "J", abbr: "Jue", long: "Jueves" },
  { short: "V", abbr: "Vie", long: "Viernes" },
  { short: "S", abbr: "Sáb", long: "Sábado" },
  { short: "D", abbr: "Dom", long: "Domingo" },
] as const;

const normalize = (text: string) =>
  text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

const NAMES = new Map<string, number>(
  WEEK_DAYS.flatMap((day, index) => [
    [normalize(day.abbr), index],
    [normalize(day.long), index],
  ]),
);

const RANGE = /^(.+?)\s*(?:-|–|\ba\b)\s*(.+)$/;

export function parseDays(text: string): { days: number[]; unknown: string[] } {
  const days = new Set<number>();
  const unknown: string[] = [];

  for (const part of text.split(",").map((item) => item.trim()).filter(Boolean)) {
    const single = NAMES.get(normalize(part));
    if (single !== undefined) {
      days.add(single);
      continue;
    }
    const range = part.match(RANGE);
    const from = range ? NAMES.get(normalize(range[1])) : undefined;
    const to = range ? NAMES.get(normalize(range[2])) : undefined;
    if (from === undefined || to === undefined) {
      unknown.push(part);
      continue;
    }
    // Un rango que cruza el domingo (`Vie a Lun`) da la vuelta a la semana.
    for (let day = from; ; day = (day + 1) % 7) {
      days.add(day);
      if (day === to) break;
    }
  }

  return { days: [...days].sort((a, b) => a - b), unknown };
}

/** Días como los escribiría el dueño (`Lun, Mar, Sáb`): sirve para generar la plantilla de la hoja. */
export const formatDays = (days: readonly number[]): string => days.map((day) => WEEK_DAYS[day].abbr).join(", ");
