import { parseDays } from "@/content/days";
import type { Business } from "@/content/types";
import type { FAQ } from "@/types/faq.types";
import type { Location, ScheduleItem } from "@/types/location.types";

/**
 * Datos estructurados (JSON-LD) de las sucursales y de las preguntas frecuentes (BR-006, HU-SEO-001 CA-02, HU-INFO-005 CA-03).
 *
 * Se arman en la página, con los mismos datos que ella muestra (la config y lo que el dueño edite en la hoja), y no se
 * copian a mano en `index.html`: Google exige que lo estructurado coincida con lo visible. **Lo que no se puede afirmar se
 * omite en vez de inventarse**: sin código postal, sin precio, sin calificación, y sin coordenadas si el mapa de la
 * sucursal no cae en Chile.
 */

/** Lo que se necesita del sitio (`SITE` en `src/config/constants.ts`). */
export interface SeoSite {
  domain: string;
  description: string;
}

export interface OpeningHoursSpecification {
  "@type": "OpeningHoursSpecification";
  dayOfWeek: string[];
  opens: string;
  closes: string;
}

export interface HairSalonJsonLd {
  "@context": "https://schema.org";
  "@type": "HairSalon";
  "@id": string;
  name: string;
  url: string;
  image: string;
  description: string;
  telephone: string;
  email: string;
  address: {
    "@type": "PostalAddress";
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    addressCountry: "CL";
  };
  geo?: { "@type": "GeoCoordinates"; latitude: number; longitude: number };
  openingHoursSpecification: OpeningHoursSpecification[];
  sameAs: string[];
  potentialAction: {
    "@type": "ReserveAction";
    target: { "@type": "EntryPoint"; urlTemplate: string; inLanguage: "es"; actionPlatform: string[] };
    result: { "@type": "Reservation"; name: string };
  };
}

export interface FaqPageJsonLd {
  "@context": "https://schema.org";
  "@type": "FAQPage";
  mainEntity: Array<{ "@type": "Question"; name: string; acceptedAnswer: { "@type": "Answer"; text: string } }>;
}

/** Días en el orden de `WEEK_DAYS` (0 = lunes), con los nombres que usa schema.org. */
const SCHEMA_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;

/** Las dos sucursales (La Serena y Coquimbo) están en la Región de Coquimbo. */
const REGION = "Región de Coquimbo";

const HOURS = /^(\d{1,2}):(\d{2})\s*(?:-|–|a)\s*(\d{1,2}):(\d{2})$/;
const pad = (hour: string) => hour.padStart(2, "0");

/**
 * Convierte una tabla de horarios («Lunes - Viernes», «09:00 - 20:00») en `OpeningHoursSpecification`. Los días cerrados
 * («Cerrado») y las filas que no se entienden se omiten: un horario inventado es peor que ninguno.
 */
export function openingHoursSpecification(schedule: readonly ScheduleItem[]): OpeningHoursSpecification[] {
  return schedule.flatMap((row) => {
    const hours = row.hours.trim().match(HOURS);
    const { days, unknown } = parseDays(row.day);
    if (!hours || unknown.length > 0 || days.length === 0) return [];
    return [
      {
        "@type": "OpeningHoursSpecification" as const,
        dayOfWeek: days.map((day) => SCHEMA_DAYS[day]),
        opens: `${pad(hours[1])}:${hours[2]}`,
        closes: `${pad(hours[3])}:${hours[4]}`,
      },
    ];
  });
}

/** Cuadro que contiene a Chile continental (con un margen): lo que cae fuera es un mapa mal puesto, no una sucursal. */
const CHILE = { latitude: [-56, -17], longitude: [-76, -66] } as const;
const MAP_COORDINATES = /!2d(-?\d+(?:\.\d+)?)!3d(-?\d+(?:\.\d+)?)/;

/**
 * Coordenadas de un mapa de Google embebido (`…!2d<longitud>!3d<latitud>…`). Solo si caen en Chile: hoy el mapa de la
 * sucursal de Coquimbo apunta a Bogotá y no debe terminar en los datos que recibe Google.
 */
export function geoFromMapUrl(mapUrl: string): { latitude: number; longitude: number } | undefined {
  const match = mapUrl.match(MAP_COORDINATES);
  if (!match) return undefined;
  const longitude = Number(match[1]);
  const latitude = Number(match[2]);
  const inChile =
    latitude >= CHILE.latitude[0] && latitude <= CHILE.latitude[1] && longitude >= CHILE.longitude[0] && longitude <= CHILE.longitude[1];
  return inChile ? { latitude, longitude } : undefined;
}

/** `+56 9 2087 2985` → `+56920872985`. Sin el `+` inicial se dejan solo los dígitos: no se adivina un código de país. */
const telephoneOf = (phone: string): string => {
  const digits = phone.replace(/\D/g, "");
  return phone.trim().startsWith("+") ? `+${digits}` : digits;
};

const PLATFORMS = [
  "http://schema.org/DesktopWebPlatform",
  "http://schema.org/MobileWebPlatform",
  "http://schema.org/IOSPlatform",
  "http://schema.org/AndroidPlatform",
];

/** Un `HairSalon` por sucursal, con el mismo contenido que muestra la página de ubicación. */
export function hairSalonJsonLd({
  site,
  business,
  locations,
}: {
  site: SeoSite;
  business: Business;
  locations: readonly Location[];
}): HairSalonJsonLd[] {
  const sameAs = [business.social.instagram.url, business.social.facebook.url, business.social.tiktok.url];

  return locations.map((location) => {
    const geo = geoFromMapUrl(location.mapUrl);
    return {
      "@context": "https://schema.org",
      "@type": "HairSalon",
      "@id": `${site.domain}/ubicacion#${location.id}`,
      name: location.name,
      url: `${site.domain}/ubicacion`,
      image: `${site.domain}/og-image.jpg`,
      description: site.description,
      telephone: telephoneOf(location.phone),
      email: location.email,
      address: {
        "@type": "PostalAddress",
        streetAddress: location.address,
        // `city` llega como «Pampa Baja, La Serena»: la localidad es lo que va después de la última coma
        addressLocality: (location.city.split(",").pop() ?? location.city).trim(),
        addressRegion: REGION,
        addressCountry: "CL",
      },
      ...(geo ? { geo: { "@type": "GeoCoordinates" as const, ...geo } } : {}),
      openingHoursSpecification: openingHoursSpecification(location.schedule),
      sameAs,
      potentialAction: {
        "@type": "ReserveAction",
        target: { "@type": "EntryPoint", urlTemplate: business.booking.url, inLanguage: "es", actionPlatform: PLATFORMS },
        result: { "@type": "Reservation", name: `Reserva de hora en ${location.name}` },
      },
    };
  });
}

/** `FAQPage` con las mismas preguntas y respuestas que la página. Sin preguntas no hay nada que declarar. */
export function faqPageJsonLd(faq: readonly FAQ[]): FaqPageJsonLd | undefined {
  if (faq.length === 0) return undefined;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/**
 * JSON listo para ir dentro de un `<script type="application/ld+json">`. Un `<` se escribe como `<`: un texto con
 * `</script>` (una pregunta frecuente editada en la hoja) no puede cerrar la etiqueta, y al leerse es el mismo JSON.
 */
export const serializeJsonLd = (value: unknown): string => JSON.stringify(value).replace(/</g, "\\u003c");
