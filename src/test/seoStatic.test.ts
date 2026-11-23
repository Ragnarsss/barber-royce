import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { ROUTES } from "@/config/routes";
import { SITE } from "@/config/constants";

// BR-006 (RF-SEO-001, RF-SEO-003, RNF-SEO-002): lo que es un archivo estático se ata a la config con un test.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const read = (file: string) => readFileSync(resolve(root, file), "utf8");
const indexHtml = read("index.html");

describe("index.html (RNF-SEO-002)", () => {
  const blocks = [...indexHtml.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => match[1]);

  it("el HairSalon y el FAQPage ya no están copiados a mano: los genera la página desde sus datos", () => {
    // Los `provider` del catálogo llevan solo el nombre de la barbería: lo que no puede quedar es la ficha de una sucursal
    expect(indexHtml).not.toContain('"streetAddress"');
    expect(indexHtml).not.toContain('"telephone"');
    expect(indexHtml).not.toContain('"geo"');
    expect(indexHtml).not.toContain('"FAQPage"');
    expect(indexHtml).not.toContain("aggregateRating");
    expect(indexHtml).not.toContain("0.0000000");
    expect(indexHtml).not.toContain("#reservar");
  });

  it("el catálogo de servicios sigue siendo el único bloque fijo y es JSON válido", () => {
    expect(blocks).toHaveLength(1);
    expect(JSON.parse(blocks[0])["@type"]).toBe("ItemList");
  });

  it("RF-SEO-001: el locale es chileno", () => {
    expect(indexHtml).toContain('property="og:locale" content="es_CL"');
    expect(indexHtml).not.toContain("es_ES");
  });
});

describe("sitemap.xml y robots.txt (CP-SEO-003)", () => {
  const urls = [...read("public/sitemap.xml").matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
  const indexable = Object.values(ROUTES).filter((route) => route.indexable !== false);

  it("las URLs del sitemap coinciden con las rutas indexables de ROUTES, ni una más ni una menos", () => {
    expect([...urls].sort()).toEqual(indexable.map((route) => `${SITE.domain}${route.path}`).sort());
  });

  it("incluye las dos rutas que faltaban y no incluye la política de privacidad (noindex)", () => {
    expect(urls).toContain(`${SITE.domain}/nosotros`);
    expect(urls).toContain(`${SITE.domain}/preguntas-frecuentes`);
    expect(urls.some((url) => url.endsWith("/privacidad"))).toBe(false);
  });

  it("robots.txt apunta al sitemap del dominio de producción", () => {
    expect(read("public/robots.txt")).toContain(`Sitemap: ${SITE.domain}/sitemap.xml`);
  });
});

describe("site.webmanifest (RF-SEO-001)", () => {
  const manifest = JSON.parse(read("public/site.webmanifest")) as {
    theme_color: string;
    background_color: string;
    icons: Array<{ src: string; sizes: string; purpose: string }>;
  };
  const colors = read("src/styles/tokens/colors.css");
  const token = (name: string) => colors.match(new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`))?.[1].toLowerCase();

  it("el tema y el fondo son los oscuros del sitio, tomados de los tokens (no el blanco por defecto)", () => {
    expect(manifest.theme_color.toLowerCase()).toBe(token("color-accent-900"));
    expect(manifest.background_color.toLowerCase()).toBe(token("color-primary-500"));
    expect(manifest.theme_color.toLowerCase()).not.toBe("#ffffff");
    expect(manifest.background_color.toLowerCase()).not.toBe("#ffffff");
  });

  it("cada ícono va como `any` y como `maskable`: con solo `maskable`, algunos sistemas lo recortan", () => {
    for (const size of ["192x192", "512x512"]) {
      const purposes = manifest.icons.filter((icon) => icon.sizes === size).map((icon) => icon.purpose);
      expect(purposes.sort()).toEqual(["any", "maskable"]);
    }
  });
});

describe("las páginas declaran sus metadatos (CP-SEO-001)", () => {
  it.each(["AboutPage", "BranchPickerPage", "FAQPage", "HomePage", "LaSerenaPage", "LocationPage", "PrivacyPage", "ProductsPage", "ServicesPage", "TeamPage"])(
    "%s usa SEOHelmet con su ruta de ROUTES",
    (page) => {
      expect(read(`src/pages/${page}.tsx`)).toMatch(/<SEOHelmet[^>]*route=/);
    },
  );
});
