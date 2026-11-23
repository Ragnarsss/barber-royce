import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { BOOKING } from "@/config/constants";
import { locationsList } from "@/data/locationsData";
import { ContentContext } from "@/content/ContentContext";
import { snapshot } from "@/content/snapshot";
import type { SiteContent } from "@/content/types";
import type { Branch } from "@/config/branches";
import { BranchContext } from "./BranchContext";
import { useBookingUrl } from "./useBookingUrl";

// BR-103 (RF-RES-008, CP-RES-008, HU-RES-001 CA-04): el enlace de reserva sigue a la sucursal activa.
const LA_SERENA_URL = "https://roycespa.site.agendapro.com/cl/sucursal/98243";

const wrapper = (branch: Branch, content: SiteContent = snapshot) =>
  function Wrapper({ children }: { children: ReactNode }) {
    return (
      <ContentContext value={content}>
        <BranchContext value={{ branch, source: "url", setBranch: () => {} }}>{children}</BranchContext>
      </ContentContext>
    );
  };

describe("useBookingUrl (BR-103)", () => {
  it("con Coquimbo activa devuelve el enlace de Coquimbo", () => {
    const { result } = renderHook(() => useBookingUrl(), { wrapper: wrapper("coquimbo") });

    expect(result.current).toBe(BOOKING.url);
  });

  it("con La Serena activa devuelve el enlace de La Serena", () => {
    const { result } = renderHook(() => useBookingUrl(), { wrapper: wrapper("la-serena") });

    expect(result.current).toBe(LA_SERENA_URL);
  });

  it("el respaldo del repo trae el enlace propio de cada sucursal y son distintos", () => {
    const urls = locationsList.map((location) => location.bookingUrl);

    expect(urls.every((url) => url?.startsWith("https://roycespa.site.agendapro.com/cl/sucursal/"))).toBe(true);
    expect(new Set(urls).size).toBe(locationsList.length);
  });

  it("una sucursal sin enlace propio usa el general de la pestaña negocio", () => {
    const withoutOwn: SiteContent = { ...snapshot, locations: snapshot.locations.map((location) => {
        const copy = { ...location };
        delete copy.bookingUrl;
        return copy;
      }) };

    const { result } = renderHook(() => useBookingUrl(), { wrapper: wrapper("la-serena", withoutOwn) });

    expect(result.current).toBe(snapshot.business.booking.url);
  });
});
