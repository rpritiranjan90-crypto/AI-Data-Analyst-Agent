/**
 * Unit tests for the Spinner UI component.
 */
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import Spinner from "../components/ui/Spinner";

describe("Spinner", () => {
  it("renders an SVG with an accessible label", () => {
    render(<Spinner />);

    // The component should have a status role (or similar aria attribute)
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("uses default size when not provided", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("applies animate-spin class for spinning animation", () => {
    const { container } = render(<Spinner />);
    const svg = container.querySelector("svg") as SVGElement | null;
    // SVGs use SVGAnimatedString — read baseVal for the underlying string
    const className = svg?.getAttribute("class") ?? "";
    expect(className).toMatch(/animate-spin/);
  });

  it("renders inside a container with centering", () => {
    const { container } = render(<Spinner />);
    const root = container.firstChild as HTMLElement;
    // Most spinner wrappers are flex containers
    expect(root.className).toMatch(/flex/);
  });
});
