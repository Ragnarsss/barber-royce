import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import * as icons from "./index";

// BR-027, tramo de íconos: los íconos genéricos salen de lucide-react; aquí quedan solo los de marca, que lucide no trae.
const BRAND_ICONS = ["WhatsAppIcon", "InstagramIcon", "FacebookIcon", "TikTokIcon"];
const here = dirname(fileURLToPath(import.meta.url));

describe("BR-027: íconos propios solo de marca", () => {
  it("criterio 2: components/icons exporta solo íconos de marca", () => {
    expect(Object.keys(icons).sort()).toEqual([...BRAND_ICONS].sort());
  });

  it("criterio 2: CTA2 no dibuja en línea un ícono que trae lucide", () => {
    const cta2 = readFileSync(resolve(here, "../sections/CTA2/CTA2.tsx"), "utf8");
    expect(cta2).not.toMatch(/<svg\b/);
  });
});
