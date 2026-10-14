import { FAQ_CATEGORIES } from "@/types/faq.types";
import { PRODUCT_CATEGORIES } from "@/types/product.types";
import { SERVICE_CATEGORIES } from "@/types/service.types";
import type { FAQ } from "@/types/faq.types";
import type { Location } from "@/types/location.types";
import type { Product } from "@/types/product.types";
import type { Service } from "@/types/service.types";
import type { TeamMember } from "@/types/team.types";
import { BUSINESS_FIELDS, businessValueProblem, emailProblem, isBusinessKey, mapUrlProblem, phoneProblem } from "./business";
import type { CsvTable } from "./csv";
import { formatClp } from "./format";
import { TEXTS, isTextKey } from "./texts";
import type { ContentIssue, ContentTab } from "./types";

/** Resultado de validar una pestaña: o todas sus filas son válidas, o no se acepta ninguna (RN-03). */
export interface TabResult<T> {
  items: T[];
  issues: ContentIssue[];
  /** Avisos que no rechazan la pestaña. */
  warnings: ContentIssue[];
}

const MAX_PRICE = 1_000_000;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FALSE_VALUES = new Set(["no", "false", "0", "n"]);
const TRUE_VALUES = new Set(["si", "sí", "true", "1", "s", "x"]);

/** Lee y valida las celdas de una fila, acumulando los problemas con su pestaña, fila y campo. */
class RowReader {
  private readonly tab: ContentTab;
  private readonly row: number;
  private readonly values: Record<string, string>;
  private readonly issues: ContentIssue[];
  private readonly warnings: ContentIssue[];

  constructor(tab: ContentTab, row: number, values: Record<string, string>, issues: ContentIssue[], warnings: ContentIssue[]) {
    this.tab = tab;
    this.row = row;
    this.values = values;
    this.issues = issues;
    this.warnings = warnings;
  }

  /** Registra un aviso (no rechaza la pestaña) y devuelve `undefined`. */
  warn(field: string, message: string): undefined {
    this.warnings.push({ tab: this.tab, row: this.row, field, message });
    return undefined;
  }

  /** Lo que escribió el dueño en una celda, sin validar. */
  raw(field: string): string {
    return this.values[field] ?? "";
  }

  /** Registra un problema de esta fila y devuelve `undefined`, para poder usarlo como valor de retorno. */
  report(field: string, message: string): undefined {
    this.issues.push({ tab: this.tab, row: this.row, field, message });
    return undefined;
  }

  /** Texto obligatorio con largo máximo. Devuelve `undefined` (y registra el problema) si no cumple. */
  text(field: string, max: number): string | undefined {
    const value = this.values[field] ?? "";
    if (value === "") return this.report(field, "es obligatorio");
    if (value.length > max) return this.report(field, `tiene ${value.length} caracteres y el máximo es ${max}`);
    return value;
  }

  /** Texto opcional con largo máximo; vacío es válido y da `""`. */
  optionalText(field: string, max: number): string {
    const value = this.values[field] ?? "";
    if (value.length > max) this.report(field, `tiene ${value.length} caracteres y el máximo es ${max}`);
    return value;
  }

  slug(field: string): string | undefined {
    const value = this.text(field, 60);
    if (value !== undefined && !SLUG.test(value)) return this.report(field, "solo admite minúsculas, números y guiones (por ejemplo: corte-clasico)");
    return value;
  }

  oneOf<T extends string>(field: string, allowed: readonly T[]): T | undefined {
    const value = this.values[field] ?? "";
    if (value === "") return this.report(field, "es obligatorio");
    const match = allowed.find((option) => option === value);
    return match ?? this.report(field, `"${value}" no es válido; usa una de: ${allowed.join(", ")}`);
  }

  /** Precio en pesos chilenos como número entero (`15000`, sin `$` ni puntos). */
  price(field: string): number | undefined {
    const value = this.values[field] ?? "";
    if (value === "") return this.report(field, "es obligatorio");
    if (!/^\d+$/.test(value)) return this.report(field, `"${value}" no es un número entero (escribe 15000, sin $ ni puntos)`);
    const amount = Number(value);
    if (amount <= 0 || amount > MAX_PRICE) return this.report(field, `debe estar entre 1 y ${MAX_PRICE}`);
    return amount;
  }

  /** Imagen opcional: vacía, una ruta del sitio (`/…`) o una dirección `https://`. */
  image(field: string): string {
    const value = this.values[field] ?? "";
    if (value !== "" && !/^(https:\/\/|\/)/.test(value)) this.report(field, `"${value}" debe empezar con https:// o con /`);
    return value;
  }

  /** `SI`/`NO` (y variantes). Vacío usa el valor por defecto. */
  flag(field: string, fallback: boolean): boolean {
    const value = (this.values[field] ?? "").toLowerCase();
    if (value === "") return fallback;
    if (TRUE_VALUES.has(value)) return true;
    if (FALSE_VALUES.has(value)) return false;
    this.report(field, `"${this.values[field]}" no es válido; usa SI o NO`);
    return fallback;
  }

