import { create } from "zustand";

type StoreState = {
  timeAtCursor: Date | undefined;
  setTimeAtCursor: (time: Date) => void;
};

export const useZustandStore = create<StoreState>((set) => ({
  timeAtCursor: undefined,
  setTimeAtCursor: (time) => set({ timeAtCursor: time }),
}));
