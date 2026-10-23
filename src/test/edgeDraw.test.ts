import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

// BR-096 (HU-EXP-004 CA-38): `pathLength` no se lleva con `vector-effect: non-scaling-stroke` (comprobado en Chrome: el
// trazo sale siempre completo), así que ninguna figura que se dibuja puede conservarlo.
const src = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const read = (file: string) => readFileSync(resolve(src, file), "utf8");

const DRAWN = [
  { name: "Hero", css: "components/sections/Hero/Hero.module.css", tsx: "components/sections/Hero/Hero.tsx", marker: /edgeDraw/ },
  { name: "CTA1", css: "components/sections/CTA1/CTA1.module.css", tsx: "components/sections/CTA1/CTA1.tsx", marker: /edgeDraw/ },
  { name: "SocialProof1", css: "components/sections/SocialProof1/SocialProof1.module.css", tsx: "components/sections/SocialProof1/SocialProof1.tsx", marker: /pathLength/ },
  { name: "Features", css: "components/sections/Features/Features.module.css", tsx: "components/sections/Features/Features.tsx", marker: /FEATURES_EDGE/ },
  { name: "Reviews", css: "components/sections/Reviews/Reviews.module.css", tsx: "components/sections/Reviews/Reviews.tsx", marker: /REVIEWS_EDGE/ },
];

describe("BR-096: figuras que se dibujan", () => {
  it.each(DRAWN)("$name: dibuja su borde y no conserva non-scaling-stroke", ({ css, tsx, marker }) => {
    expect(read(tsx)).toMatch(marker);
    expect(read(css)).not.toMatch(/vector-effect/);
    expect(read(tsx)).not.toMatch(/vectorEffect/);
  });
});
