import { Euler, Vector3 } from "three";
import create from "zustand";
import { HintType } from "../components/AdminSettings/SceneSettings";
import { Reward } from "../pages";
import { Img } from "../pages/admin";
import { loadSound } from "../utils";

export const LOCAL_STORAGE_AUTH_KEY = "escape_vr";

export const setKey = (payload: Record<string, any>) => {
  if (typeof window !== "undefined")
    localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, JSON.stringify(payload));
};
export const loadKey = () => {
  if (typeof window !== "undefined") {
    const k = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY);
    const obj = k ? JSON.parse(k) : undefined;
    return obj;
  }
};

export type Level =
  | "Φως-Σκοτάδι"
  | "Υπόγειο-Επίγειο"
  | "Παρελθόν-Παρόν"
  | "ΕΙΝΑΙ-ΦΑΙΝΕΣΘΑΙ";

export type Modal = "menu" | "gameOver" | "inventory" | undefined;
export type Scene =
  | "intro"
  | "arxaiologikos"
  | "elaiourgeio"
  | "eleusina"
  | "teletourgeio"
  | "pangal"
  | "karnagio";

export const scenes = [
  "intro",
  "arxaiologikos",
  "elaiourgeio",
  "eleusina",
  "teletourgeio",
  "pangal",
  "karnagio",
];

export type Account = {
  accessToken?: string;
  email?: string;
  data?: Record<string, any>;
};

export type AncientText = {
  text: string;
  author: string;
  keys: string[];
};

export type Item = {
  _id?: string;
  isMiniGame?: boolean;
  isEpic?: boolean;
  hintType?: HintType;
  disappearIfIdExist?: string | null;
  rotation?: Euler;
  inventorySrc?: string | null;
  orderInsideTheBox?: string[];
  scene: Scene;
  rewardDescription?: string;
  orderBoxError?: string;
  goToScene?: Scene;
  lexigram?: string;
  reward?: Reward | null;
  ancientText?: string;
  requiredToolToReplace?: Img;
  replaceImg?: string;
  clickableWords?: string;
  author?: string;
  jigSawUrl?: string;
  hidden?: boolean;
  collectableIfHandHas?: string | null;
  onClickTrigger?: string;
  text?: string;
  delayTimeHint?: number;
  position?: Vector3;
  selectable?: boolean;
  collectable?: boolean;
  onClickOpenModal?: "hint" | "guidelines" | "ancientText" | undefined;
  setGuidelines?: string;
  setHint?: string;
  onCollectFail?: string;
  requiredItems?: string[];
  name: string;
  type?: string;
  hideAfterClick?: boolean;
  scale: number;
  src: string;
  description?: string;
  action?: () => void;
} & Record<string, any>;

export type HelpKey =
  | "intro1"
  | "search"
  | "portals"
  | "archPortalHover"
  | "elaiourgeioPortalHover"
  | "planoEleusPortalHover"
  | "telestirioPortalHover"
  | "kampinaPloiouPortalHover"
  | "karnagioPortalHover"
  | "archeologikos1"
  | "teletourgeio1"
  | "teletourgeio2"
  | "teletourgeio3"
  | "notCollectable"
  | "teletourgeioGrifos"
  | "teletourgeioGrifosErr1"
  | undefined;

export type Status =
  | "MENU"
  | "LOGIN"
  | "MINIGAMEMODAL"
  | "JIGSAW"
  | "LEXIGRAM"
  | "COMPASS"
  | "REGISTER"
  | "SELECT_LEVEL"
  | "ACHIEVEMENTS"
  | "MODAL"
  | "GUIDELINES"
  | "HISTORY"
  | "ANCIENT_TEXT"
  | "REWARD"
  | "RUNNING";

export type Store = {
  account: Account;
  hint?: string;
  isHintVisible: boolean;
  ancientText?: AncientText;
  setHint: (s?: string) => void;
  tmpHint?: string;
  setIsHintVisible: (b: boolean) => void;
  setAncientText: (s?: AncientText) => void;
  level: Level;
  guideLinesVissible?: boolean;
  setguideLinesVissible: (e: boolean) => void;
  guideLines?: string;
  modal: Modal;
  inventory: (Item | Reward)[];

  jigSawUrl?: string;
  lexigram?: string[];
  compass?: boolean;
  reward?: Reward | null;
  setReward: (i: Reward | null) => void;

  inventoryNotf: string[];
  selectItem?: Item;
  usedItems: Record<string, boolean>;

  scene: Scene;
  hand?: string;
  status: Status;

  setCompass: (p?: boolean, reward?: Reward | null) => void;
  setLexigram: (s?: string[], reward?: Reward | null) => void;
  setJigSaw: (e?: string, reward?: Reward | null) => void;

  screenShot?: string;
  takeScreenShot: (src: string) => void;
  fadeOutImg?: string;
  setFadeOutImg: (src: string) => void;
  setUsedItem: (id: string) => void;
  setSelectItem: (i: Item) => void;
  setHand: (s?: string) => void;
  setEmail: (s: string) => void;
  setguideLines: (s?: string) => void;
  setToken: (s: string) => void;
  setLevel: (s: Level) => void;
  invHas: (e?: string) => boolean;
  setInventory: (i: Item) => void;
  setOpenModal: (s?: Modal) => void;
  setInventoryNotf: (n: string) => void;
  removeInventoryNotf: (n: string) => void;
  setScene: (n: Scene) => void;
  removeInvItem: (s: string) => void;
  setStatus: (s: Status) => void;
};
const dap = loadSound("/sounds/modal.wav");
const hint = loadSound("/sounds/hint.wav");
const win = loadSound("/sounds/win.wav");

