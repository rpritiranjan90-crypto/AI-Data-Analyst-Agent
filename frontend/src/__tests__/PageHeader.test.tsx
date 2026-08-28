/**
 * Unit tests for the PageHeader UI component.
 */
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import PageHeader from "../components/ui/PageHeader";

describe("PageHeader", () => {
  it("renders the title as a level-1 heading", () => {
    render(<PageHeader title="Dashboard" />);

    const heading = screen.getByRole("heading", { name: "Dashboard" });
    expect(heading).toBeInTheDocument();
    expect(heading.tagName).toBe("H1");
  });

  it("uses default breadcrumb when not provided", () => {
    render(<PageHeader title="Dashboard" />);

    expect(screen.getByText("Platform / Workspace")).toBeInTheDocument();
  });

  it("uses custom breadcrumb when provided", () => {
    render(<PageHeader title="Cleaning" breadcrumb="Data / Clean" />);

    expect(screen.getByText("Data / Clean")).toBeInTheDocument();
  });

  it("does not render subtitle when not provided", () => {
    const { container } = render(<PageHeader title="Dashboard" />);

    // No <p> tag in the header area
    const paragraphs = container.querySelectorAll("p");
    expect(paragraphs).toHaveLength(0);
  });

  it("renders subtitle when provided", () => {
    render(
      <PageHeader
        title="Reports"
        subtitle="Generate comprehensive PDF and PPTX reports from your data."
      />
    );

    expect(
      screen.getByText("Generate comprehensive PDF and PPTX reports from your data.")
    ).toBeInTheDocument();
  });

  it("does not render badge area when badge prop is not provided", () => {
    const { container } = render(<PageHeader title="Dashboard" />);

    // No badge pill span should exist
    const badgeSpans = container.querySelectorAll("span.bg-cyan-50");
    expect(badgeSpans).toHaveLength(0);
  });

  it("renders badge with pulse dot when provided", () => {
    const { container } = render(<PageHeader title="Dashboard" badge="LIVE" />);

    expect(screen.getByText("LIVE")).toBeInTheDocument();
    const pulseDot = container.querySelector("span.animate-pulse");
    expect(pulseDot).toBeInTheDocument();
  });

  it("renders action node when provided", () => {
    render(
      <PageHeader
        title="Upload"
        action={<button type="button">Upload Now</button>}
      />
    );

    const button = screen.getByRole("button", { name: "Upload Now" });
    expect(button).toBeInTheDocument();
  });

  it("does not render action area when not provided", () => {
    const { container } = render(<PageHeader title="No Actions" />);

    // No shrink-0 flex container (used for action slot)
    const actionContainers = container.querySelectorAll("div.shrink-0");
    expect(actionContainers).toHaveLength(0);
  });

  it("applies border and spacing classes for visual separation", () => {
    const { container } = render(<PageHeader title="Dashboard" />);

    const root = container.firstChild as HTMLElement;
    expect(root.className).toContain("border-b");
    expect(root.className).toContain("pb-5");
    expect(root.className).toContain("mb-6");
  });

  it("combines all props correctly", () => {
    render(
      <PageHeader
        title="ML"
        subtitle="Train and evaluate models"
        badge="v2.0"
        breadcrumb="Intelligence / ML"
        action={<a href="#">View Docs</a>}
      />
    );

    expect(screen.getByText("ML")).toBeInTheDocument();
    expect(screen.getByText("Train and evaluate models")).toBeInTheDocument();
    expect(screen.getByText("v2.0")).toBeInTheDocument();
    expect(screen.getByText("Intelligence / ML")).toBeInTheDocument();
    expect(screen.getByText("View Docs")).toBeInTheDocument();
  });
});
