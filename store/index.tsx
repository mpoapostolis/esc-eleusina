import create from "zustand";

export type Modal = "menu" | "gameOver" | "inventory" | undefined;
export type Scene =
  | "archeologikos"
  | "elaioyrgeio"
  | "intro"
  | "karavi"
  | "livadi";

export type Store = {
  timer: number;
  modal: Modal;
  stage: Scene;
  audio: string;
  setOpenModal: (s?: Modal) => void;
  setAudio: (s: string) => void;
  setTimer: (n: number) => void;
  setStage: (n: Scene) => void;
};

export const useStore = create<Store>((set) => ({
  timer: 60,
  stage: "intro",
  audio: "",
  modal: "menu",
  setOpenModal: (s: Modal) => set((state) => ({ modal: s })),
  setAudio: (s: string) => set((state) => ({ audio: s })),
  setTimer: (n: number) => set((state) => ({ timer: n })),
  setStage: (n: Scene) => set((state) => ({ stage: n })),
}));
