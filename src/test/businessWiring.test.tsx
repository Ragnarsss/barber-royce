import { beforeAll, describe, expect, it, vi } from "vitest";
import { screen, within } from "@testing-library/react";
import type { ReactElement } from "react";
import { ContentContext } from "@/content/ContentContext";
import { buildBusiness } from "@/content/business";
import { snapshot } from "@/content/snapshot";
import type { SiteContent } from "@/content/types";
import { LenisContext } from "@/contexts/lenisContextValue";
import { CTA2 } from "@/components/sections/CTA2/CTA2";
import { Footer } from "@/components/layout/Footer/Footer";
import { Navbar } from "@/components/layout/Navbar/Navbar";
import { FAQPage } from "@/pages/FAQPage";
import { LocationPage } from "@/pages/LocationPage";
import { NotFoundPage } from "@/pages/NotFoundPage";
import { renderWithProviders } from "./renderWithProviders";

/**
 * Los datos de contacto, reservas, horarios, redes y sucursales salen de la hoja (BR-048, HU-CNT-003): cada
 * lugar del sitio que los muestra usa el contenido vigente, no una constante del código. Se prueba dándole al
 * sitio datos distintos a los de siempre y comprobando que aparecen donde corresponde.
 */
const business = buildBusiness(
  {
    telefono: "+56 9 5555 4444",
    whatsapp: "+56 9 1111 2222",
    "whatsapp.mensaje": "Hola desde la hoja",
    email: "hola@hoja.cl",
    "reservas.url": "https://reservas.hoja.test/agenda",
    "reservas.etiqueta": "Agenda hoy",
    "horario.resumen": "Todos los días: 8:00 - 22:00",
    "instagram.url": "https://www.instagram.com/hoja/",
    "facebook.url": "https://www.facebook.com/hoja",
    "tiktok.url": "https://www.tiktok.com/@hoja",
  },
  snapshot.business,
);

const content: SiteContent = {
  ...snapshot,
  business,
  locations: [
    {
      name: "Sucursal de la hoja",
      address: "Calle de la hoja 123",
      city: "Ciudad de la hoja",
      phone: "+56 9 7777 8888",
      email: "sucursal@hoja.cl",
      whatsapp: "+56 9 7777 8888",
      mapUrl: "https://www.google.com/maps/embed?pb=hoja",
      schedule: [
        { day: "Lunes - Viernes", hours: "07:00 - 21:00" },
        { day: "Sábado", hours: "08:00 - 14:00" },
        { day: "Domingo", hours: "Cerrado" },
      ],
    },
  ],
};

const render = (ui: ReactElement) =>
  renderWithProviders(
    <LenisContext value={null}>
      <ContentContext.Provider value={content}>{ui}</ContentContext.Provider>
    </LenisContext>,
  );

describe("los datos del negocio se leen del contenido vigente (BR-048)", () => {
  beforeAll(() => {
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

  it("el footer muestra el teléfono, el correo, el horario, las redes y WhatsApp de la hoja", () => {
    render(<Footer />);

    expect(screen.getByRole("link", { name: "+56 9 5555 4444" })).toHaveAttribute("href", "tel:+56955554444");
    expect(screen.getByRole("link", { name: "hola@hoja.cl" })).toHaveAttribute("href", "mailto:hola@hoja.cl");
    expect(screen.getByText("Todos los días: 8:00 - 22:00")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Instagram" })).toHaveAttribute("href", "https://www.instagram.com/hoja/");
    expect(screen.getByRole("link", { name: "Facebook" })).toHaveAttribute("href", "https://www.facebook.com/hoja");
    expect(screen.getByRole("link", { name: "TikTok" })).toHaveAttribute("href", "https://www.tiktok.com/@hoja");
    const whatsapp = screen.getAllByRole("link").find((link) => link.getAttribute("href")?.includes("phone=56911112222"));
    expect(whatsapp?.getAttribute("href")).toContain("text=Hola+desde+la+hoja");
  });

  it("los botones de reservar (barra de navegación, segundo bloque de reserva y página 404) llevan al enlace de la hoja", () => {
    render(<Navbar />);
    const navLinks = screen.getAllByRole("link").filter((link) => link.getAttribute("href") === "https://reservas.hoja.test/agenda");
    expect(navLinks.length).toBeGreaterThanOrEqual(1);
  });

  it("CTA2 usa el enlace de reservas y el WhatsApp de la hoja", () => {
    render(<CTA2 />);

    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href") === "https://reservas.hoja.test/agenda")).toBe(true);
    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href")?.includes("phone=56911112222"))).toBe(true);
  });

  it("la página 404 ofrece reservar con el enlace y el texto de la hoja", () => {
    render(<NotFoundPage />);

    expect(screen.getByRole("link", { name: /Agenda hoy/ })).toHaveAttribute("href", "https://reservas.hoja.test/agenda");
  });

  it("las preguntas frecuentes llevan al WhatsApp de la hoja", () => {
    render(<FAQPage />);

    expect(screen.getAllByRole("link").some((link) => link.getAttribute("href")?.includes("phone=56911112222"))).toBe(true);
  });

  it("la página de ubicación muestra las sucursales de la hoja, con sus horarios, enlaces y mapa", () => {
    const { container } = render(<LocationPage />);

    expect(screen.getAllByText(/sucursal de la hoja/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(new RegExp(snapshot.locations[0].name, "i"))).not.toBeInTheDocument();
    expect(screen.getByText(/Calle de la hoja 123/)).toHaveTextContent("Ciudad de la hoja");
    expect(screen.getByText("07:00 - 21:00")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "+56 9 7777 8888" })).toHaveAttribute("href", "tel:+56 9 7777 8888");
    expect(screen.getByRole("link", { name: "sucursal@hoja.cl" })).toHaveAttribute("href", "mailto:sucursal@hoja.cl");
    expect(container.querySelector("iframe")?.getAttribute("src")).toBe("https://www.google.com/maps/embed?pb=hoja");
  });

  it("sin hoja (contenido del build) todo sigue como antes: el footer muestra el teléfono de siempre", () => {
    renderWithProviders(
      <ContentContext.Provider value={snapshot}>
        <Footer />
      </ContentContext.Provider>,
    );

    expect(within(document.body).getByRole("link", { name: snapshot.business.contact.phone.display })).toBeInTheDocument();
  });
});
