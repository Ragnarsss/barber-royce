// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildSite, filesContaining } from "./buildOutput";

// BR-036: la analítica es opt-in. Se construye el sitio dos veces, sin y con la variable.
describe("Vercel Analytics en el build (BR-036, CP-MED-001)", () => {
  it("sin la variable, el código de Analytics no llega al sitio", async () => {
    const files = await buildSite();

    expect(filesContaining(files, "_vercel/insights")).toEqual([]);
  }, 120_000);

  it("con la variable, Analytics va en un chunk aparte que no está en el arranque", async () => {
    const files = await buildSite({ VITE_VERCEL_ANALYTICS: "true" });

    const withInsights = filesContaining(files, "_vercel/insights");
    expect(withInsights).toHaveLength(1);
    // No es el HTML ni el chunk de entrada: se pide después de `load`.
    const entry = files.get("index.html")?.match(/<script[^>]*src="\/(assets\/js\/index-[^"]+\.js)"/)?.[1];
    expect(entry).toBeTruthy();
    expect(withInsights[0]).not.toBe(entry);
    expect(withInsights[0]).not.toBe("index.html");
  }, 120_000);
});
