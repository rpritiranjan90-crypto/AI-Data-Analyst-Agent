/**
 * Unit tests for the EmptyState UI component.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Database } from "lucide-react";
import EmptyState from "../components/ui/EmptyState";

describe("EmptyState", () => {
  it("renders the title and description", () => {
    render(
      <EmptyState
        icon={Database}
        title="No datasets yet"
        description="Upload a CSV file to get started with analysis."
      />
    );

    expect(screen.getByText("No datasets yet")).toBeInTheDocument();
    expect(
      screen.getByText("Upload a CSV file to get started with analysis.")
    ).toBeInTheDocument();
  });

  it("renders a Lucide icon component as a SVG", () => {
    const { container } = render(
      <EmptyState
        icon={Database}
        title="No data"
        description="Nothing here"
      />
    );

    // Lucide icons render as <svg> elements
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders custom ReactNode icon when not a Lucide component", () => {
    const { container } = render(
      <EmptyState
        icon={<span data-testid="custom-icon">★</span>}
        title="Custom icon"
        description="Custom icon description"
      />
    );

    expect(screen.getByTestId("custom-icon")).toBeInTheDocument();
    // Should render the custom node, not a fallback SVG
    expect(container.querySelector('[data-testid="custom-icon"]')).toBeInTheDocument();
  });

  it("does not render action area when no action is provided", () => {
    const { container } = render(
      <EmptyState
        icon={Database}
        title="No data"
        description="Nothing here"
      />
    );

    // The component renders only the icon+title+description div
    expect(container.querySelectorAll("div").length).toBeGreaterThan(0);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders the action node when provided", () => {
    render(
      <EmptyState
        icon={Database}
        title="No data"
        description="Nothing here"
        action={<button type="button">Upload CSV</button>}
      />
    );

    const button = screen.getByRole("button", { name: "Upload CSV" });
    expect(button).toBeInTheDocument();
  });

  it("applies a layout container with flex centering classes", () => {
    const { container } = render(
      <EmptyState
        icon={Database}
        title="Title"
        description="Description"
      />
    );

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("flex");
    expect(root.className).toContain("items-center");
    expect(root.className).toContain("justify-center");
    expect(root.className).toContain("py-16");
    expect(root.className).toContain("text-center");
  });
});
