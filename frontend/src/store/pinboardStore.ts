import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * The shape of `content` depends on the pinned item's `type`. Instead of `any`,
 * we model the most common cases explicitly and fall back to `unknown` for
 * anything else — callers always set this to a known shape at the call site,
 * so this is a type-tightening without losing flexibility.
 */
export interface MetricContent {
  metric_name: string;
  value: number | string;
  unit?: string;
  trend?: "up" | "down" | "flat";
  delta_pct?: number;
}

export interface ChartContent {
  chart_type: string;
  x_column: string;
  y_column?: string;
  series?: string;
  image_url?: string;
  config?: Record<string, unknown>;
}

export interface InsightContent {
  text: string;
  confidence?: number;
  source?: string;
}

export interface MlContent {
  model_name: string;
  score: number;
  metric: "accuracy" | "r2" | "f1" | "roc_auc";
  target_column: string;
}

export type PinnedContent =
  | MetricContent
  | ChartContent
  | InsightContent
  | MlContent
  | Record<string, unknown>;

export interface PinnedItem {
  id: string;
  title: string;
  type: "metric" | "chart" | "insight" | "ml";
  content: PinnedContent;
  timestamp: string;
}

interface PinboardState {
  pinnedItems: PinnedItem[];
  pinItem: (item: Omit<PinnedItem, "id" | "timestamp">) => void;
  unpinItem: (id: string) => void;
  clearPinboard: () => void;
}

export const usePinboardStore = create<PinboardState>()(
  persist(
    (set) => ({
      pinnedItems: [],

      pinItem: (item) =>
        set((state) => {
          const newItem: PinnedItem = {
            ...item,
            id: `pin_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
            timestamp: new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };
          return { pinnedItems: [newItem, ...state.pinnedItems] };
        }),

      unpinItem: (id) =>
        set((state) => ({
          pinnedItems: state.pinnedItems.filter((i) => i.id !== id),
        })),

      clearPinboard: () => set({ pinnedItems: [] }),
    }),
    {
      name: "ai_analyst_pinboard_storage",
      // Cap persisted history at 25 items so localStorage never grows unbounded.
      partialize: (state) => ({
        pinnedItems: state.pinnedItems.slice(0, 25),
      }),
    }
  )
);
