import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface PinnedItem {
  id: string;
  title: string;
  type: "metric" | "chart" | "insight" | "ml";
  content: any;
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
            id: `pin_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
            timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
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
    }
  )
);
