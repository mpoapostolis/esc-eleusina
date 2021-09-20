import create from "zustand";

type Modal = "menu" | "gameOver" | undefined;

export type Store = {
  timer: number;
  modal: Modal;
  stage: number;
  audio: string;
  setOpenModal: (s?: Modal) => void;
  setAudio: (s: string) => void;
  setTimer: (n: number) => void;
  setStage: (n: number) => void;
};

export const useStore = create<Store>((set) => ({
  timer: 60,
  stage: 0,
  audio: "",
  modal: "menu",
  setOpenModal: (s: Modal) => set((state) => ({ modal: s })),
  setAudio: (s: string) => set((state) => ({ audio: s })),
  setTimer: (n: number) => set((state) => ({ timer: n })),
  setStage: (n: number) => set((state) => ({ stage: n })),
}));
