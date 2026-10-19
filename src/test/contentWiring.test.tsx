import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { LenisContext } from "@/contexts/lenisContextValue";
import { resolveContent, type SheetCsv } from "@/content/resolveContent";
import { contentToSheet } from "@/content/sheetFormat";
import { snapshot } from "@/content/snapshot";
import { TEXTS } from "@/content/texts";
import { CONTENT_TABS, type SiteContent } from "@/content/types";
import { renderWithProviders } from "./renderWithProviders";
import { readAllSources } from "./sourceFiles";

// El contenido «de la hoja» que verán las páginas: otro distinto al respaldo, para probar que leen del módulo
// virtual y no de los datos del respaldo.
const hoja = vi.hoisted(() => ({
  content: {
    services: [{ name: "Servicio de la hoja", description: "Descripción de la hoja", price: "$9.990", duration: "99 min", includes: "", image: "", category: "Barba" }],
    products: [{ id: "producto-de-la-hoja", name: "Producto de la hoja", description: "Descripción", price: "$12.345", image: "", category: "Cuidado" }],
    team: [{ name: "Barbero de la hoja", role: "Cargo de la hoja", experience: "1 año", image: "", isLead: true }],
    faq: [{ category: "Servicios", question: "¿Pregunta de la hoja?", answer: "Respuesta de la hoja", }],
    texts: {},
  },
}));
vi.mock("virtual:site-content", async () => {
  // Los datos del negocio y las sucursales son los de siempre: estas pruebas miran el catálogo.
  const { snapshot: base } = await import("@/content/snapshot");
  return { default: { ...hoja.content, business: base.business, locations: base.locations } };
});

import { FAQPage } from "@/pages/FAQPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { TeamPage } from "@/pages/TeamPage";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const withLenis = (ui: ReactNode) => <LenisContext value={null}>{ui}</LenisContext>;

describe("las páginas leen el contenido generado (BR-041, RF-CNT-004, CP-CNT-004)", () => {
  beforeAll(() => {
    // framer-motion usa IntersectionObserver para `whileInView`; jsdom no lo trae.
    vi.stubGlobal(
      "IntersectionObserver",
      class {
        observe() {}
        unobserve() {}
        disconnect() {}
        takeRecords() {
          return [];
        }
      },
    );
  });

  it("ServicesPage muestra los servicios del contenido, con su precio ya formateado", () => {
    renderWithProviders(withLenis(<ServicesPage />), { route: "/servicios" });

    expect(screen.getByText("Servicio de la hoja")).toBeInTheDocument();
    expect(screen.getByText("$9.990")).toBeInTheDocument();
    expect(screen.queryByText(snapshot.services[0].name)).not.toBeInTheDocument();
  });

  it("ServicesPage filtra por categoría sobre el contenido (HU-INFO-001 CA-02)", async () => {
    const user = userEvent.setup();
    renderWithProviders(withLenis(<ServicesPage />), { route: "/servicios" });

    await user.click(screen.getByRole("button", { name: "Corte de Cabello" }));

    expect(screen.queryByText("Servicio de la hoja")).not.toBeInTheDocument();
  });

  it("ProductsPage muestra los productos del contenido", () => {
    renderWithProviders(withLenis(<ProductsPage />), { route: "/productos" });

    expect(screen.getByText("Producto de la hoja")).toBeInTheDocument();
    expect(screen.getByText("$12.345")).toBeInTheDocument();
    expect(screen.queryByText(snapshot.products[0].name)).not.toBeInTheDocument();
  });

  it("BR-009: ProductsPage no tiene botón «Comprar» (no se vende por el sitio, HU-INFO-004 RN-01)", () => {
    renderWithProviders(withLenis(<ProductsPage />), { route: "/productos" });

    expect(screen.getByText("Producto de la hoja")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /comprar/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/comprar/i)).not.toBeInTheDocument();
  });

  it("TeamPage muestra el equipo del contenido", () => {
    renderWithProviders(withLenis(<TeamPage />), { route: "/equipo" });

    expect(screen.getByText("Barbero de la hoja")).toBeInTheDocument();
    expect(screen.queryByText(snapshot.team[0].name)).not.toBeInTheDocument();
  });

  it("FAQPage muestra las preguntas del contenido y despliega su respuesta", async () => {
    const user = userEvent.setup();
    renderWithProviders(withLenis(<FAQPage />), { route: "/preguntas-frecuentes" });

    await user.click(screen.getByRole("button", { name: /¿Pregunta de la hoja\?/ }));

    expect(screen.getByRole("button", { name: /¿Pregunta de la hoja\?/ })).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText("Respuesta de la hoja")).toBeInTheDocument();
    expect(screen.queryByText(snapshot.faq[0].question)).not.toBeInTheDocument();
  });
});

