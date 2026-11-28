import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, screen } from "@testing-library/react";
import { Outlet, Route, Routes } from "react-router-dom";
import type { ComponentType } from "react";
import { renderWithProviders } from "@/test/renderWithProviders";

// BR-123 (HU-EXP-004 CA-42, CP-CONF-004): el letrero de neón sale cuando la ruta de entrada ya está pintada, no al
// llamar a render(). Con una página lazy pendiente debe seguir encendido; si no, se ve el fallback genérico.
// Cada test importa los módulos de nuevo: el letrero se apaga una sola vez por carga de página.

const mountLoader = () => {
  const el = document.createElement("div");
  el.id = "neon-loader";
  document.body.append(el);
  return el;
};

async function renderRoute(page: ComponentType) {
  vi.resetModules();
  const { RouteErrorBoundary } = await import("./RouteErrorBoundary");
  const Page = page;
  function TestLayout() {
    return (
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
    );
  }
  renderWithProviders(
    <Routes>
      <Route element={<TestLayout />}>
        <Route path="/" element={<Page />} />
      </Route>
    </Routes>,
  );
}

describe("el letrero sale con la página ya pintada (BR-123)", () => {
  beforeEach(() => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    // Recarga de la sesión: sin mínimo, sale en cuanto la página está lista.
    sessionStorage.setItem("neon-loader-seen", "1");
  });

  afterEach(() => {
    document.getElementById("neon-loader")?.remove();
    sessionStorage.clear();
    vi.useRealTimers();
  });

  it("CA-42: con una página que monta de inmediato, sale en cuanto monta", async () => {
    const el = mountLoader();
    await renderRoute(() => <p>Portada</p>);

    await act(() => vi.advanceTimersByTimeAsync(0));

    expect(screen.getByText("Portada")).toBeInTheDocument();
    expect(el.dataset.state).toBe("exiting");
  });

  it("CA-42: con una página lazy pendiente sigue encendido y sale cuando la página se pinta", async () => {
    const el = mountLoader();
    let resolvePage: () => void = () => {};
    const pending = new Promise<void>((resolve) => (resolvePage = resolve));
    const { lazy } = await import("react");
    const LazyPage = lazy(async () => {
      await pending;
      return { default: () => <p>Portada lazy</p> };
    });
    await renderRoute(LazyPage);

    await act(() => vi.advanceTimersByTimeAsync(50));
    expect(el.dataset.state).toBeUndefined();

    await act(async () => {
      resolvePage();
      await vi.advanceTimersByTimeAsync(0);
    });
    await screen.findByText("Portada lazy");
    await act(() => vi.advanceTimersByTimeAsync(0));
    expect(el.dataset.state).toBe("exiting");
  });

  it("CA-42: si la página falla, sale igual y deja ver el error", async () => {
    const el = mountLoader();
    vi.spyOn(console, "error").mockImplementation(() => {});
    await renderRoute(() => {
      throw new Error("falla de prueba");
    });

    await act(() => vi.advanceTimersByTimeAsync(0));

    expect(el.dataset.state).toBe("exiting");
  });
});