  /** Posición opcional (`orden`): vacío = sin orden propio, queda según la hoja. */
  order(field: string): number | undefined {
    const value = this.values[field] ?? "";
    if (value === "") return undefined;
    if (!/^\d+$/.test(value)) return this.report(field, `"${value}" no es un número entero`);
    return Number(value);
  }
}

interface TabSpec<T> {
  /** Columnas que tienen que existir en el encabezado. */
  required: readonly string[];
  /** Lee una fila válida. Devuelve `undefined` si algo falló (el problema ya quedó registrado). */
  read(reader: RowReader): T | undefined;
}

/** Recorre las filas de una pestaña aplicando su especificación; comunes: `activo`, `orden`, `id` único. */
function readTab<T>(tab: ContentTab, table: CsvTable, spec: TabSpec<T>, options: { unique: string }): TabResult<T> {
  const issues: ContentIssue[] = [];
  const warnings: ContentIssue[] = [];

  const missing = spec.required.filter((column) => !table.headers.includes(column));
  if (missing.length > 0) {
    return { items: [], issues: missing.map((field) => ({ tab, row: 1, field, message: "falta esta columna en el encabezado" })), warnings };
  }

  const collected: { item: T; order: number | undefined; position: number }[] = [];
  const seen = new Map<string, number>();

  table.records.forEach(({ row, values }, position) => {
    const reader = new RowReader(tab, row, values, issues, warnings);
    if (!reader.flag("activo", true)) return; // fila oculta: no se valida ni se publica

    const key = values[options.unique] ?? "";
    if (key !== "" && seen.has(key)) {
      issues.push({ tab, row, field: options.unique, message: `"${key}" está repetido (ya aparece en la fila ${seen.get(key)})` });
    } else if (key !== "") {
      seen.set(key, row);
    }

    const before = issues.length;
    const item = spec.read(reader);
    const order = reader.order("orden");
    if (item !== undefined && issues.length === before) collected.push({ item, order, position });
  });

  // `orden` primero; las filas sin `orden` conservan su posición en la hoja y van después.
  collected.sort((a, b) => (a.order ?? Number.MAX_SAFE_INTEGER) - (b.order ?? Number.MAX_SAFE_INTEGER) || a.position - b.position);
  return { items: collected.map(({ item }) => item), issues, warnings };
}

export function readServices(table: CsvTable): TabResult<Service> {
  return readTab(
    "servicios",
    table,
    {
      required: ["id", "nombre", "descripcion", "precio", "duracion", "categoria"],
      read: (r) => {
        r.slug("id");
        const name = r.text("nombre", 60);
        const description = r.text("descripcion", 300);
        const price = r.price("precio");
        const duration = r.text("duracion", 20);
        const category = r.oneOf("categoria", SERVICE_CATEGORIES.filter((category) => category !== "Todos"));
        const includes = r.optionalText("incluye", 80);
        const image = r.image("imagen");
        if (name === undefined || description === undefined || price === undefined || duration === undefined || category === undefined) return undefined;
        return { name, description, price: formatClp(price), duration, includes, image, category };
      },
    },
    { unique: "id" },
  );
}

export function readProducts(table: CsvTable): TabResult<Product> {
  return readTab(
    "productos",
    table,
    {
      required: ["id", "nombre", "descripcion", "precio", "categoria"],
      read: (r) => {
        r.slug("id");
        const name = r.text("nombre", 60);
        const description = r.text("descripcion", 200);
        const price = r.price("precio");
        const category = r.oneOf("categoria", PRODUCT_CATEGORIES.filter((category) => category !== "Todos"));
        const image = r.image("imagen");
        if (name === undefined || description === undefined || price === undefined || category === undefined) return undefined;
        return { name, description, price: formatClp(price), image, category };
      },
    },
    { unique: "id" },
  );
}

export function readTeam(table: CsvTable): TabResult<TeamMember> {
  const result = readTab(
    "equipo",
    table,
    {
      required: ["id", "nombre", "cargo", "experiencia"],
      read: (r) => {
        r.slug("id");
        const name = r.text("nombre", 60);
        const role = r.text("cargo", 40);
        const experience = r.text("experiencia", 60);
        const image = r.image("imagen");
        const isLead = r.flag("lider", false);
        if (name === undefined || role === undefined || experience === undefined) return undefined;
        return { name, role, experience, image, isLead };
      },
    },
    { unique: "id" },
  );

  // Como máximo un líder: la página lo destaca.
  const leaders = result.items.filter((member) => member.isLead);
  if (leaders.length > 1) {
    result.issues.push({ tab: "equipo", row: 1, field: "lider", message: `hay ${leaders.length} líderes (${leaders.map((m) => m.name).join(", ")}); solo puede haber uno` });
  }
  return result;
}

