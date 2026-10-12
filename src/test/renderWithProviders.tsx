import type { ReactElement } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

interface Options {
  /** Ruta inicial del router en memoria. */
  route?: string;
}

/**
 * Renderiza con los providers que necesita cualquier página: router en
 * memoria y Helmet. Cada llamada crea su propio contexto de Helmet para que
 * un test no vea los <title> que dejó otro.
 */
export function renderWithProviders(ui: ReactElement, { route = "/" }: Options = {}) {
  const helmetContext = {};
  const result = render(
    <HelmetProvider context={helmetContext}>
      <MemoryRouter initialEntries={[route]}>{ui}</MemoryRouter>
    </HelmetProvider>,
  );
  return { ...result, helmetContext };
}
