import { render, waitFor } from "@testing-library/react";
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

// BR-104 (HU-SUC-002 CA-03): al cambiar de sucursal la figura se transforma en la otra en vez de saltar.
describe("FixedShape: cambio de forma", () => {
  const hexagon = fixedShape(100, 100, [[25, 0], [75, 0], [100, 50], [75, 100], [25, 100], [0, 50]]);
  const square = fixedShape(100, 100, [[0, 0], [100, 0], [100, 50], [100, 100], [0, 100], [0, 50]]);
  const triangle = fixedShape(100, 100, [[50, 0], [100, 100], [0, 100]]);

  it("arranca desde los puntos anteriores, no salta a los nuevos, y termina exactamente en los nuevos", async () => {
    const { container, rerender } = render(<FixedShape shape={hexagon} />);

    rerender(<FixedShape shape={square} />);
    const polygon = container.querySelector("polygon")!;
    expect(polygon.getAttribute("points")).toBe(hexagon.points);

    await waitFor(() => expect(polygon.getAttribute("points")).toBe(square.points), { timeout: 3000 });
  });

  it("transforma también el filo de luz que va dentro, que comparte los puntos de la figura", async () => {
    const withGlow = (shape: typeof hexagon) => (
      <FixedShape shape={shape}>
        <polygon className="glow" points={shape.points} />
      </FixedShape>
    );
    const { container, rerender } = render(withGlow(hexagon));

    rerender(withGlow(square));
    const [main, glow] = [...container.querySelectorAll("polygon")];
    expect([main.getAttribute("points"), glow.getAttribute("points")]).toEqual([hexagon.points, hexagon.points]);

    await waitFor(() => expect([main.getAttribute("points"), glow.getAttribute("points")]).toEqual([square.points, square.points]), { timeout: 3000 });
  });

  it("si la forma no cambia, no toca los puntos", () => {
    const { container, rerender } = render(<FixedShape shape={hexagon} />);

    rerender(<FixedShape shape={{ ...hexagon }} />);

    expect(container.querySelector("polygon")?.getAttribute("points")).toBe(hexagon.points);
  });

  it("con distinta cantidad de puntos cambia de golpe: framer no podría interpolarlos", () => {
    const { container, rerender } = render(<FixedShape shape={hexagon} />);

    rerender(<FixedShape shape={triangle} />);

    expect(container.querySelector("polygon")?.getAttribute("points")).toBe(triangle.points);
  });
});