export const useStore = create<Store>((set, get) => ({
  account: {},
  status: "MENU",
  scene: "intro",
  level: "Φως-Σκοτάδι",
  inventory: [],
  hint: undefined,
  isHintVisible: false,
  usedItems: {},
  takeScreenShot: (src: string) =>
    set(() => ({
      screenShot: src,
    })),

  setFadeOutImg: (obj) =>
    set(() => ({
      fadeOutImg: obj,
    })),

  setStatus: (status) => set(() => ({ status })),
  setUsedItem: (id: string) =>
    set((s) => ({
      usedItems: {
        ...s.usedItems,
        [id]: true,
      },
    })),
  setJigSaw: (e, reward) => {
    if (e) dap?.play();
    set(() => ({
      status: e ? "JIGSAW" : "RUNNING",
      jigSawUrl: e,
      reward,
    }));
  },

  setCompass: (compass, reward?: Reward | null) => {
    dap?.play();
    set(() => ({
      status: compass ? "COMPASS" : "RUNNING",
      compass,
      reward,
    }));
  },

  setLexigram: (lexigram?: string[], reward?: Reward | null) =>
    set(() => {
      dap?.play();
      return {
        status: lexigram ? "LEXIGRAM" : "RUNNING",
        lexigram,
        reward,
      };
    }),

  setHand: (h?: string) => {
    if (h) dap?.play();
    set((s) => {
      const hand = s.hand === h ? undefined : h;
      return { hand };
    });
  },
  setguideLinesVissible: (b: boolean) => {
    dap?.play();
    set(() => ({
      status: b ? "GUIDELINES" : "RUNNING",
      guideLinesVissible: b,
    }));
  },

  setSelectItem: (i: Item) => set(() => ({ selectItem: i })),

  setHint: (hint?: string) =>
    set(() => ({
      hint: hint,
    })),

  setReward: (reward) => {
    win?.play();
    set((s) => {
      let inv = [...s.inventory];
      if (reward) inv = [...inv, reward];
      return {
        inventory: inv,
        reward,
        status: reward ? "REWARD" : "RUNNING",
      };
    });
  },

  setIsHintVisible: (isHintVisible) =>
    set(() => {
      hint.play();
      return { isHintVisible };
    }),
  setLevel: (l: Level) => set(() => ({ level: l })),
  setguideLines: (guideLines?: string) =>
    set(() => {
      return { status: guideLines ? "GUIDELINES" : "RUNNING", guideLines };
    }),
  setAncientText: (ancientText?: AncientText) =>
    set(() => {
      dap?.play();
      return { status: ancientText ? "ANCIENT_TEXT" : "RUNNING", ancientText };
    }),
  inventoryNotf: [],
  modal: undefined,
  setToken: (s: string) =>
    set((store) => ({
      account: { ...store.account, accessToken: s },
    })),
  setEmail: (s: string) =>
    set((store) => ({
      account: { ...store.account, email: s },
    })),

  invHas: (e?: string) =>
    get()
      .inventory.map((i) => i._id)
      .includes(e),

  setInventory: (i: Item) => {
    dap?.play();
    set((state) => ({
      inventory: [...state.inventory, i],
      isHintVisible: false,
    }));
  },
  setInventoryNotf: (n: string) =>
    set((state) => {
      return { inventoryNotf: [...state.inventoryNotf, n] };
    }),
  removeInventoryNotf: (n: string) =>
    set((state) => {
      return { inventoryNotf: state.inventoryNotf.filter((i) => i !== n) };
    }),
  removeInvItem: (s: string) =>
    set((state) => {
      const hand = s === state.hand ? undefined : state.hand;
      return {
        hand,
        inventory: state.inventory.filter((item) => item._id !== s),

        usedItems: {
          ...state.usedItems,
          [s]: true,
        },
      };
    }),
  setOpenModal: (s: Modal) => set(() => ({ modal: s })),
  setScene: (n: Scene) => set(() => ({ isHintVisible: false, scene: n })),
}));
