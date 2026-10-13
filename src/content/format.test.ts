import { describe, expect, it } from "vitest";
import { formatClp, parseClp } from "./format";

describe("formatClp / parseClp (HU-CNT-001 RN-01)", () => {
  it.each([
    [500, "$500"],
    [4000, "$4.000"],
    [15990, "$15.990"],
    [125000, "$125.000"],
    [1000000, "$1.000.000"],
  ])("%i ↔ %s", (amount, text) => {
    expect(formatClp(amount)).toBe(text);
    expect(parseClp(text)).toBe(amount);
  });

  it("redondea los decimales: el peso chileno no tiene centavos", () => {
    expect(formatClp(4000.4)).toBe("$4.000");
  });

  it.each(["", "abc", "$", "12,5", "-5"])("parseClp(%j) no es un monto", (text) => {
    expect(parseClp(text)).toBeNaN();
  });
});
