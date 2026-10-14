import { describe, expect, it } from "vitest";
import { BOLT, LASER_CUT, boltWindow } from "./laserCut";

// BR-062: coreografía del corte láser de SocialProof1. Cada corte se mide sobre el scroll de su elemento: 0 cuando
// asoma por abajo, 1 cuando llega al centro de la pantalla.
describe("corte láser: tiempos del revelado (BR-062, HU-EXP-004 CA-14)", () => {
  it("CA-14: la foto y la tarjeta quedan reveladas antes de llegar al centro de la pantalla", () => {
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
