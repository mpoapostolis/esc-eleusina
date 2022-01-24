import { ReturnValue } from "use-timer/lib/types";
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

export type AncientText = {
  text: string;
  keys: string[];
};

export type Item = {
  name: string;
  src: string;
  description: string;
} & Record<string, any>;

export type Store = {
  account: Account;
  hint?: string;
  ancientText?: AncientText;
  setHint: (s?: string) => void;
  setAncientText: (s?: AncientText) => void;
  level: Level;
  descriptiveText?: string;
  modal: Modal;
  inventory: Item[];
  inventoryNotf: string[];
  scene: Scene;
  audio: string;
  dialogue: string[];
  setEmail: (s: string) => void;
  setDescriptiveText: (s?: string) => void;
  setToken: (s: string) => void;
  setLevel: (s: Level) => void;
  setDialogue: (s: string[]) => void;
  nextDialogue: () => void;
  invHas: (e: string) => boolean;
  setInventory: (i: Item) => void;
  setOpenModal: (s?: Modal) => void;
  setInventoryNotf: (n: string) => void;
  removeInventoryNotf: (n: string) => void;
  setAudio: (s: string) => void;
  setScene: (n: Scene) => void;
  removeInvItem: (s: string) => void;

  timer?: ReturnValue;
  setTimer: (timer: ReturnValue) => void;
};

export const useStore = create<Store>((set, get) => ({
  account: {
    accessToken: "2",
  },
  scene: "archeologikos",
  audio: "",
  level: "Φως-Σκοτάδι",
  inventory: [],
  hint: undefined,
  setTimer: (timer: ReturnValue) => set(() => ({ timer })),
  setHint: (hint?: string) => set(() => ({ hint })),
  setLevel: (l: Level) => set(() => ({ level: l })),
  setDescriptiveText: (l?: string) => set(() => ({ descriptiveText: l })),
  setAncientText: (ancientText?: AncientText) => set(() => ({ ancientText })),

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

  setInventory: (i: Item) =>
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
  setScene: (n: Scene) => set(() => ({ scene: n })),
}));
