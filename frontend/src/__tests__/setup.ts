import "@testing-library/jest-dom/vitest";

// Mock global objects that don't exist in jsdom
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  (globalThis as unknown as { IntersectionObserver: typeof MockIntersectionObserver }).IntersectionObserver =
    MockIntersectionObserver;
}

// ResizeObserver is used by some shadcn components
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  (globalThis as unknown as { ResizeObserver: typeof MockResizeObserver }).ResizeObserver =
    MockResizeObserver;
}

// matchMedia is used by Tailwind v4 and Radix
if (typeof window !== "undefined" && !window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}
