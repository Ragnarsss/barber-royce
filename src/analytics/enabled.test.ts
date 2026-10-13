import { afterEach, describe, expect, it, vi } from "vitest";
import { ROUTES, getFooterRoutes, getNavRoutes } from "@/config/routes";
import { analyticsEnabled } from "./enabled";

const stub = (ga: string, vercel: string) => {
  vi.stubEnv("VITE_GA_MEASUREMENT_ID", ga);
  vi.stubEnv("VITE_VERCEL_ANALYTICS", vercel);
};

describe("analyticsEnabled (BR-044, ADR-007)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it.each([
    ["sin ninguna variable", "", "", false],
    ["solo GA", "G-TEST123", "", true],
    ["solo Vercel Analytics", "", "true", true],
    ["las dos", "G-TEST123", "true", true],
    ["Vercel Analytics con otro valor que «true»", "", "yes", false],
    ["Vercel Analytics explícitamente apagado", "", "false", false],
  ])("%s → %s", (_name, ga, vercel, expected) => {
    stub(ga, vercel);

    expect(analyticsEnabled()).toBe(expected);
  });
});

describe("la página de privacidad solo existe con analítica configurada (BR-044)", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sin analítica el footer no enlaza a la política de privacidad", () => {
    stub("", "");

    expect(getFooterRoutes().map((route) => route.path)).not.toContain(ROUTES.privacy.path);
  });

  it.each([
    ["GA", "G-TEST123", ""],
    ["Vercel Analytics", "", "true"],
  ])("con %s el footer enlaza a la política de privacidad", (_name, ga, vercel) => {
    stub(ga, vercel);

    expect(getFooterRoutes().map((route) => route.path)).toContain(ROUTES.privacy.path);
  });

  it("el resto de las rutas del footer no dependen de la analítica", () => {
    stub("", "");
    const without = getFooterRoutes().map((route) => route.path);
    stub("G-TEST123", "");
    const withGa = getFooterRoutes().map((route) => route.path);

    expect(withGa.filter((path) => path !== ROUTES.privacy.path)).toEqual(without);
  });

  it("la privacidad nunca aparece en el navbar", () => {
    stub("G-TEST123", "true");

    expect(getNavRoutes().map((route) => route.path)).not.toContain(ROUTES.privacy.path);
  });

  it("la ruta está marcada como dependiente de la analítica", () => {
    expect(ROUTES.privacy.requiresAnalytics).toBe(true);
  });
});
