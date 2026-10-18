import { describe, expect, it } from "vitest";
import { CUT, FLARE, REVEAL } from "./sceneTimeline";

// BR-062, BR-075 y BR-076: coreografía de SocialProof1. Con la sección fija en escritorio, todo se mide sobre el avance
// de ese recorrido fijo: 0 cuando se pega arriba, 1 cuando se suelta.
describe("cortes que revelan: tiempos (BR-062, HU-EXP-004 CA-14)", () => {
  it("CA-14: la foto y la tarjeta quedan reveladas antes de que termine el recorrido fijo", () => {
    expect(CUT.PHOTO[1]).toBeLessThan(1);
    expect(CUT.CARD[1]).toBeLessThan(1);
  });

  it("el corte empieza ya a la vista, no apenas asoma el borde", () => {
    expect(CUT.PHOTO[0]).toBeGreaterThan(0);
    expect(CUT.CARD[0]).toBeGreaterThan(0);
  });

  it("primero se corta la foto y después la tarjeta, desde el lado contrario", () => {
    expect(CUT.CARD[0]).toBeGreaterThan(CUT.PHOTO[0]);
    expect(CUT.CARD[1]).toBeGreaterThan(CUT.PHOTO[1]);
  });

  it("el marco se enciende cuando termina el corte de la foto, con un solo destello (CP-A11Y-005)", () => {
    const [start, peak, end] = CUT.FLASH;

    expect(start).toBeLessThanOrEqual(CUT.PHOTO[1]);
    expect(peak).toBeGreaterThanOrEqual(CUT.PHOTO[1]);
    expect(start < peak && peak < end).toBe(true);
  });
});

// BR-076 (HU-EXP-004 CA-27): el lens flare viaja con el borde de cada corte y se apaga justo después.
describe("lens flare: tiempos (BR-076, HU-EXP-004 CA-27)", () => {
  const cases: Array<["foto" | "tarjeta", number[], number[]]> = [
    ["foto", FLARE.PHOTO, CUT.PHOTO],
    ["tarjeta", FLARE.CARD, CUT.CARD],
  ];

  it.each(cases)("el flare de la %s aparece, brilla al máximo y se apaga, en ese orden", (_name, flare) => {
    const [start, peak, end] = flare;

    expect(start < peak && peak < end).toBe(true);
  });

  it.each(cases)("el flare de la %s arranca con su corte y se apaga poco después de que termina", (_name, flare, cut) => {
    expect(flare[0]).toBeCloseTo(cut[0], 5);
    expect(flare[2]).toBeGreaterThan(cut[1]);
    // Una luz que sigue encendida mucho después del corte no tendría de qué colgarse
    expect(flare[2] - cut[1]).toBeLessThanOrEqual(0.05);
  });

  it("brilla al máximo mientras el corte avanza, no antes ni después", () => {
    expect(FLARE.PHOTO[1]).toBeGreaterThan(CUT.PHOTO[0]);
    expect(FLARE.PHOTO[1]).toBeLessThan(CUT.PHOTO[1]);
    expect(FLARE.CARD[1]).toBeGreaterThan(CUT.CARD[0]);
    expect(FLARE.CARD[1]).toBeLessThan(CUT.CARD[1]);
  });

  it("el flare de la tarjeta viene después del de la foto", () => {
    expect(FLARE.CARD[0]).toBeGreaterThan(FLARE.PHOTO[0]);
    expect(FLARE.CARD[2]).toBeGreaterThan(FLARE.PHOTO[2]);
  });

  it("CP-A11Y-005: cada flare es un solo encendido y apagado, muy por debajo de 3 destellos por segundo", () => {
    for (const [, flare] of cases) expect(flare).toHaveLength(3);
  });
});

// BR-075 (HU-EXP-004 CA-26): después de los cortes, el subtítulo, la foto y el texto del testimonio se enfocan.
describe("revelado después de los cortes (BR-075, HU-EXP-004 CA-26)", () => {
  const cutsEnd = Math.max(CUT.PHOTO[1], CUT.CARD[1], CUT.FLASH[2], FLARE.PHOTO[2], FLARE.CARD[2]);

  it("el enfoque empieza cuando los cortes y el flare ya terminaron: todo se ve borroso mientras revelan", () => {
    expect(REVEAL.TITLE[0]).toBeGreaterThanOrEqual(cutsEnd);
  });

  it("primero se enfoca el subtítulo, luego la foto y por último el texto del testimonio", () => {
    expect(REVEAL.PHOTO[0]).toBeGreaterThan(REVEAL.TITLE[0]);
    expect(REVEAL.QUOTE[0]).toBeGreaterThan(REVEAL.PHOTO[0]);
    expect(REVEAL.PHOTO[1]).toBeGreaterThan(REVEAL.TITLE[1]);
    expect(REVEAL.QUOTE[1]).toBeGreaterThan(REVEAL.PHOTO[1]);
  });

  it("el texto del testimonio empieza a enfocarse cuando la foto ya terminó, no a la vez", () => {
    expect(REVEAL.QUOTE[0]).toBeGreaterThanOrEqual(REVEAL.PHOTO[1]);
  });

  it("todo queda nítido antes de soltar la sección: hay una pausa final", () => {
    expect(REVEAL.QUOTE[1]).toBeLessThan(1);
  });

  it("cada ventana tiene un comienzo y un fin dentro del recorrido", () => {
    for (const [from, to] of [REVEAL.TITLE, REVEAL.PHOTO, REVEAL.QUOTE]) {
      expect(from).toBeGreaterThanOrEqual(0);
      expect(to).toBeGreaterThan(from);
      expect(to).toBeLessThanOrEqual(1);
    }
  });

  it("el subrayado sin la sección fija (móvil) conserva el tramo de BR-062", () => {
    expect(CUT.UNDERLINE_FREE).toEqual([0.06, 0.26]);
  });
});
