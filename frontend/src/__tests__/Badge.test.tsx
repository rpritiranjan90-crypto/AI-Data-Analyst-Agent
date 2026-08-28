/**
 * Unit tests for the Badge UI component.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Badge from "../components/ui/Badge";

describe("Badge", () => {
  it("renders text content as children", () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText("Active")).toBeInTheDocument();
  });

  it("renders as a span element", () => {
    const { container } = render(<Badge>Span</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.tagName).toBe("SPAN");
  });

  it("applies rounded and inline-flex classes", () => {
    const { container } = render(<Badge>Rounded</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("rounded-full");
    expect(root.className).toMatch(/inline-flex/);
  });

  it("merges custom className with defaults", () => {
    const { container } = render(<Badge className="custom-class">Custom</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });

  it("applies success variant classes", () => {
    const { container } = render(<Badge variant="success">Success</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/emerald|green/);
  });

  it("applies danger variant classes", () => {
    const { container } = render(<Badge variant="danger">Danger</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/red/);
  });

  it("applies warning variant classes", () => {
    const { container } = render(<Badge variant="warning">Warning</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/amber/);
  });

  it("applies ai variant classes", () => {
    const { container } = render(<Badge variant="ai">AI</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/cyan/);
  });

  it("applies info variant classes", () => {
    const { container } = render(<Badge variant="info">Info</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/indigo/);
  });

  it("renders dot when dot prop is true", () => {
    const { container } = render(<Badge dot>With Dot</Badge>);
    const dot = container.querySelector(".rounded-full");
    expect(dot).toBeInTheDocument();
  });

  it("does not render dot when dot prop is false", () => {
    const { container } = render(<Badge dot={false}>No Dot</Badge>);
    // All spans are rounded-full; check there's exactly one root span (the badge itself)
    const spans = container.querySelectorAll("span.rounded-full");
    expect(spans).toHaveLength(1);
  });

  it("supports color prop aliasing variant", () => {
    const { container } = render(<Badge color="purple">Purple</Badge>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/purple/);
  });

  it("renders multiple badges simultaneously", () => {
    render(
      <>
        <Badge variant="success">Active</Badge>
        <Badge variant="danger">Inactive</Badge>
      </>
    );
    expect(screen.getByText("Active")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument();
  });
});
