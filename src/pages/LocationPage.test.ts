import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-099 (HU-INFO-002 CA-04): la tarjeta de cada sucursal usa el ancho disponible en vez de quedar angosta y centrada.
const css = readFileSync(resolve(dirname(fileURLToPath(import.meta.url)), "LocationPage.module.css"), "utf8");
const rule = (selector: string) => css.match(new RegExp(`\\n\\.${selector}\\s*\\{([^}]*)\\}`))?.[1] ?? "";

describe("LocationPage: ancho de la tarjeta de sucursal (BR-099)", () => {
  it("CA-04: las pestañas siguen centradas, pero el contenido de cada una no se encoge a lo que ocupan sus hijos", () => {
    // `.tabs` es una columna con `align-items: center`: sin ancho propio, `.tabContent` toma el ancho de su contenido
    expect(rule("tabs")).toMatch(/align-items:\s*center/);
    expect(rule("tabContent")).toMatch(/width:\s*100%/);
  });

  it("CA-04: la tarjeta ocupa el ancho disponible hasta un máximo y se centra, en vez de estirarse sin límite", () => {
    const card = rule("locationContent");
    expect(card).toMatch(/width:\s*100%/);
    expect(card).toMatch(/max-width:\s*70rem/);
    expect(card).toMatch(/margin-inline:\s*auto/);
  });
});