export function readFaq(table: CsvTable): TabResult<FAQ> {
  return readTab(
    "preguntas",
    table,
    {
      required: ["id", "categoria", "pregunta", "respuesta"],
      read: (r) => {
        r.slug("id");
        const category = r.oneOf("categoria", FAQ_CATEGORIES);
        const question = r.text("pregunta", 150);
        const answer = r.text("respuesta", 800);
        if (category === undefined || question === undefined || answer === undefined) return undefined;
        return { category, question, answer };
      },
    },
    { unique: "id" },
  );
}

const TEXT_KEY = /^[a-z0-9]+(?:\.[a-z0-9]+)+$/;

/**
 * Pestaña `textos`: pares clave → valor (HU-CNT-002).
 * - Una clave que el sitio no usa (un error de escritura) se ignora con un aviso: no rechaza la pestaña.
 * - Un valor más largo que el máximo de su clave rechaza la pestaña.
 * - Un valor vacío significa "usar el texto por defecto": el dueño puede borrar la celda para volver atrás.
 */
export function readTexts(table: CsvTable): TabResult<[string, string]> {
  return readTab(
    "textos",
    table,
    {
      required: ["clave", "valor"],
      read: (r) => {
        const key = r.text("clave", 60);
        if (key === undefined) return undefined;
        if (!TEXT_KEY.test(key)) {
          return r.report("clave", `"${key}" no es válida; usa minúsculas, números y puntos (por ejemplo: hero.lema)`);
        }
        if (!isTextKey(key)) return r.warn("clave", `"${key}" no es un texto que use el sitio (¿error de escritura?): se ignora`);

        const value = r.raw("valor");
        if (value === "") return undefined;
        const max = TEXTS[key].max;
        if (value.length > max) return r.report("valor", `tiene ${value.length} caracteres y el máximo para "${key}" es ${max}`);
        return [key, value];
      },
    },
    { unique: "clave" },
  );
}

/**
 * Pestaña `negocio` (HU-CNT-003): pares clave → valor con los datos de contacto, reservas, horarios y redes.
 * Igual que `textos`: una clave desconocida se ignora con un aviso, un valor vacío deja el dato de siempre y un
 * valor inválido (teléfono, correo o enlace mal escritos) rechaza la pestaña para no publicar un contacto roto.
 */
export function readBusiness(table: CsvTable): TabResult<[string, string]> {
  return readTab(
    "negocio",
    table,
    {
      required: ["clave", "valor"],
      read: (r) => {
        const key = r.text("clave", 60);
        if (key === undefined) return undefined;
        if (!isBusinessKey(key)) {
          return r.warn("clave", `"${key}" no es un dato que use el sitio (¿error de escritura?; usa: ${Object.keys(BUSINESS_FIELDS).join(", ")}): se ignora`);
        }

        const value = r.raw("valor");
        if (value === "") return undefined;
        const problem = businessValueProblem(key, value);
        if (problem) return r.report("valor", `${key}: ${problem}`);
        return [key, value];
      },
    },
    { unique: "clave" },
  );
}

/** Pestaña `sucursales` (HU-CNT-003): una fila por sucursal, con sus horarios en tres columnas. */
export function readLocations(table: CsvTable): TabResult<Location> {
  return readTab(
    "sucursales",
    table,
    {
      required: ["id", "nombre", "direccion", "ciudad", "telefono", "email", "whatsapp", "mapa", "horario_semana", "horario_sabado", "horario_domingo"],
      read: (r) => {
        r.slug("id");
        const name = r.text("nombre", 60);
        const address = r.text("direccion", 80);
        const city = r.text("ciudad", 60);
        const phone = checked(r, "telefono", 30, phoneProblem);
        const email = checked(r, "email", 80, emailProblem);
        const whatsapp = checked(r, "whatsapp", 30, phoneProblem);
        const mapUrl = checked(r, "mapa", 1000, mapUrlProblem);
        const weekdays = r.text("horario_semana", 40);
        const saturday = r.text("horario_sabado", 40);
        const sunday = r.text("horario_domingo", 40);
        if ([name, address, city, phone, email, whatsapp, mapUrl, weekdays, saturday, sunday].some((value) => value === undefined)) return undefined;
        return {
          name: name!,
          address: address!,
          city: city!,
          phone: phone!,
          email: email!,
          whatsapp: whatsapp!,
          mapUrl: mapUrl!,
          schedule: [
            { day: "Lunes - Viernes", hours: weekdays! },
            { day: "Sábado", hours: saturday! },
            { day: "Domingo", hours: sunday! },
          ],
        };
      },
    },
    { unique: "id" },
  );
}

/** Texto obligatorio con largo máximo y una validación de formato propia. */
function checked(reader: RowReader, field: string, max: number, problemOf: (value: string) => string | undefined): string | undefined {
  const value = reader.text(field, max);
  if (value === undefined) return undefined;
  const problem = problemOf(value);
  return problem ? reader.report(field, problem) : value;
}
