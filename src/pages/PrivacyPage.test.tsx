import { describe, expect, it } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import { renderWithProviders } from "@/test/renderWithProviders";
import { CONTACT } from "@/config/constants";
import { ROUTES } from "@/config/routes";
import { PrivacyPage } from "./PrivacyPage";

describe("PrivacyPage (BR-044, CP-MED-005)", () => {
  it("HU-MED-003 CA-05: explica qué datos se recogen, para qué, quién y los derechos", () => {
    renderWithProviders(<PrivacyPage />, { route: ROUTES.privacy.path });

    for (const title of [/1\. Qué datos se recogen/, /2\. Para qué se usan/, /3\. Quién trata los datos/, /4\. Tus derechos/]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
  });

  it("tiene un único h1 y un enlace de contacto con el correo del negocio", () => {
    renderWithProviders(<PrivacyPage />, { route: ROUTES.privacy.path });

    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: CONTACT.email.display })).toHaveAttribute("href", CONTACT.email.link);
  });

  it("lleva noindex y no es indexable según ROUTES (no debe ir al sitemap)", async () => {
    renderWithProviders(<PrivacyPage />, { route: ROUTES.privacy.path });

    await waitFor(() => {
      expect(document.head.querySelector('meta[name="robots"]')?.getAttribute("content")).toContain("noindex");
    });
    expect(ROUTES.privacy.indexable).toBe(false);
  });

  it("aparece en el footer pero no en el navbar", () => {
    expect(ROUTES.privacy.showInFooter).toBe(true);
    expect(ROUTES.privacy.showInNav).toBe(false);
  });
});
