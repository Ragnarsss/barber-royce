import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { BOOKING, SITE, SOCIAL_MEDIA } from "@/config/constants";
import { snapshot } from "@/content/snapshot";
import { locationsList } from "@/data/locationsData";
import { faqPageJsonLd, geoFromMapUrl, hairSalonJsonLd, openingHoursSpecification, serializeJsonLd } from "./structuredData";

// BR-006 (HU-SEO-001 CA-02, HU-INFO-005 CA-03): los datos estructurados salen de los mismos datos que muestra la página.
const publicDir = resolve(dirname(fileURLToPath(import.meta.url)), "../../public");
const salons = hairSalonJsonLd({ site: SITE, business: snapshot.business, locations: locationsList });

describe("hairSalonJsonLd (CP-SEO-002-N: el JSON-LD coincide con src/config/)", () => {
  it("hay un HairSalon por sucursal, cada uno con su propio @id", () => {
    expect(salons).toHaveLength(locationsList.length);
    expect(salons.map((salon) => salon["@type"])).toEqual(locationsList.map(() => "HairSalon"));
    expect(new Set(salons.map((salon) => salon["@id"])).size).toBe(locationsList.length);
  });

  it.each(locationsList.map((location, index) => [location.name, location, index] as const))(
    "CA-02: %s declara su dirección, su país CL, su teléfono y su correo, tal como están en la config",
    (_name, location, index) => {
      const salon = salons[index];

      expect(salon.name).toBe(location.name);
      expect(salon.address.streetAddress).toBe(location.address);
      // `city` es «Pampa Baja, La Serena»: la localidad es lo que va después de la última coma
      expect(location.city.endsWith(salon.address.addressLocality)).toBe(true);
      expect(["La Serena", "Coquimbo"]).toContain(salon.address.addressLocality);
      expect(salon.address.addressCountry).toBe("CL");
      expect(salon.address.addressRegion).toBe("Región de Coquimbo");
      expect(salon.telephone.replace(/\D/g, "")).toBe(location.phone.replace(/\D/g, ""));
      expect(salon.telephone.startsWith("+")).toBe(true);
      expect(salon.email).toBe(location.email);
      expect(salon.url).toBe(`${SITE.domain}/ubicacion`);
    },
  );

  it("CA-02: lo que no se puede afirmar se omite en vez de inventarse (sin código postal, sin calificación, sin precio)", () => {
    for (const salon of salons) {
      expect(salon.address).not.toHaveProperty("postalCode");
      expect(salon).not.toHaveProperty("aggregateRating");
      expect(salon).not.toHaveProperty("priceRange");
    }
  });

  it("CA-02: la imagen es un archivo que existe en public/ y la URL es absoluta", () => {
    for (const salon of salons) {
      expect(salon.image.startsWith(`${SITE.domain}/`)).toBe(true);
      expect(existsSync(resolve(publicDir, salon.image.replace(`${SITE.domain}/`, "")))).toBe(true);
    }
  });

  it("CA-02: las redes y la reserva salen de la config, y la reserva va a AgendaPro, no a un ancla que no existe", () => {
    for (const [index, salon] of salons.entries()) {
      expect(salon.sameAs).toEqual([SOCIAL_MEDIA.instagram.url, SOCIAL_MEDIA.facebook.url, SOCIAL_MEDIA.tiktok.url]);
      expect(salon.potentialAction["@type"]).toBe("ReserveAction");
      // Cada sucursal reserva en su propia página de AgendaPro (BR-103); sin ella, el enlace general
      expect(salon.potentialAction.target.urlTemplate).toBe(locationsList[index].bookingUrl ?? BOOKING.url);
      expect(salon.potentialAction.target.urlTemplate).not.toContain("#reservar");
    }
  });

  it("BR-103: las dos sucursales reservan en páginas distintas de AgendaPro", () => {
    const urls = salons.map((salon) => salon.potentialAction.target.urlTemplate);

    expect(new Set(urls).size).toBe(locationsList.length);
  });

  it("CA-02: las coordenadas salen del mapa de cada sucursal, y ambos caen en Chile (BR-005: el de Coquimbo ya es el real)", () => {
    const laSerena = salons[locationsList.findIndex((location) => location.id === "barberia-royce-la-serena")];
    const coquimbo = salons[locationsList.findIndex((location) => location.id === "barberia-royce-coquimbo")];

    expect(laSerena.geo?.latitude).toBeCloseTo(-29.929, 2);
    expect(laSerena.geo?.longitude).toBeCloseTo(-71.254, 2);
    expect(coquimbo.geo?.latitude).toBeCloseTo(-29.977, 2);
    expect(coquimbo.geo?.longitude).toBeCloseTo(-71.263, 2);
  });

  it("CA-02: el horario de cada sucursal sale de su propia tabla de horarios", () => {
    for (const [index, location] of locationsList.entries()) {
      expect(salons[index].openingHoursSpecification).toEqual(openingHoursSpecification(location.schedule));
      expect(salons[index].openingHoursSpecification.length).toBeGreaterThan(0);
    }
  });
});

