// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { DEFAULT_BASE_URL, MAX_CSV_BYTES, fetchSheet, fetchSheetTabs, parseGids, sheetSourceFromEnv, sheetUrl } from "../content/sheetSource";

const csvResponse = (body: string, init: { status?: number; type?: string; headers?: Record<string, string> } = {}) =>
  new Response(body, { status: init.status ?? 200, headers: { "content-type": init.type ?? "text/csv; charset=utf-8", ...init.headers } });

const ENV = { CONTENT_SHEET_ID: "2PACX-abc", CONTENT_SHEET_GIDS: "servicios:0,productos:123" };

describe("parseGids (BR-040)", () => {
  it("lee pares pestaña:gid, con espacios alrededor", () => {
    expect(parseGids(" servicios:0 , productos : 123 ")).toEqual({ gids: { servicios: "0", productos: "123" }, problems: [] });
  });

  it("sin valor no hay pestañas ni problemas", () => {
    expect(parseGids(undefined)).toEqual({ gids: {}, problems: [] });
    expect(parseGids("")).toEqual({ gids: {}, problems: [] });
  });

  it.each([
    ["servicios", "no tiene el formato pestaña:gid"],
    ["servicios:", "no tiene el formato pestaña:gid"],
    ["servicios:1:2", "no tiene el formato pestaña:gid"],
    ["peluqueria:5", 'la pestaña "peluqueria" no existe'],
    ["servicios:abc", "debe ser un número"],
  ])("«%s» se informa sin romper: %s", (entry, message) => {
    const { gids, problems } = parseGids(entry);

    expect(gids).toEqual({});
    expect(problems).toHaveLength(1);
    expect(problems[0]).toContain(message);
  });

  it("una entrada mala no impide leer las buenas", () => {
    const { gids, problems } = parseGids("servicios:0,peluqueria:5,equipo:7");

    expect(gids).toEqual({ servicios: "0", equipo: "7" });
    expect(problems).toHaveLength(1);
  });
});

describe("sheetUrl", () => {
  it("arma la dirección de publicación de una pestaña como CSV", () => {
    expect(sheetUrl(DEFAULT_BASE_URL, "2PACX-abc", "123")).toBe("https://docs.google.com/spreadsheets/d/e/2PACX-abc/pub?gid=123&single=true&output=csv");
  });

  it("tolera una barra final en la base y escapa el identificador", () => {
    expect(sheetUrl("http://localhost:1/e/", "a b", "1")).toBe("http://localhost:1/e/a%20b/pub?gid=1&single=true&output=csv");
  });
});

