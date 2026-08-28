/**
 * Unit tests for the StatCard UI component.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Database } from "lucide-react";
import StatCard from "../components/ui/StatCard";

describe("StatCard", () => {
  it("renders the title, value, and subtitle", () => {
    render(
      <StatCard
        title="Total Datasets"
        value="42"
        icon={<Database />}
        subtitle="+5 this week"
      />
    );

    expect(screen.getByText("Total Datasets")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
    expect(screen.getByText("+5 this week")).toBeInTheDocument();
  });

  it("renders the icon element", () => {
    const { container } = render(
      <StatCard
        title="Rows"
        value="1000"
        icon={<Database data-testid="my-icon" />}
      />
    );

    const icon = container.querySelector('[data-testid="my-icon"]');
    expect(icon).toBeInTheDocument();
  });

  it("renders with string value", () => {
    render(
      <StatCard
        title="Status"
        value="OK"
        icon={<Database />}
      />
    );
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("renders with numeric value", () => {
    render(
      <StatCard
        title="Count"
        value={99}
        icon={<Database />}
      />
    );
    expect(screen.getByText("99")).toBeInTheDocument();
  });

  it("applies a card-style container via Card wrapper", () => {
    const { container } = render(
      <StatCard
        title="Status"
        value="OK"
        icon={<Database />}
      />
    );

    const root = container.firstChild as HTMLElement;
    // Wrapped in Card which applies bg-white/rounded-2xl/border
    expect(root.className).toMatch(/rounded|bg|white|slate/);
  });

  it("does not render subtitle when not provided", () => {
    const { container } = render(
      <StatCard
        title="No Subtitle"
        value="0"
        icon={<Database />}
      />
    );

    expect(screen.getByText("No Subtitle")).toBeInTheDocument();
    expect(screen.getByText("0")).toBeInTheDocument();
    // No extra <p> elements should exist
    const paragraphs = container.querySelectorAll("p.text-sm");
    expect(paragraphs).toHaveLength(0);
  });

  it("renders progress bar when progress is provided", () => {
    const { container } = render(
      <StatCard
        title="Accuracy"
        value="85%"
        icon={<Database />}
        progress={85}
      />
    );

    // ProgressBar renders a <div> with role="progressbar"
    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).toBeInTheDocument();
  });

  it("does not render progress when undefined", () => {
    const { container } = render(
      <StatCard
        title="Simple"
        value="99"
        icon={<Database />}
      />
    );

    const progressbar = container.querySelector('[role="progressbar"]');
    expect(progressbar).not.toBeInTheDocument();
  });

  it("renders badge when provided", () => {
    render(
      <StatCard
        title="Model"
        value="v2.0"
        icon={<Database />}
        badge={<span data-testid="badge">NEW</span>}
      />
    );

    expect(screen.getByTestId("badge")).toBeInTheDocument();
  });

  it("supports large numeric values", () => {
    render(
      <StatCard
        title="Bytes Processed"
        value="1,234,567"
        icon={<Database />}
      />
    );

    expect(screen.getByText("1,234,567")).toBeInTheDocument();
  });

  it("merges custom className into Card wrapper", () => {
    const { container } = render(
      <StatCard
        title="Custom"
        value="0"
        icon={<Database />}
        className="my-custom-class"
      />
    );

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("my-custom-class");
  });
});
