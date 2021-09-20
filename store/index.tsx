import create from "zustand";

export type Store = {
  timer: number;
  stage: number;
  audio: string;
  setAudio: (s: string) => void;
  setTimer: (n: number) => void;
  setStage: (n: number) => void;
};

export const useStore = create<Store>((set) => ({
  timer: 60,
  stage: 0,
  audio: "",
  setAudio: (s: string) => set((state) => ({ audio: s })),
  setTimer: (n: number) => set((state) => ({ timer: n })),
  setStage: (n: number) => set((state) => ({ stage: n })),
}));
