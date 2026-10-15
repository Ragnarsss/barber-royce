import { describe, expect, it } from "vitest";
import { experienceHighlight } from "./experience";

// BR-063: en la ficha, la experiencia se muestra como un dato grande («15» + «años de experiencia»).
describe("experienceHighlight (BR-063)", () => {
  it("separa el número del resto del texto", () => {
    expect(experienceHighlight("15 años de experiencia")).toEqual({ value: "15", label: "años de experiencia" });
  });

  it("funciona con otro número y otra redacción", () => {
    expect(experienceHighlight("8 años en el oficio")).toEqual({ value: "8", label: "años en el oficio" });
  });

  it("acepta un «+» delante del número y lo conserva", () => {
    expect(experienceHighlight("+20 años")).toEqual({ value: "+20", label: "años" });
  });

  it("sin número al inicio no hay dato grande: la ficha muestra el texto tal cual", () => {
    expect(experienceHighlight("Desde 2010")).toBeNull();
    expect(experienceHighlight("")).toBeNull();
  });
});
