import { describe, expect, it } from "vitest";
import { BOLT, LASER_CUT, REVEAL, boltWindow } from "./laserCut";

// BR-062 y BR-075: coreografía de SocialProof1. Con la sección fija en escritorio, todo se mide sobre el avance de ese
// recorrido fijo: 0 cuando se pega arriba, 1 cuando se suelta.
describe("corte láser: tiempos del revelado (BR-062, HU-EXP-004 CA-14)", () => {
  it("CA-14: la foto y la tarjeta quedan reveladas antes de que termine el recorrido fijo", () => {
    expect(LASER_CUT.PHOTO[1]).toBeLessThan(1);
    expect(LASER_CUT.CARD[1]).toBeLessThan(1);
  });

  it("el corte empieza ya a la vista, no apenas asoma el borde", () => {
    expect(LASER_CUT.PHOTO[0]).toBeGreaterThan(0);
    expect(LASER_CUT.CARD[0]).toBeGreaterThan(0);
  });

  it("primero se corta la foto y después la tarjeta, desde el lado contrario", () => {
    expect(LASER_CUT.CARD[0]).toBeGreaterThan(LASER_CUT.PHOTO[0]);
    expect(LASER_CUT.CARD[1]).toBeGreaterThan(LASER_CUT.PHOTO[1]);
  });

  it("el marco se enciende cuando termina el corte de la foto, con un solo destello (CP-A11Y-005)", () => {
    const [start, peak, end] = LASER_CUT.FLASH;

    expect(start).toBeLessThanOrEqual(LASER_CUT.PHOTO[1]);
    expect(peak).toBeGreaterThanOrEqual(LASER_CUT.PHOTO[1]);
    expect(start < peak && peak < end).toBe(true);
  });
});

// BR-075 (HU-EXP-004 CA-26): después del láser, el título, la foto y el texto del testimonio se enfocan, uno tras otro.
describe("revelado después del láser (BR-075, HU-EXP-004 CA-26)", () => {
  const laserEnd = Math.max(LASER_CUT.PHOTO[1], LASER_CUT.CARD[1], LASER_CUT.FLASH[2], boltWindow(BOLT.TRACKS - 1)[1]);

  it("el enfoque empieza cuando el láser ya terminó: todo se ve borroso mientras corta", () => {
    expect(REVEAL.TITLE[0]).toBeGreaterThanOrEqual(laserEnd);
  });

  it("primero se enfoca el título, luego la foto y por último el texto del testimonio", () => {
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
    expect(LASER_CUT.UNDERLINE_FREE).toEqual([0.06, 0.26]);
  });
});

describe("boltWindow: cada haz viaja en su propia ventana de scroll (BR-062)", () => {
  it("el primer haz arranca al entrar la sección", () => {
    expect(boltWindow(0)).toEqual([0, BOLT.WINDOW]);
  });

  it("los siguientes arrancan desfasados, para que no viajen juntos", () => {
    expect(boltWindow(2)).toEqual([2 * BOLT.STAGGER, 2 * BOLT.STAGGER + BOLT.WINDOW]);
  });

  it("todas las ventanas caben en el recorrido de la sección", () => {
    for (let i = 0; i < BOLT.TRACKS; i++) {
      const [start, end] = boltWindow(i);
      expect(start).toBeGreaterThanOrEqual(0);
      expect(end).toBeLessThanOrEqual(1);
    }
  });
});
