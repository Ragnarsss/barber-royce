import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContentContext } from "@/content/ContentContext";
import { bakedContent } from "@/content/siteContent";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";
import { WelcomePromo } from "./WelcomePromo";

const ID = "G-TEST123";
const google = window as unknown as { gtag?: unknown; [key: string]: unknown };
const gtag = vi.fn();

const renderPromo = (onClose = vi.fn(), texts: Record<string, string> = {}) => {
  renderWithProviders(
    <LenisContext value={null}>
      <ContentContext value={{ ...bakedContent, texts }}>
        <WelcomePromo onClose={onClose} />
      </ContentContext>
    </LenisContext>,
  );
  return onClose;
};

describe("WelcomePromo: el modal de bienvenida (BR-100, HU-RES-003)", () => {
  it("CA-01: ofrece la mascarilla facial gratis y dice qué mencionar", () => {
    renderPromo();

    expect(screen.getByRole("dialog", { name: /mascarilla facial/i })).toBeInTheDocument();
    expect(screen.getByText(/Royce web/)).toBeInTheDocument();
    expect(screen.getByText(/servicio pagado/i)).toBeInTheDocument();
  });

  it("RN-02: los textos salen de la hoja (promo.titulo, promo.frase, promo.condiciones)", () => {
    renderPromo(vi.fn(), {
      "promo.titulo": "Corte gratis",
      "promo.frase": "Código del dueño",
      "promo.condiciones": "Solo los martes.",
    });

    expect(screen.getByRole("heading", { name: "Corte gratis" })).toBeInTheDocument();
    expect(screen.getByText(/Código del dueño/)).toBeInTheDocument();
    expect(screen.getByText("Solo los martes.")).toBeInTheDocument();
  });

  it("CA-05: «Reservar» abre AgendaPro en una pestaña nueva, con la URL de la configuración", () => {
    renderPromo();

    const link = screen.getByRole("link", { name: bakedContent.business.booking.label });

    expect(link).toHaveAttribute("href", bakedContent.business.booking.url);
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("CA-06: el diálogo tiene nombre y descripción, y el foco queda dentro", () => {
    renderPromo();

    const dialog = screen.getByRole("dialog");

    expect(dialog).toHaveAccessibleName(/mascarilla facial/i);
    expect(dialog).toHaveAccessibleDescription(/servicio pagado/i);
    expect(dialog).toContainElement(document.activeElement as HTMLElement);
  });

  it("CA-03: el botón de cerrar avisa al padre", async () => {
    const onClose = renderPromo();

    await userEvent.setup().click(screen.getByRole("button", { name: /cerrar la promoción/i }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe("WelcomePromo: medición con consentimiento (BR-100, CA-08, CP-MED-006)", () => {
  beforeEach(() => {
    vi.stubEnv("VITE_GA_MEASUREMENT_ID", ID);
    gtag.mockClear();
    google.gtag = gtag;
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    delete google.gtag;
    delete google[`ga-disable-${ID}`];
  });

  it("con consentimiento envía promo_view al verse, y promo_close y reserve_click (section promo) al actuar", async () => {
    google[`ga-disable-${ID}`] = false;
    const user = userEvent.setup();
    renderPromo();

    expect(gtag).toHaveBeenCalledWith("event", "promo_view", {});

    const link = screen.getByRole("link", { name: bakedContent.business.booking.label });
    link.addEventListener("click", (event) => event.preventDefault());
    await user.click(link);
    await user.click(screen.getByRole("button", { name: /cerrar la promoción/i }));

    expect(gtag).toHaveBeenCalledWith("event", "reserve_click", { section: "promo" });
    expect(gtag).toHaveBeenCalledWith("event", "promo_close", {});
  });

  it("RNF-PRIV-001: sin consentimiento no se envía ningún evento", async () => {
    renderPromo();
    await userEvent.setup().click(screen.getByRole("button", { name: /cerrar la promoción/i }));

    expect(gtag).not.toHaveBeenCalled();
  });
});