describe("fetchSheet (BR-040, HU-CNT-001 CA-02, RNF-CONF-003)", () => {
  describe("sin hoja configurada", () => {
    it.each([{}, { CONTENT_SHEET_ID: "" }, { CONTENT_SHEET_ID: "   " }])("%j: no pide nada", async (env) => {
      const fetchImpl = vi.fn();

      const outcome = await fetchSheet(env, fetchImpl as unknown as typeof fetch);

      expect(outcome).toEqual({ configured: false, sheet: {}, problems: [] });
      expect(fetchImpl).not.toHaveBeenCalled();
    });
  });

  describe("con la hoja configurada", () => {
    it("pide cada pestaña configurada, con su gid, y devuelve el CSV", async () => {
      const fetchImpl = vi.fn(async (url: string | URL | Request) => csvResponse(String(url).includes("gid=0") ? "id,nombre\n" : "id,precio\n"));

      const outcome = await fetchSheet(ENV, fetchImpl as unknown as typeof fetch);

      expect(outcome.configured).toBe(true);
      expect(outcome.sheet).toEqual({ servicios: "id,nombre\n", productos: "id,precio\n" });
      expect(outcome.problems).toEqual([]);
      expect(fetchImpl.mock.calls.map(([url]) => String(url)).sort()).toEqual([
        sheetUrl(DEFAULT_BASE_URL, "2PACX-abc", "0"),
        sheetUrl(DEFAULT_BASE_URL, "2PACX-abc", "123"),
      ]);
    });

    it("pide solo CSV y con un tiempo máximo", async () => {
      const fetchImpl = vi.fn(async () => csvResponse("a\n"));

      await fetchSheet(ENV, fetchImpl as unknown as typeof fetch);

      const [, init] = fetchImpl.mock.calls[0] as unknown as [string, RequestInit];
      expect(init.headers).toMatchObject({ accept: "text/csv" });
      expect(init.signal).toBeInstanceOf(AbortSignal);
    });

    it("usa la base de prueba si se define CONTENT_SHEET_BASE_URL", async () => {
      const fetchImpl = vi.fn(async () => csvResponse("a\n"));

      await fetchSheet({ ...ENV, CONTENT_SHEET_BASE_URL: "http://127.0.0.1:9/d/e" }, fetchImpl as unknown as typeof fetch);

      expect(String(fetchImpl.mock.calls[0][0 as never])).toMatch(/^http:\/\/127\.0\.0\.1:9\/d\/e\/2PACX-abc\/pub/);
    });

    it("sin ninguna pestaña definida avisa en vez de quedarse callado", async () => {
      const outcome = await fetchSheet({ CONTENT_SHEET_ID: "x" }, vi.fn() as unknown as typeof fetch);

      expect(outcome.configured).toBe(true);
      expect(outcome.problems.join(" ")).toContain("no define ninguna pestaña");
    });
  });

  describe("fallos: nunca lanza, cada pestaña informa lo suyo", () => {
    it("HTTP 404 en una pestaña: las demás se descargan", async () => {
      const fetchImpl = vi.fn(async (url: string | URL | Request) => (String(url).includes("gid=0") ? csvResponse("no", { status: 404 }) : csvResponse("ok\n")));

      const outcome = await fetchSheet(ENV, fetchImpl as unknown as typeof fetch);

      expect(outcome.sheet).toEqual({ productos: "ok\n" });
      expect(outcome.problems).toEqual(["servicios: la hoja respondió HTTP 404"]);
    });

    it("la respuesta es HTML (pestaña sin publicar o inicio de sesión de Google): no se acepta", async () => {
      const fetchImpl = vi.fn(async () => csvResponse("<html>Inicia sesión</html>", { type: "text/html; charset=utf-8" }));

      const outcome = await fetchSheet({ ...ENV, CONTENT_SHEET_GIDS: "servicios:0" }, fetchImpl as unknown as typeof fetch);

      expect(outcome.sheet).toEqual({});
      expect(outcome.problems[0]).toContain("no es CSV");
      expect(outcome.problems[0]).toContain("text/html");
    });

    it("una respuesta sin tipo de contenido tampoco se acepta", async () => {
      const fetchImpl = vi.fn(async () => new Response("a,b\n", { headers: {} }));

      const outcome = await fetchSheet({ ...ENV, CONTENT_SHEET_GIDS: "servicios:0" }, fetchImpl as unknown as typeof fetch);

      expect(outcome.sheet).toEqual({});
    });

    it("error de red: lo cuenta y sigue", async () => {
      const fetchImpl = vi.fn(async () => {
        throw new TypeError("fetch failed");
      });

      const outcome = await fetchSheet(ENV, fetchImpl as unknown as typeof fetch);

      expect(outcome.sheet).toEqual({});
      expect(outcome.problems).toHaveLength(2);
      expect(outcome.problems[0]).toContain("no se pudo conectar: fetch failed");
    });

    it("un fetch que lanza de forma síncrona tampoco rompe", async () => {
      const fetchImpl = vi.fn(() => {
        throw new Error("boom");
      });

      await expect(fetchSheet(ENV, fetchImpl as unknown as typeof fetch)).resolves.toMatchObject({ configured: true, sheet: {} });
    });

    it("CA-02: si la hoja no responde dentro del tiempo máximo, se rinde y lo dice", async () => {
      // Un fetch que nunca responde, pero que respeta la señal de cancelación como el real.
      const hanging = (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_resolve, reject) => init?.signal?.addEventListener("abort", () => reject(init.signal?.reason)));

      const started = Date.now();
      const outcome = await fetchSheet({ ...ENV, CONTENT_FETCH_TIMEOUT_MS: "80" }, hanging as unknown as typeof fetch);

      expect(Date.now() - started).toBeLessThan(2000);
      expect(outcome.sheet).toEqual({});
      expect(outcome.problems[0]).toContain("no respondió en 0.08 s");
    });

    it("una respuesta enorme (por tamaño declarado o real) se rechaza", async () => {
      const declared = vi.fn(async () => csvResponse("x", { headers: { "content-length": String(MAX_CSV_BYTES + 1) } }));
      const actual = vi.fn(async () => csvResponse("x".repeat(MAX_CSV_BYTES + 1)));

      const a = await fetchSheet({ ...ENV, CONTENT_SHEET_GIDS: "servicios:0" }, declared as unknown as typeof fetch);
      const b = await fetchSheet({ ...ENV, CONTENT_SHEET_GIDS: "servicios:0" }, actual as unknown as typeof fetch);

      expect(a.sheet).toEqual({});
      expect(b.sheet).toEqual({});
      expect(a.problems[0]).toContain("pesa");
      expect(b.problems[0]).toContain("pesa");
    });

    it("un tiempo máximo inválido vuelve al valor por defecto", async () => {
      const fetchImpl = vi.fn(async () => csvResponse("a\n"));

      const outcome = await fetchSheet({ ...ENV, CONTENT_FETCH_TIMEOUT_MS: "abc" }, fetchImpl as unknown as typeof fetch);

      expect(outcome.sheet.servicios).toBe("a\n");
    });
  });
});

