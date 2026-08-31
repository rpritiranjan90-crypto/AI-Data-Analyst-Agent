/**
 * Unit tests for pinboardStore — pin/unpin/clear, persistence cap, ordering.
 */
import { describe, it, expect, beforeEach } from "vitest";
import { usePinboardStore, type PinnedItem } from "../store/pinboardStore";

const metricItem: Omit<PinnedItem, "id" | "timestamp"> = {
  title: "Revenue Q1",
  type: "metric",
  content: { metric_name: "revenue", value: 12345, unit: "$", trend: "up", delta_pct: 12.5 },
};

const chartItem: Omit<PinnedItem, "id" | "timestamp"> = {
  title: "Sales by Region",
  type: "chart",
  content: { chart_type: "bar", x_column: "region", y_column: "sales" },
};

describe("usePinboardStore", () => {
  beforeEach(() => {
    usePinboardStore.getState().clearPinboard();
    localStorage.clear();
  });

  it("initializes empty", () => {
    expect(usePinboardStore.getState().pinnedItems).toEqual([]);
  });

  it("pinItem adds the item to the list", () => {
    usePinboardStore.getState().pinItem(metricItem);

    const items = usePinboardStore.getState().pinnedItems;
    expect(items).toHaveLength(1);
    expect(items[0].title).toBe("Revenue Q1");
    expect(items[0].type).toBe("metric");
  });

  it("assigns unique id and timestamp on pin", () => {
    usePinboardStore.getState().pinItem(metricItem);
    usePinboardStore.getState().pinItem(chartItem);

    const items = usePinboardStore.getState().pinnedItems;
    expect(items).toHaveLength(2);
    expect(items[0].id).not.toBe(items[1].id);
    expect(items[0].id).toMatch(/^pin_/);
    expect(items[0].timestamp).toMatch(/\d{1,2}:\d{2}/);
  });

  it("places most recently pinned first", () => {
    usePinboardStore.getState().pinItem(metricItem);
    usePinboardStore.getState().pinItem(chartItem);

    const items = usePinboardStore.getState().pinnedItems;
    expect(items[0].title).toBe("Sales by Region");
    expect(items[1].title).toBe("Revenue Q1");
  });

  it("unpinItem removes by id", () => {
    usePinboardStore.getState().pinItem(metricItem);
    usePinboardStore.getState().pinItem(chartItem);
    const firstId = usePinboardStore.getState().pinnedItems[0].id;

    usePinboardStore.getState().unpinItem(firstId);

    const items = usePinboardStore.getState().pinnedItems;
    expect(items).toHaveLength(1);
    expect(items.find((i) => i.id === firstId)).toBeUndefined();
  });

  it("unpinItem ignores unknown id (no-op)", () => {
    usePinboardStore.getState().pinItem(metricItem);
    usePinboardStore.getState().unpinItem("non_existent_id");

    expect(usePinboardStore.getState().pinnedItems).toHaveLength(1);
  });

  it("clearPinboard empties the list", () => {
    usePinboardStore.getState().pinItem(metricItem);
    usePinboardStore.getState().pinItem(chartItem);
    usePinboardStore.getState().clearPinboard();

    expect(usePinboardStore.getState().pinnedItems).toEqual([]);
  });

  it("persists pinboard to localStorage", () => {
    usePinboardStore.getState().pinItem(metricItem);

    const stored = localStorage.getItem("ai_analyst_pinboard_storage");
    expect(stored).not.toBeNull();
    const parsed = JSON.parse(stored!);
    expect(parsed.state.pinnedItems).toHaveLength(1);
    expect(parsed.state.pinnedItems[0].title).toBe("Revenue Q1");
  });
});