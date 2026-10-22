import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-092: los hexágonos de fondo de la galería no tienen transiciones que persiguen a framer.
const here = dirname(fileURLToPath(import.meta.url));
const css = readFileSync(resolve(here, "SocialProof2.module.css"), "utf8");
const source = readFileSync(resolve(here, "SocialProof2.tsx"), "utf8");
const hexagonRules = [...css.matchAll(/\n\.(hexagon\w*)\s*\{([^}]*)\}/g)];

describe("BR-092: hexágonos de SocialProof2", () => {
  it("criterio 2: ninguna regla de hexágono lleva `transition: transform` (framer lo escribe en cada fotograma)", () => {
    expect(hexagonRules.length).toBeGreaterThan(0);
    for (const [, name, body] of hexagonRules) {
      expect(body, name).not.toMatch(/transition:[^;]*transform/);
      expect(body, name).not.toMatch(/(^|[^-])transform:/);
    }
  });

  it("criterio 2: los hexágonos son SVG con geometría fija, sin `clip-path`", () => {
    expect(source).toMatch(/<FixedShape\b/);
    for (const [, name, body] of hexagonRules) {
      expect(body, name).not.toMatch(/clip-path/);
    }
  });
});
