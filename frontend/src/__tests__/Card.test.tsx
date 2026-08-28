/**
 * Unit tests for the Card UI component.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Card from "../components/ui/Card";

describe("Card", () => {
  it("renders children inside the card", () => {
    render(<Card>Card content</Card>);
    expect(screen.getByText("Card content")).toBeInTheDocument();
  });

  it("renders as a div by default", () => {
    const { container } = render(<Card>Default</Card>);
    const root = container.firstChild as HTMLElement;
    expect(root.tagName).toBe("DIV");
  });

  it("applies a base background and border style", () => {
    const { container } = render(<Card>Styled</Card>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toMatch(/bg|bg-/);
  });

  it("merges custom className with default styles", () => {
    const { container } = render(<Card className="custom-class">Merged</Card>);
    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("custom-class");
  });

  it("forwards additional HTML attributes", () => {
    render(
      <Card data-testid="my-card" role="region" aria-label="summary">
        Accessible
      </Card>
    );
    const card = screen.getByTestId("my-card");
    expect(card).toHaveAttribute("role", "region");
    expect(card).toHaveAttribute("aria-label", "summary");
  });

  it("renders nested elements correctly", () => {
    render(
      <Card>
        <h3>Title</h3>
        <p>Description</p>
      </Card>
    );
    expect(screen.getByRole("heading", { name: "Title" })).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
  });
});
