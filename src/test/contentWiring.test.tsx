import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { beforeAll, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { LenisContext } from "@/contexts/lenisContextValue";
import { resolveContent, type SheetCsv } from "@/content/resolveContent";
import { snapshot } from "@/content/snapshot";
import { CONTENT_TABS, type SiteContent } from "@/content/types";
import { renderWithProviders } from "./renderWithProviders";
import { readAllSources } from "./sourceFiles";

// El contenido «de la hoja» que verán las páginas: otro distinto al respaldo, para probar que leen del módulo
// virtual y no de los datos del respaldo.
const hoja = vi.hoisted(() => ({
  content: {
    services: [{ name: "Servicio de la hoja", description: "Descripción de la hoja", price: "$9.990", duration: "99 min", includes: "", image: "", category: "Barba" }],
    products: [{ name: "Producto de la hoja", description: "Descripción", price: "$12.345", image: "", category: "Cuidado" }],
    team: [{ name: "Barbero de la hoja", role: "Cargo de la hoja", experience: "1 año", image: "", isLead: true }],
    faq: [{ category: "Servicios", question: "¿Pregunta de la hoja?", answer: "Respuesta de la hoja", }],
    texts: {},
  },
}));
vi.mock("virtual:site-content", () => ({ default: hoja.content }));

import { FAQPage } from "@/pages/FAQPage";
import { ProductsPage } from "@/pages/ProductsPage";
import { ServicesPage } from "@/pages/ServicesPage";
import { TeamPage } from "@/pages/TeamPage";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "../..");
const withLenis = (ui: ReactNode) => <LenisContext.Provider value={{ lenis: null, isReady: false }}>{ui}</LenisContext.Provider>;

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
    CONTENT_TABS.map((tab) => [tab, readFileSync(resolve(root, "docs/contenido", `${tab}.csv`), "utf8")]),
  ) as SheetCsv;
  const emptyFallback: SiteContent = { services: [], products: [], team: [], faq: [], texts: {} };

  it("existe una plantilla por pestaña", () => {
    for (const tab of CONTENT_TABS) expect(existsSync(resolve(root, "docs/contenido", `${tab}.csv`)), tab).toBe(true);
  });

  it("todas pasan el esquema sin un solo problema, y se leen como hoja (no como respaldo)", () => {
    const { reports } = resolveContent(sheet, emptyFallback);

    expect(reports.flatMap((report) => report.issues)).toEqual([]);
    expect(reports.map((report) => `${report.tab}:${report.source}`)).toEqual(CONTENT_TABS.map((tab) => `${tab}:hoja`));
  });

  it("reproducen el contenido actual del sitio: importarlas en la hoja no cambia nada", () => {
    const { content } = resolveContent(sheet, emptyFallback);

    expect(content.services).toEqual(snapshot.services);
    expect(content.products).toEqual(snapshot.products);
    expect(content.team).toEqual(snapshot.team);
    expect(content.faq).toEqual(snapshot.faq);
  });
});
