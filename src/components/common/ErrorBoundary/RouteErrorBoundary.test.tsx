import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Link, Outlet, Route, Routes } from "react-router-dom";
import { renderWithProviders } from "@/test/renderWithProviders";
import { RouteErrorBoundary } from "./RouteErrorBoundary";

// Página que falla mientras `shouldThrow.value` sea true.
const shouldThrow = { value: true };
function FailingPage() {
  if (shouldThrow.value) throw new Error("detalle técnico interno");
  return <p>Página recuperada</p>;
}

// Réplica mínima del Layout: un "navbar" fuera del boundary y el Outlet dentro.
function TestLayout() {
  return (
    <>
      <nav>
        <Link to="/otra">Ir a otra</Link>
      </nav>
      <RouteErrorBoundary>
        <Outlet />
      </RouteErrorBoundary>
    </>
  );
}

const renderApp = () =>
  renderWithProviders(
    <Routes>
      <Route element={<TestLayout />}>
        <Route path="/" element={<FailingPage />} />
        <Route path="/otra" element={<p>Otra página</p>} />
      </Route>
    </Routes>,
  );

describe("RouteErrorBoundary (BR-019, CP-NAV-003)", () => {
  beforeEach(() => {
    shouldThrow.value = true;
    // React y reportError escriben el error en consola; se silencia en el test.
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("HU-EXP-003 CA-03: una página que falla muestra el fallback y el navbar sigue ahí", () => {
    renderApp();

    expect(screen.getByRole("alert")).toHaveTextContent("No pudimos mostrar esta página");
    expect(screen.getByRole("link", { name: "Ir a otra" })).toBeInTheDocument();
  });

  it("no muestra el mensaje técnico del error al usuario", () => {
    renderApp();

    expect(screen.queryByText(/detalle técnico interno/)).not.toBeInTheDocument();
  });

  it("registra el error en un solo lugar", () => {
    renderApp();

    expect(console.error).toHaveBeenCalledWith("Error de render capturado:", expect.any(Error));
  });

  it("Reintentar vuelve a montar la página sin recargar el sitio", async () => {
    const user = userEvent.setup();
    renderApp();

    shouldThrow.value = false;
    await user.click(screen.getByRole("button", { name: /reintentar/i }));

    expect(screen.getByText("Página recuperada")).toBeInTheDocument();
  });

  it("navegar a otra ruta después de un error la muestra normalmente", async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole("link", { name: "Ir a otra" }));

    expect(screen.getByText("Otra página")).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