describe("openingHoursSpecification", () => {
  const schedule = [
    { day: "Lunes - Viernes", hours: "09:00 - 20:00" },
    { day: "Sábado", hours: "09:00 - 18:00" },
    { day: "Domingo", hours: "Cerrado" },
  ];

  it("convierte rangos de días y horas, y omite los días cerrados", () => {
    expect(openingHoursSpecification(schedule)).toEqual([
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "20:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday"], opens: "09:00", closes: "18:00" },
    ]);
  });

  it("completa la hora de una cifra y acepta otras horas (triangulación: no devuelve siempre lo mismo)", () => {
    expect(openingHoursSpecification([{ day: "Mar a Jue", hours: "9:30 - 19:15" }])).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: ["Tuesday", "Wednesday", "Thursday"], opens: "09:30", closes: "19:15" },
    ]);
  });

  it("ignora una fila que no se entiende en vez de inventar un horario", () => {
    expect(openingHoursSpecification([{ day: "Feriados", hours: "10:00 - 14:00" }])).toEqual([]);
    expect(openingHoursSpecification([{ day: "Lunes", hours: "por la tarde" }])).toEqual([]);
  });
});

describe("geoFromMapUrl", () => {
  const embed = (lon: number, lat: number) => `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d260.2!2d${lon}!3d${lat}!2m3!1f0`;

  it("lee la latitud y la longitud del mapa embebido cuando están en Chile", () => {
    expect(geoFromMapUrl(embed(-71.2544, -29.9293))).toEqual({ latitude: -29.9293, longitude: -71.2544 });
    expect(geoFromMapUrl(embed(-70.65, -33.45))).toEqual({ latitude: -33.45, longitude: -70.65 });
  });

  it("descarta lo que cae fuera de Chile (Bogotá, Madrid) y lo que no es un mapa", () => {
    expect(geoFromMapUrl(embed(-74.0719, 4.6789))).toBeUndefined();
    expect(geoFromMapUrl(embed(-3.7, 40.4))).toBeUndefined();
    expect(geoFromMapUrl("https://example.com/mapa")).toBeUndefined();
    expect(geoFromMapUrl("")).toBeUndefined();
  });
});

describe("faqPageJsonLd (HU-INFO-005 CA-03)", () => {
  it("CA-03: contiene exactamente las mismas preguntas y respuestas que la página", () => {
    const faq = faqPageJsonLd(snapshot.faq);

    expect(faq?.["@type"]).toBe("FAQPage");
    expect(faq?.mainEntity).toHaveLength(snapshot.faq.length);
    for (const [index, item] of snapshot.faq.entries()) {
      expect(faq?.mainEntity[index].name).toBe(item.question);
      expect(faq?.mainEntity[index].acceptedAnswer.text).toBe(item.answer);
    }
  });

  it("sin preguntas no hay FAQPage: un FAQPage vacío no es válido", () => {
    expect(faqPageJsonLd([])).toBeUndefined();
  });
});

describe("serializeJsonLd", () => {
  it("un texto con </script> no puede cerrar la etiqueta, y sigue siendo el mismo JSON", () => {
    const value = { name: "Pregunta </script><script>alert(1)</script> & más" };
    const text = serializeJsonLd(value);

    expect(text).not.toContain("</script>");
    expect(text).not.toContain("<");
    expect(JSON.parse(text)).toEqual(value);
  });
});
