import { describe, expect, it } from "vitest";
import { renderWithProviders } from "@/test/renderWithProviders";
import { ScrollProgressBar } from "./ScrollProgressBar";

// BR-106 (hallazgo de seo-performance-auditor): `/` pasó a ser el selector de sucursal, de una pantalla; la barra de
// progreso va en las portadas, donde hay scroll.
const hasBar = (route: string) => renderWithProviders(<ScrollProgressBar />, { route }).container.childElementCount > 0;

describe("ScrollProgressBar (BR-106)", () => {
  it.each(["/coquimbo", "/la-serena"])("se muestra en la portada %s", (route) => {
    expect(hasBar(route)).toBe(true);
  });

  it.each(["/", "/servicios", "/equipo"])("no se muestra en %s", (route) => {
    expect(hasBar(route)).toBe(false);
  });
});
