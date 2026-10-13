import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { ContentProvider } from "./ContentProvider";
import type { SheetSource } from "./sheetSource";
import { bakedContent } from "./siteContent";
import { useSiteContent, useSiteText } from "./useSiteContent";

/**
 * El contenido se refresca desde la hoja después de cargar (BR-047, HU-CNT-001 CA-06). Un `fetch` falso hace de
 * Google Sheets: responde el CSV de cada pestaña según su `gid`.
 */
const SOURCE: SheetSource = {
  id: "2PACX-prueba",
  gids: { servicios: "1", equipo: "2", textos: "3" },
  baseUrl: "https://hoja.test/d/e",
  timeoutMs: 1000,
};

const EQUIPO = "id,nombre,cargo,experiencia\ncarlos-mendozzz,Carlos Mendozzz,Master Barber,18 años\n";
const TEXTOS = "clave,valor\nhero.titulo,Título desde la hoja\n";
const SERVICIOS_INVALIDOS = "id,nombre,descripcion,precio,duracion,categoria\ncorte,Corte,Descripción,,45 min,Barba\n";

function sheetFetch(tabs: Record<string, string>) {
  return vi.fn(async (input: string | URL | Request) => {
    const gid = new URL(String(input)).searchParams.get("gid") ?? "";
    const body = tabs[gid];
    if (body === undefined) return new Response("no existe", { status: 404 });
    return new Response(body, { status: 200, headers: { "content-type": "text/csv; charset=utf-8" } });
  }) as unknown as typeof fetch & ReturnType<typeof vi.fn>;
}

function Probe() {
  const { team, services } = useSiteContent();
  const siteText = useSiteText();
  return (
    <div>
      <p data-testid="team">{team[0].name}</p>
      <p data-testid="service">{services[0].name}</p>
      <p data-testid="hero">{siteText("hero.titulo")}</p>
    </div>
  );
}

const renderProbe = (props: { sheet?: SheetSource | null; fetchImpl?: typeof fetch }) =>
  render(
    <ContentProvider {...props}>
      <Probe />
    </ContentProvider>,
  );

describe("ContentProvider (BR-047)", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sin hoja configurada muestra el contenido del build y no hace ninguna petición", async () => {
    const fetchImpl = sheetFetch({});

    renderProbe({ sheet: null, fetchImpl });

    expect(screen.getByTestId("team")).toHaveTextContent(bakedContent.team[0].name);
    await new Promise((resolve) => setTimeout(resolve, 20));
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("empieza con el contenido del build y cambia al de la hoja cuando ésta responde", async () => {
    const fetchImpl = sheetFetch({ "2": EQUIPO, "3": TEXTOS });

    renderProbe({ sheet: SOURCE, fetchImpl });

    expect(screen.getByTestId("team")).toHaveTextContent(bakedContent.team[0].name);
    await waitFor(() => expect(screen.getByTestId("team")).toHaveTextContent("Carlos Mendozzz"));
    expect(screen.getByTestId("hero")).toHaveTextContent("Título desde la hoja");
  });

  it("la pestaña que no responde conserva el contenido del build; las demás se actualizan", async () => {
    const fetchImpl = sheetFetch({ "2": EQUIPO });

    renderProbe({ sheet: SOURCE, fetchImpl });

    await waitFor(() => expect(screen.getByTestId("team")).toHaveTextContent("Carlos Mendozzz"));
    expect(screen.getByTestId("service")).toHaveTextContent(bakedContent.services[0].name);
  });

  it("una fila inválida rechaza solo esa pestaña", async () => {
    vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchImpl = sheetFetch({ "1": SERVICIOS_INVALIDOS, "2": EQUIPO });

    renderProbe({ sheet: SOURCE, fetchImpl });

    await waitFor(() => expect(screen.getByTestId("team")).toHaveTextContent("Carlos Mendozzz"));
    expect(screen.getByTestId("service")).toHaveTextContent(bakedContent.services[0].name);
  });

  it("una pestaña que no se configuró no genera avisos aunque el sitio use su valor de siempre", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchImpl = sheetFetch({ "2": EQUIPO });

    renderProbe({ sheet: { ...SOURCE, gids: { equipo: "2" } }, fetchImpl });

    await waitFor(() => expect(screen.getByTestId("team")).toHaveTextContent("Carlos Mendozzz"));
    expect(warn).not.toHaveBeenCalled();
  });

  it("con la hoja caída se queda con el contenido del build y lo avisa en la consola", async () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const fetchImpl = vi.fn(async () => {
      throw new TypeError("Failed to fetch");
    }) as unknown as typeof fetch;

    renderProbe({ sheet: SOURCE, fetchImpl });

    await waitFor(() => expect(warn).toHaveBeenCalled());
    expect(screen.getByTestId("team")).toHaveTextContent(bakedContent.team[0].name);
  });

  it("si se desmonta antes de que responda la hoja, no actualiza nada ni falla", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => {});
    let release: () => void = () => {};
    const gate = new Promise<void>((resolve) => {
      release = resolve;
    });
    const fetchImpl = vi.fn(async () => {
      await gate;
      return new Response(EQUIPO, { status: 200, headers: { "content-type": "text/csv" } });
    }) as unknown as typeof fetch & ReturnType<typeof vi.fn>;

    const { unmount } = renderProbe({ sheet: SOURCE, fetchImpl });
    await waitFor(() => expect(fetchImpl).toHaveBeenCalled());
    unmount();
    release();
    await new Promise((resolve) => setTimeout(resolve, 20));

    expect(error).not.toHaveBeenCalled();
  });
});
