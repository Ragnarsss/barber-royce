import { render } from "@testing-library/react";
import { motion, useMotionValue } from "framer-motion";
import { describe, expect, it } from "vitest";
import { FixedShape } from "./FixedShape";
import { fixedShape } from "./shapeGeometry";

const shape = fixedShape(100, 100, [[50, 0], [100, 50], [50, 100], [0, 50]]);

// BR-096 (HU-EXP-004 CA-38): el polígono de una figura puede llevar un borde que se dibuja.
describe("FixedShape", () => {
  it("sin borde animado, el polígono es el de siempre y la figura es decorativa", () => {
    const { container } = render(<FixedShape shape={shape} />);

    const svg = container.querySelector("svg");
    expect(svg?.getAttribute("aria-hidden")).toBe("true");
    expect(svg?.getAttribute("viewBox")).toBe("0 0 100 100");
    expect(container.querySelector("polygon")?.getAttribute("points")).toBe(shape.points);
    expect(container.querySelector("polygon")?.getAttribute("pathLength")).toBeNull();
  });

  it("CA-38: con `edge`, el mismo polígono toma el trazo que se dibuja", () => {
    function Drawn() {
      const progress = useMotionValue(0.5);
      return <FixedShape shape={shape} edge={{ style: { pathLength: progress } }} />;
    }
    const { container } = render(<Drawn />);

    const polygons = container.querySelectorAll("polygon");
    expect(polygons).toHaveLength(1);
    expect(polygons[0].getAttribute("points")).toBe(shape.points);
    // framer normaliza el largo del trazo a 1 para poder dibujarlo de 0 a 1
    expect(polygons[0].getAttribute("pathLength")).toBe("1");
  });

  it("los hijos se dibujan después del polígono, como siempre", () => {
    const { container } = render(
      <FixedShape shape={shape}>
        <motion.line x1="0" y1="0" x2="1" y2="1" />
      </FixedShape>,
    );
    expect(container.querySelector("svg")?.lastElementChild?.tagName.toLowerCase()).toBe("line");
  });
});
