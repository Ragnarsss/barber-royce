import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContentContext } from "@/content/ContentContext";
import { bakedContent } from "@/content/siteContent";
import { CONSENT_STORAGE_KEY, resetConsentCache, setConsent } from "@/analytics/consent";
import { LenisContext } from "@/contexts/lenisContextValue";
import { renderWithProviders } from "@/test/renderWithProviders";
import { PromoGate } from "./PromoGate";
import { PROMO_STORAGE_KEY } from "./promoState";

// La espera real es de 5 s; aquí se acorta para no frenar la suite. Lo que se prueba es el orden, no el número.
vi.mock("./promoState", async (importOriginal) => ({ ...(await importOriginal<typeof import("./promoState")>()), PROMO_DELAY_MS: 20 }));

const neon = vi.hoisted(() => ({ done: true }));
// En el build la existencia del aviso depende del ID de medición (constante de compilación): aquí se simula con un interruptor.
const consentNotice = vi.hoisted(() => ({ exists: false }));
vi.mock("./useConsentPending", async () => {
  const { useConsent } = await import("@/analytics/consent");
  return {
    useConsentPending: () => {
      const consent = useConsent();
      return consentNotice.exists && consent === "unset";
    },
  };
});
vi.mock("@/loader/neonLoader", () => ({
  useNeonLoaderDone: () => neon.done,
}));

const renderGate = (texts: Record<string, string> = {}) =>
  renderWithProviders(
    <LenisContext value={null}>
      <ContentContext value={{ ...bakedContent, texts }}>
        <PromoGate />
      </ContentContext>
    </LenisContext>,
  );

const dialog = () => screen.queryByRole("dialog");
const appears = () => screen.findByRole("dialog", {}, { timeout: 2000 });
const wait = (ms: number) => act(() => new Promise<void>((resolve) => setTimeout(resolve, ms)));

describe("PromoGate: cuándo sale el modal de bienvenida (BR-100, HU-RES-003)", () => {
  beforeEach(() => {
    window.localStorage.clear();
    resetConsentCache();
    neon.done = true;
    consentNotice.exists = false;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("CA-01: en una primera visita, con la promoción encendida por defecto, aparece tras la espera", async () => {
    renderGate();

    expect(dialog()).not.toBeInTheDocument();
    expect(await appears()).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /mascarilla facial/i })).toBeInTheDocument();
  });

  it("CA-01: mientras el letrero de neón sigue visible no aparece", async () => {
    neon.done = false;
    renderGate();

    await wait(80);

    expect(dialog()).not.toBeInTheDocument();
  });

  it("CA-02: con aviso de privacidad pendiente espera, y al responderlo aparece", async () => {
    consentNotice.exists = true;
    renderGate();

    await wait(80);
    expect(dialog()).not.toBeInTheDocument();

    act(() => setConsent("denied"));

    expect(await appears()).toBeInTheDocument();
  });

  it("CA-02: sin ID de medición no hay aviso, así que no espera nada", async () => {
    renderGate();

    expect(await appears()).toBeInTheDocument();
  });

  it("CA-03: al cerrarlo se anota y no vuelve a salir al montar de nuevo", async () => {
    const user = userEvent.setup();
    const { unmount } = renderGate();
    await appears();

    await user.click(screen.getByRole("button", { name: /cerrar la promoción/i }));

    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
    expect(window.localStorage.getItem(PROMO_STORAGE_KEY)).toBe("1");

    unmount();
    renderGate();
    await wait(80);
    expect(dialog()).not.toBeInTheDocument();
  });

  it("CA-03: Escape lo cierra", async () => {
    const user = userEvent.setup();
    renderGate();
    await appears();

    await user.keyboard("{Escape}");

    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
  });

  it("CA-03: con el almacenamiento bloqueado no falla y se puede cerrar", async () => {
    const user = userEvent.setup();
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("bloqueado");
    });
    renderGate();
    await appears();

    await user.click(screen.getByRole("button", { name: /cerrar la promoción/i }));

    await waitFor(() => expect(dialog()).not.toBeInTheDocument());
  });

  it.each(["NO", "apagada"])("CA-04: con promo.activa en «%s» no aparece", async (value) => {
    renderGate({ "promo.activa": value });

    await wait(80);

    expect(dialog()).not.toBeInTheDocument();
  });

  it("CA-04: una vez que el visitante respondió el aviso antes, la clave consentimiento no cambia nada", async () => {
    window.localStorage.setItem(CONSENT_STORAGE_KEY, "granted");
    consentNotice.exists = true;
    renderGate();

    expect(await appears()).toBeInTheDocument();
  });
});
