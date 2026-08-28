import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Skeleton from "../components/ui/Skeleton";

describe("Skeleton", () => {
  it("renders a div with default classes", () => {
    render(<Skeleton data-testid="skel" />);
    const el = screen.getByTestId("skel");
    expect(el.tagName).toBe("DIV");
    expect(el).toHaveClass("h-4", "w-full", "rounded-md", "animate-pulse");
  });

  it("applies custom height and width", () => {
    render(<Skeleton h="h-12" w="w-32" data-testid="skel" />);
    const el = screen.getByTestId("skel");
    expect(el).toHaveClass("h-12", "w-32");
  });

  it("uses shimmer variant when requested", () => {
    render(<Skeleton variant="shimmer" data-testid="skel" />);
    const el = screen.getByTestId("skel");
    expect(el).toHaveClass("animate-shimmer");
    expect(el).not.toHaveClass("animate-pulse");
  });

  it("applies different rounded sizes", () => {
    const { rerender } = render(<Skeleton rounded="lg" data-testid="skel" />);
    expect(screen.getByTestId("skel")).toHaveClass("rounded-lg");

    rerender(<Skeleton rounded="2xl" data-testid="skel" />);
    expect(screen.getByTestId("skel")).toHaveClass("rounded-2xl");

    rerender(<Skeleton rounded="full" data-testid="skel" />);
    expect(screen.getByTestId("skel")).toHaveClass("rounded-full");
  });

  it("has aria-hidden for screen readers", () => {
    render(<Skeleton data-testid="skel" />);
    expect(screen.getByTestId("skel")).toHaveAttribute("aria-hidden", "true");
  });

  it("merges custom className with internal classes", () => {
    render(<Skeleton className="my-custom-class" data-testid="skel" />);
    const el = screen.getByTestId("skel");
    expect(el).toHaveClass("my-custom-class");
    expect(el).toHaveClass("animate-pulse");
  });

  it("forwards additional HTML attributes", () => {
    render(<Skeleton data-testid="skel" data-custom="value" />);
    expect(screen.getByTestId("skel")).toHaveAttribute("data-custom", "value");
  });
});
