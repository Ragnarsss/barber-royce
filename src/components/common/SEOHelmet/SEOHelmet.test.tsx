import { waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { ROUTES } from "@/config/routes";
import { SEOHelmet } from "./SEOHelmet";

// BR-006 (RF-SEO-001, RF-SEO-002): metadatos por ruta, `og:locale` chileno y datos estructurados opcionales. React 19 deja
// los `<script>` en línea donde se renderizan (no los sube al `<head>`): Google acepta JSON-LD en cualquier parte del documento.
const metaContent = (selector: string) => document.head.querySelector(selector)?.getAttribute("content");
const jsonLdBlocks = () => [...document.querySelectorAll('script[type="application/ld+json"]')].map((script) => JSON.parse(script.textContent ?? ""));

describe("SEOHelmet", () => {
  it("RF-SEO-001: declara el locale chileno, no el de España", async () => {
    renderWithProviders(<SEOHelmet route={ROUTES.products} />);

    await waitFor(() => expect(metaContent('meta[property="og:locale"]')).toBe("es_CL"));
    expect(metaContent('meta[property="og:title"]')).toBe(ROUTES.products.title);
    expect(metaContent('meta[property="og:image"]')).toMatch(/og-image\.jpg$/);
  });

  it("RF-SEO-002: con `jsonLd` agrega un <script type=application/ld+json> por objeto", async () => {
    renderWithProviders(
      <SEOHelmet route={ROUTES.faq} jsonLd={[{ "@context": "https://schema.org", "@type": "FAQPage" }, { "@context": "https://schema.org", "@type": "HairSalon" }]} />,
    );

    await waitFor(() => expect(jsonLdBlocks()).toHaveLength(2));
    expect(jsonLdBlocks().map((block) => block["@type"])).toEqual(["FAQPage", "HairSalon"]);
  });

  it("RF-SEO-002: sin `jsonLd` no agrega ningún script de datos estructurados", async () => {
    renderWithProviders(<SEOHelmet route={ROUTES.team} />);

    await waitFor(() => expect(document.title).toBe(ROUTES.team.title));
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0);
  });
});
