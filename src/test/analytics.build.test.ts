// @vitest-environment node
import { describe, expect, it } from "vitest";
import { buildSite, filesContaining } from "./buildOutput";

const entryChunk = (files: Map<string, string>) => files.get("index.html")?.match(/<script[^>]*src="\/(assets\/js\/index-[^"]+\.js)"/)?.[1];

// La analítica es opt-in (ADR-007). Se construye el sitio de verdad y se mira qué llegaría al navegador.
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
    expect(entryChunk(files)).toBeTruthy();
    expect(withInsights[0]).not.toBe(entryChunk(files));
    expect(withInsights[0]).not.toBe("index.html");
  }, 120_000);
});

describe("Google Analytics en el build (BR-037, CP-MED-002, CP-PRIV-001)", () => {
  it("sin ID de medición no llega nada de Google, ni el aviso, ni el código de consentimiento", async () => {
    const files = await buildSite();

    expect(filesContaining(files, "googletagmanager.com")).toEqual([]);
    expect(filesContaining(files, "google-analytics.com")).toEqual([]);
    expect(filesContaining(files, "Tu privacidad")).toEqual([]);
    // La clave donde se guarda la elección solo existe en el código de consentimiento.
    expect(filesContaining(files, "barber-royce:analytics-consent")).toEqual([]);
  }, 120_000);

  it("con ID, el cargador de Google y el aviso van en un chunk aparte que no está en el arranque", async () => {
    const files = await buildSite({ VITE_GA_MEASUREMENT_ID: "G-TEST123" });

    const withGoogle = filesContaining(files, "googletagmanager.com");
    expect(withGoogle).toHaveLength(1);
    expect(withGoogle[0]).not.toBe(entryChunk(files));
    expect(withGoogle[0]).not.toBe("index.html");
    expect(filesContaining(files, "Tu privacidad")).toEqual(withGoogle);
    // El HTML inicial no menciona a Google: nada se pide antes de que el visitante acepte.
    expect(files.get("index.html")).not.toContain("google");
  }, 120_000);
});