describe("el catálogo tiene una sola fuente (BR-041, RNF-DATOS-002)", () => {
  it("src/data ya no tiene las listas de servicios, productos, equipo ni preguntas", () => {
    for (const file of ["servicesData.ts", "productsData.ts", "teamData.ts", "faqData.ts"]) {
      expect(existsSync(resolve(root, "src/data", file)), file).toBe(false);
    }
  });

  it("ningún archivo fuera del respaldo importa las listas del respaldo", () => {
    const offenders = readAllSources()
      .filter(([file, code]) => !file.startsWith("content/") && /content\/snapshot(\/|["'])/.test(code))
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });

  it("ningún archivo importa los datos antiguos de src/data (servicesData, productsData, teamData, faqData)", () => {
    const offenders = readAllSources()
      .filter(([, code]) => /data\/(services|products|team|faq)Data/.test(code))
      .map(([file]) => file);

    expect(offenders).toEqual([]);
  });
});

describe("plantillas CSV de docs/contenido (BR-041, HU-CNT-001)", () => {
  const sheet = Object.fromEntries(
    CONTENT_TABS.map((tab) => [tab, readFileSync(resolve(root, "docs/contenido", `${tab}.csv`), "utf8").replace(/\r\n/g, "\n")]),
  ) as SheetCsv;
  const emptyFallback: SiteContent = { services: [], products: [], team: [], faq: [], texts: {}, business: snapshot.business, locations: [] };

  it("existe una plantilla por pestaña", () => {
    for (const tab of CONTENT_TABS) expect(existsSync(resolve(root, "docs/contenido", `${tab}.csv`)), tab).toBe(true);
  });

  it("todas pasan el esquema sin un solo problema, y se leen como hoja (no como respaldo)", () => {
    const { reports } = resolveContent(sheet, emptyFallback);

    expect(reports.flatMap((report) => report.issues)).toEqual([]);
    expect(reports.map((report) => `${report.tab}:${report.source}`)).toEqual(CONTENT_TABS.map((tab) => `${tab}:hoja`));
  });

  it("la plantilla de textos lista todas las claves editables con el texto que el sitio muestra hoy", () => {
    const { content } = resolveContent(sheet, emptyFallback);

    expect(content.texts).toEqual(Object.fromEntries(Object.entries(TEXTS).map(([key, { default: text }]) => [key, text])));
  });

  it("reproducen el contenido actual del sitio: importarlas en la hoja no cambia nada", () => {
    const { content } = resolveContent(sheet, emptyFallback);

    expect(content.services).toEqual(snapshot.services);
    // La plantilla de productos puede traer más filas que el respaldo (BR-090: 50 de prueba), pero empieza con las suyas.
    expect(content.products.slice(0, snapshot.products.length)).toEqual(snapshot.products);
    expect(content.team).toEqual(snapshot.team);
    expect(content.faq).toEqual(snapshot.faq);
  });

  it("BR-048: las de negocio y sucursales también reproducen los datos actuales, con los enlaces armados igual", () => {
    const { content } = resolveContent(sheet, emptyFallback);

    expect(content.business).toEqual(snapshot.business);
    expect(content.locations).toEqual(snapshot.locations);
  });

  it("BR-048: cada plantilla es exactamente lo que se genera del respaldo (si cambia un dato, se regenera la plantilla)", () => {
    const generated = contentToSheet(snapshot);

    // `textos` lista los textos por defecto del código (`texts.ts`), no el respaldo: se prueba aparte.
    // `productos` puede tener más filas que el respaldo (BR-090, decisión del usuario 2026-10-19): se prueba abajo.
    for (const tab of CONTENT_TABS.filter((tab) => tab !== "textos" && tab !== "productos")) {
      expect(sheet[tab], tab).toBe(generated[tab]?.replace(/\r\n/g, "\n"));
    }
  });

  it("BR-090: la plantilla de productos empieza con exactamente las filas del respaldo y puede sumar más", () => {
    const generatedRows = (contentToSheet(snapshot).productos ?? "").replace(/\r\n/g, "\n").trimEnd().split("\n");

    expect(sheet.productos?.split("\n").slice(0, generatedRows.length)).toEqual(generatedRows);
  });
});
