import create from "zustand";

export type Modal = "menu" | "gameOver" | "inventory" | undefined;
export type Scene =
  | "archeologikos"
  | "elaioyrgeio"
  | "intro"
  | "karavi"
  | "livadi";

export type Item = {
  name: string;
  src: string;
};

export type Store = {
  timer: number;
  modal: Modal;
  inventory: Item[];
  inventoryNotf: number;
  invHas: (e: string) => boolean;
  stage: Scene;
  audio: string;
  setIntentory: (i: Item) => void;
  setOpenModal: (s?: Modal) => void;
  setInventoryNotf: (n: number) => void;
  setAudio: (s: string) => void;
  setTimer: (n: number) => void;
  setStage: (n: Scene) => void;
};

export const useStore = create<Store>((set, get) => ({
  timer: 60,
  stage: "intro",
  audio: "",
  modal: "menu",
  invHas: (e: string) =>
    get()
      .inventory.map((i) => i.name)
      .includes(e),

  inventory: [],
  inventoryNotf: 0,
  setIntentory: (i: Item) =>
    set((state) => ({ inventory: [...state.inventory, i] })),
  setInventoryNotf: (n: number) => set(() => ({ inventoryNotf: n })),
  setOpenModal: (s: Modal) => set(() => ({ modal: s })),
  setAudio: (s: string) => set(() => ({ audio: s })),
  setTimer: (n: number) => set(() => ({ timer: n })),
  setStage: (n: Scene) => set(() => ({ stage: n })),
}));
