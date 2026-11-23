import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FixedShape } from "./FixedShape";
import { fixedShape } from "./shapeGeometry";

vi.mock("framer-motion", async (importOriginal) => ({ ...(await importOriginal<typeof import("framer-motion")>()), useReducedMotion: () => true }));

// BR-104 (HU-SUC-002 CA-03, RNF-A11Y-003): con «reducir movimiento» la figura cambia de golpe, sin transformarse.
describe("FixedShape con reducir movimiento", () => {
  const hexagon = fixedShape(100, 100, [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]]);
  const square = fixedShape(100, 100, [[0, 0], [100, 0], [100, 50], [100, 100], [0, 100], [0, 50]]);

  it("al cambiar de forma muestra la nueva de inmediato", () => {
    const { container, rerender } = render(<FixedShape shape={hexagon} />);

    rerender(<FixedShape shape={square} />);

    expect(container.querySelector("polygon")?.getAttribute("points")).toBe(square.points);
  });
});
