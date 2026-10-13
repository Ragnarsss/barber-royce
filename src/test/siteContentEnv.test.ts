// @vitest-environment node
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import process from "node:process";
import type { ResolvedConfig } from "vite";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { siteContentPlugin } from "../../vite-plugins/siteContentPlugin";

/**
 * De dónde lee el plugin las variables de la hoja (BR-046): del sistema y, en la máquina del desarrollador,
 * de `.env`. Se prueba con una carpeta temporal para no tocar el `.env` real de nadie.
 */
describe("variables de la hoja desde .env (BR-046)", () => {
  let root: string;
  let requested: string[];
  const logger = { info: vi.fn(), warn: vi.fn() };
  const KEYS = ["CONTENT_SHEET_ID", "CONTENT_SHEET_GIDS"];
  const saved: Record<string, string | undefined> = {};

  const run = async (command: "build" | "serve") => {
    const fetchImpl = vi.fn(async (url: string | URL | Request) => {
      requested.push(String(url));
      return new Response("", { status: 404 });
    }) as unknown as typeof fetch;
    const plugin = siteContentPlugin({ fetchImpl });
    const config = { root, mode: "production", command, logger, resolve: { alias: [] } } as unknown as ResolvedConfig;
    (plugin.configResolved as (config: ResolvedConfig) => void)(config);
    await (plugin.buildStart as () => Promise<void>)();
  };

  beforeEach(() => {
    root = mkdtempSync(join(tmpdir(), "barber-royce-env-"));
    requested = [];
    vi.stubEnv("VITEST", "");
    for (const key of KEYS) {
      saved[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    for (const key of KEYS) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
    rmSync(root, { recursive: true, force: true });
  });

  it("lee CONTENT_SHEET_ID y CONTENT_SHEET_GIDS del archivo .env", async () => {
    writeFileSync(join(root, ".env"), "CONTENT_SHEET_ID=2PACX-del-archivo\nCONTENT_SHEET_GIDS=servicios:7\n");

    await run("build");

    expect(requested.length).toBeGreaterThan(0);
    expect(requested[0]).toContain("2PACX-del-archivo");
    expect(requested[0]).toContain("gid=7");
  });

  it("una variable del sistema gana sobre la del archivo", async () => {
    writeFileSync(join(root, ".env"), "CONTENT_SHEET_ID=2PACX-del-archivo\nCONTENT_SHEET_GIDS=servicios:7\n");
    process.env.CONTENT_SHEET_ID = "2PACX-del-sistema";

    await run("build");

    expect(requested[0]).toContain("2PACX-del-sistema");
    expect(requested[0]).not.toContain("2PACX-del-archivo");
  });

  it("también lee la hoja al arrancar el servidor de desarrollo", async () => {
    writeFileSync(join(root, ".env"), "CONTENT_SHEET_ID=2PACX-del-archivo\nCONTENT_SHEET_GIDS=servicios:7\n");

    await run("serve");

    expect(requested.length).toBeGreaterThan(0);
  });

  it("sin .env ni variables no hace ninguna petición", async () => {
    await run("build");

    expect(requested).toEqual([]);
  });

  it("en los tests (VITEST) no lee .env ni sale a la red al servir", async () => {
    writeFileSync(join(root, ".env"), "CONTENT_SHEET_ID=2PACX-del-archivo\nCONTENT_SHEET_GIDS=servicios:7\n");
    vi.stubEnv("VITEST", "true");

    await run("serve");

    expect(requested).toEqual([]);
  });
});
