/**
 * Unit tests for the Button UI component.
 */
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Button from "../components/ui/Button";

describe("Button", () => {
  it("renders children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("renders as <button> by default", () => {
    render(<Button>Default</Button>);
    const button = screen.getByRole("button", { name: "Default" });
    expect(button.tagName).toBe("BUTTON");
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Click</Button>);

    const button = screen.getByRole("button", { name: "Click" });
    await user.click(button);

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <Button onClick={onClick} disabled>
        Disabled
      </Button>
    );

    const button = screen.getByRole("button", { name: "Disabled" });
    expect(button).toBeDisabled();

    await user.click(button);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("forwards extra HTML attributes to the button element", () => {
    render(
      <Button type="submit" aria-label="submit-form" data-testid="my-button">
        Submit
      </Button>
    );

    const button = screen.getByTestId("my-button");
    expect(button).toHaveAttribute("type", "submit");
    expect(button).toHaveAttribute("aria-label", "submit-form");
  });

  it("supports type='submit' for form submission", () => {
    render(
      <form>
        <Button type="submit">Save</Button>
      </form>
    );

    const button = screen.getByRole("button", { name: "Save" });
    expect(button).toHaveAttribute("type", "submit");
  });
});
