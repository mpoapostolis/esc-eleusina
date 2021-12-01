import create from "zustand";

export type Modal = "menu" | "gameOver" | "inventory" | undefined;
export type Scene =
  | "archeologikos"
  | "elaioyrgeio"
  | "intro"
  | "karavi"
  | "jigSaw"
  | "livadi";

export type Item = {
  name: string;
  src: string;
  description: string;
} & Record<string, any>;

export type Store = {
  timer: number;
  modal: Modal;
  inventory: Item[];
  inventoryNotf: string[];
  stage: Scene;
  audio: string;
  dialogue: string[];
  setDialogue: (s: string[]) => void;
  nextDialogue: () => void;
  invHas: (e: string) => boolean;
  setIntentory: (i: Item) => void;
  setOpenModal: (s?: Modal) => void;
  setInventoryNotf: (n: string) => void;
  removeInventoryNotf: (n: string) => void;
  setAudio: (s: string) => void;
  setTimer: (n: number) => void;
  setStage: (n: Scene) => void;
  removeInvItem: (s: string) => void;
  restart: () => void;
};

export const useStore = create<Store>((set, get) => ({
  timer: 600,
  stage: "intro",
  audio: "",
  inventory: [],
  inventoryNotf: [],
  dialogue: [],
  modal: "menu",
  restart: () =>
    set(() => ({
      timer: 600,
      stage: "intro",
      audio: "",
      inventory: [],
      inventoryNotf: [],
      dialogue: [],
      modal: "menu",
    })),
  setDialogue: (d: string[]) => set(() => ({ dialogue: d })),
  nextDialogue: () => {
    set((state) => {
      const [_, ...dialogue] = state.dialogue;
      return { dialogue };
    });
  },
  invHas: (e: string) =>
    get()
      .inventory.map((i) => i.name)
      .includes(e),

  setIntentory: (i: Item) =>
    set((state) => ({ inventory: [...state.inventory, i] })),
  setInventoryNotf: (n: string) =>
    set((state) => {
      return { inventoryNotf: [...state.inventoryNotf, n] };
    }),
  removeInventoryNotf: (n: string) =>
    set((state) => {
      return { inventoryNotf: state.inventoryNotf.filter((i) => i !== n) };
    }),
  removeInvItem: (s: string) =>
    set((state) => ({
      inventory: state.inventory.filter((item) => item.name !== s),
    })),
  setOpenModal: (s: Modal) => set(() => ({ modal: s })),
  setAudio: (s: string) => set(() => ({ audio: s })),
  setTimer: (n: number) => set(() => ({ timer: n })),
  setStage: (n: Scene) => set(() => ({ stage: n })),
}));
