import { describe, expect, it } from "vitest";
import { SITE } from "./constants";

// BR-050: el hero dibuja la marca en dos partes («Barbería» pequeña y «Royce» grande). `SITE.name` sigue siendo el
// nombre completo que usan el SEO y los metadatos; las dos partes tienen que ser ese mismo nombre.
describe("SITE.brand (BR-050, RNF-DATOS-001)", () => {
  it("tiene prefijo y nombre no vacíos", () => {
    expect(SITE.brand.prefix.trim()).not.toBe("");
    expect(SITE.brand.name.trim()).not.toBe("");
  });

  it("las dos partes juntas son las mismas palabras que SITE.name, en cualquier orden", () => {
    const words = (text: string) => text.toLowerCase().split(/\s+/).sort();

    expect(words(`${SITE.brand.prefix} ${SITE.brand.name}`)).toEqual(words(SITE.name));
  });
});
