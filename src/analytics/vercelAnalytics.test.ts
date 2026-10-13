import { beforeEach, describe, expect, it, vi } from "vitest";

const inject = vi.hoisted(() => vi.fn());
vi.mock("@vercel/analytics", () => ({ inject }));

import { installVercelAnalytics } from "./vercelAnalytics";

function fakeWindow(readyState: DocumentReadyState) {
  const target = new EventTarget();
  return Object.assign(target, { document: { readyState } }) as unknown as Window;
}

const flush = () => new Promise((resolve) => setTimeout(resolve, 0));

describe("installVercelAnalytics (BR-036, CP-MED-001, CP-PERF-007)", () => {
  beforeEach(() => inject.mockClear());

  it("no carga nada mientras la página no terminó de cargar", async () => {
    installVercelAnalytics(fakeWindow("loading"));
    await flush();

    expect(inject).not.toHaveBeenCalled();
  });

  it("carga Analytics una sola vez, cuando ocurre el evento load", async () => {
    const win = fakeWindow("loading");
    installVercelAnalytics(win);

    win.dispatchEvent(new Event("load"));
    win.dispatchEvent(new Event("load"));
    await flush();

    expect(inject).toHaveBeenCalledTimes(1);
  });

  it("si la página ya cargó, lo carga de inmediato", async () => {
    installVercelAnalytics(fakeWindow("complete"));
    await flush();

    expect(inject).toHaveBeenCalledTimes(1);
  });
});
