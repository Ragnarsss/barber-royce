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

describe("portadas por sucursal (BR-106, RF-SUC-002, RF-SUC-004)", () => {
  it("CA-01, CP-SUC-004: `/` nombra las dos sucursales en el título y la descripción", () => {
    expect(ROUTES.home.title).toMatch(/Coquimbo/);
    expect(ROUTES.home.title).toMatch(/La Serena/);
    expect(ROUTES.home.description).toMatch(/Coquimbo/);
    expect(ROUTES.home.description).toMatch(/La Serena/);
  });

  it.each([
    ["coquimbo", "/coquimbo", "Coquimbo", "La Serena"],
    ["laSerena", "/la-serena", "La Serena", "Coquimbo"],
  ] as const)("la portada %s vive en %s, nombra su sucursal y no la otra", (key, path, own, other) => {
    expect(ROUTES[key].path).toBe(path);
    expect(ROUTES[key].title).toContain(own);
    expect(ROUTES[key].title).not.toContain(other);
    expect(ROUTES[key].description).toContain(own);
  });

  it("las portadas son indexables, pero no van ni en el menú ni en el footer (el footer ya enlaza a `/`)", () => {
    for (const key of ["coquimbo", "laSerena"] as const) {
      expect(ROUTES[key].indexable).not.toBe(false);
      expect(ROUTES[key].showInNav).toBe(false);
      expect(ROUTES[key].showInFooter).toBe(false);
    }
  });
});
