import create from "zustand";
export type Level =
  | "Φως-Σκοτάδι"
  | "Υπόγειο-Επίγειο"
  | "Παρελθόν-Παρόν"
  | "ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ";

export type Modal = "menu" | "gameOver" | "inventory" | undefined;
export type Scene =
  | "archeologikos"
  | "elaioyrgeio"
  | "intro"
  | "karavi"
  | "jigSaw"
  | "livadi";

export type Account = {
  accessToken?: string;
  email?: string;
  data?: Record<string, any>;
};

export type Item = {
  name: string;
  src: string;
  description: string;
} & Record<string, any>;

export type Store = {
  account: Account;
  hint?: string;
  setHint: (s: string) => void;
  level: Level;
  timer: number;
  modal: Modal;
  inventory: Item[];
  inventoryNotf: string[];
  scene: Scene;
  audio: string;
  dialogue: string[];
  setEmail: (s: string) => void;
  setToken: (s: string) => void;
  setLevel: (s: Level) => void;
  setDialogue: (s: string[]) => void;
  nextDialogue: () => void;
  invHas: (e: string) => boolean;
  setIntentory: (i: Item) => void;
  setOpenModal: (s?: Modal) => void;
  setInventoryNotf: (n: string) => void;
  removeInventoryNotf: (n: string) => void;
  setAudio: (s: string) => void;
  setTimer: (n: number) => void;
  setScene: (n: Scene) => void;
  removeInvItem: (s: string) => void;
  restart: () => void;
};

export const useStore = create<Store>((set, get) => ({
  timer: 600,
  account: {
    accessToken: "2",
  },
  scene: "intro",
  audio: "",
  level: "Φως-Σκοτάδι",
  inventory: [],
  hint: undefined,
  setHint: (hint: string) => set(() => ({ hint })),
  setLevel: (l: Level) => set(() => ({ level: l })),
  inventoryNotf: [],
  dialogue: [],
  modal: undefined,
  setToken: (s: string) =>
    set((store) => ({
      account: { ...store.account, accessToken: s },
    })),
  setEmail: (s: string) =>
    set((store) => ({
      account: { ...store.account, email: s },
    })),

  restart: () =>
    set(() => ({
      timer: 600,
      scene: "intro",
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
  setScene: (n: Scene) => set(() => ({ scene: n })),
}));
