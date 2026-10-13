import { describe, expect, it } from "vitest";
import { ROUTES, getFooterRoutes, getNavRoutes } from "./routes";

const routes = Object.values(ROUTES);

describe("ROUTES (RF-SEO-001, RF-NAV-001)", () => {
  it("cada ruta tiene un path absoluto y único", () => {
    const paths = routes.map((route) => route.path);

    expect(paths.every((path) => path.startsWith("/"))).toBe(true);
    expect(new Set(paths).size).toBe(paths.length);
  });

  it("CP-SEO-001: título y descripción presentes y distintos entre rutas", () => {
    const titles = routes.map((route) => route.title);
    const descriptions = routes.map((route) => route.description);

    expect(titles.every((title) => title.trim().length > 0)).toBe(true);
    expect(descriptions.every((description) => description.trim().length > 0)).toBe(true);
    expect(new Set(titles).size).toBe(titles.length);
    expect(new Set(descriptions).size).toBe(descriptions.length);
  });

  it("navbar y footer se arman solo con las rutas marcadas para cada uno", () => {
    expect(getNavRoutes()).toEqual(routes.filter((route) => route.showInNav));
    expect(getFooterRoutes()).toEqual(routes.filter((route) => route.showInFooter && !route.requiresAnalytics));
    expect(getNavRoutes().some((route) => route.path === "/")).toBe(false);
  });
});