describe("sheetSourceFromEnv (BR-047)", () => {
  it("con identificador y pestañas válidas devuelve lo que el navegador necesita", () => {
    expect(sheetSourceFromEnv(ENV)).toEqual({
      id: "2PACX-abc",
      gids: { servicios: "0", productos: "123" },
      baseUrl: DEFAULT_BASE_URL,
      timeoutMs: 10_000,
    });
  });

  it("respeta el tiempo máximo y la base de pruebas", () => {
    const source = sheetSourceFromEnv({ ...ENV, CONTENT_FETCH_TIMEOUT_MS: "3000", CONTENT_SHEET_BASE_URL: "http://127.0.0.1:9/d/e" });

    expect(source?.timeoutMs).toBe(3000);
    expect(source?.baseUrl).toBe("http://127.0.0.1:9/d/e");
  });

  it.each([
    ["sin identificador", { CONTENT_SHEET_GIDS: "servicios:0" }],
    ["identificador vacío", { CONTENT_SHEET_ID: "  ", CONTENT_SHEET_GIDS: "servicios:0" }],
    ["sin pestañas", { CONTENT_SHEET_ID: "2PACX-abc" }],
    ["solo pestañas inválidas", { CONTENT_SHEET_ID: "2PACX-abc", CONTENT_SHEET_GIDS: "peluqueria:5,servicios:abc" }],
  ])("%s → no hay fuente", (_name, env) => {
    expect(sheetSourceFromEnv(env)).toBeNull();
  });
});

describe("fetchSheetTabs (BR-047)", () => {
  const source = { id: "2PACX-abc", gids: { servicios: "0", equipo: "9" }, baseUrl: DEFAULT_BASE_URL, timeoutMs: 1000 };

  it("descarga cada pestaña con su gid y devuelve lo que no pudo como problema", async () => {
    const fetchImpl = vi.fn(async (url: string | URL | Request) =>
      String(url).includes("gid=0") ? csvResponse("id,uno") : csvResponse("no", { status: 404 }),
    ) as unknown as typeof fetch;

    const { sheet, problems } = await fetchSheetTabs(source, fetchImpl);

    expect(sheet).toEqual({ servicios: "id,uno" });
    expect(problems).toEqual(["equipo: la hoja respondió HTTP 404"]);
  });
});
