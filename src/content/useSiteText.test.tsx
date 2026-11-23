import { afterEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { BranchProvider } from "@/branch/BranchProvider";
import { ContentContext } from "./ContentContext";
import { snapshot } from "./snapshot";
import { TEXTS } from "./texts";
import { useSiteText } from "./useSiteContent";
import type { SiteContent } from "./types";

// BR-110 (RF-CNT-010, HU-CNT-002 CA-04 a CA-06): el texto sale de la pestaña de la sucursal activa, luego de la base común y
// por último del código.
function Hero() {
  const text = useSiteText();
  return <p data-testid="lema">{text("hero.lema")}</p>;
}

const renderAt = (route: string, content: Partial<SiteContent>) =>
  render(
    <ContentContext value={{ ...snapshot, ...content }}>
      <MemoryRouter initialEntries={[route]}>
        <BranchProvider>
          <Hero />
        </BranchProvider>
      </MemoryRouter>
    </ContentContext>,
  );
const lema = () => screen.getByTestId("lema").textContent;

describe("useSiteText por sucursal (BR-110)", () => {
  afterEach(() => {
    localStorage.clear();
    delete document.documentElement.dataset.branch;
  });

  const content = {
    texts: { "hero.lema": "Común" },
    textsByBranch: { coquimbo: { "hero.lema": "De Coquimbo" }, "la-serena": { "hero.lema": "De La Serena" } },
  };

  it.each([
    ["/coquimbo", "De Coquimbo"],
    ["/la-serena", "De La Serena"],
  ])("CA-04: en %s se ve el texto propio de esa sucursal", (route, expected) => {
    renderAt(route, content);

    expect(lema()).toBe(expected);
  });

  it("CA-05: una clave que la sucursal no define usa la de la base común", () => {
    renderAt("/la-serena", { texts: { "hero.lema": "Común" }, textsByBranch: { coquimbo: {}, "la-serena": {} } });

    expect(lema()).toBe("Común");
  });

  it("sin texto propio ni común, vale el que trae el código", () => {
    renderAt("/la-serena", { texts: {}, textsByBranch: { coquimbo: {}, "la-serena": {} } });

    expect(lema()).toBe(TEXTS["hero.lema"].default);
  });

  it("CA-06: sin la pestaña de Coquimbo (vacía), Coquimbo se ve con la base común, como antes", () => {
    renderAt("/coquimbo", { texts: { "hero.lema": "Común" }, textsByBranch: { coquimbo: {}, "la-serena": { "hero.lema": "De La Serena" } } });

    expect(lema()).toBe("Común");
  });

  it("tolera un contenido sin textsByBranch (un respaldo viejo): usa la base común", () => {
    renderAt("/la-serena", { texts: { "hero.lema": "Común" }, textsByBranch: undefined as unknown as SiteContent["textsByBranch"] });

    expect(lema()).toBe("Común");
  });
});
