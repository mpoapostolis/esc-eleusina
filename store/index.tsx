import axios from "axios";
import { mutate } from "swr";
import { Euler, Vector3 } from "three";
import create from "zustand";
import { HintType } from "../components/AdminSettings/SceneSettings";
import { Reward } from "../pages";
import { Img } from "../pages/admin";

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
  | "arxaiologikos"
  | "elaiourgeio"
  | "eleusina"
  | "intro"
  | "karnagio"
  | "kikeonas"
  | "navagio_ext"
  | "navagio_int"
  | "ntamari"
  | "pangal"
  | "teletourgeio"
  | "xorafi";

export const scenes = [
  "arxaiologikos",
  "elaiourgeio",
  "eleusina",
  "intro",
  "karnagio",
  "kikeonas",
  "navagio_ext",
  "navagio_int",
  "ntamari",
  "pangal",
  "teletourgeio",
  "xorafi",
];

export type Account = {
  accessToken?: string;
  email?: string;
  data?: Record<string, any>;
};

export type AncientText = {
  item?: Item;
  text: string;
  author: string;
  keys: string[];
};

export type Item = {
  _id?: string;
  imgId: string;
  isMiniGame?: boolean;
  isEpic?: boolean;
  hintType?: HintType;
  disappearIfIdExist?: string | null;
  replaced?: string[];
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
  | "CLOCK"
  | "JIGSAW"
  | "LEXIGRAM"
  | "WORDSEARCH"
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

export const statusArr = [
  "MENU",
  "LOGIN",
  "MINIGAMEMODAL",
  "JIGSAW",
  "LEXIGRAM",
  "WORDSEARCH",
  "COMPASS",
  "REGISTER",
  "SELECT_LEVEL",
  "ACHIEVEMENTS",
  "MODAL",
  "GUIDELINES",
  "HISTORY",
  "ANCIENT_TEXT",
  "REWARD",
  "RUNNING",
];

export type Store = {
  account: Account;
  hint?: string;
  isHintVisible: boolean;
  ancientText?: AncientText;
  setHint: (s?: string) => void;
  tmpHint?: string;
  setIsHintVisible: (b: boolean, s?: string) => void;
  setAncientText: (s?: AncientText) => void;
  level: Level;
  guideLinesVissible?: boolean;
  setguideLinesVissible: (e: boolean) => void;
  guideLines?: string;
  nextGame?: Status;
  modal: Modal;

  jigSawUrl?: string;
  lexigram?: string[];
  compass?: boolean;
  reward?: Reward | null;
  setReward: (i: Reward | null) => void;

  selectItem?: Item;
  usedItems: Record<string, boolean>;
  timer: number;
  setTimer: (n: number) => void;

  scene: Scene;
  hand?: string;
  status: Status;
  sound?: string | null;
  setSound: (s?: string) => void;
  soundId?: number;
  scale?: number | null;
  setScale: (e: number | null) => void;

  rot?: Euler | null;
  setRot: (e: Euler | null) => void;

  setCompass: (p?: boolean, reward?: Reward | null) => void;
  setLexigram: (s?: string[], reward?: Reward | null) => void;
  setJigSaw: (e?: string, reward?: Reward | null, nextGame?: Status) => void;

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
  setOpenModal: (s?: Modal) => void;
  setScene: (n: Scene) => void;
  setStatus: (s: Status) => void;
};
export const useStore = create<Store>((set, get) => ({
  account: {},
  status: "RUNNING",
  scene: "intro",
  level: "Φως-Σκοτάδι",
  timer: 600,
  hint: undefined,
  isHintVisible: false,
  usedItems: {},
  takeScreenShot: (src: string) =>
    set(() => ({
      screenShot: src,
    })),
  setTimer: (timer) => set(() => ({ timer })),

  setFadeOutImg: (obj) =>
    set(() => ({
      fadeOutImg: obj,
    })),

  setSound: (sound) => set(() => ({ soundId: Math.random(), sound })),
  setScale: (scale) => set(() => ({ scale })),
  setRot: (rot) => set(() => ({ rot })),
  setStatus: (status) => set(() => ({ status })),
  setUsedItem: (id: string) =>
    set((s) => ({
      usedItems: {
        ...s.usedItems,
        [id]: true,
      },
    })),
  setJigSaw: (e, reward, nextGame) => {
    set(() => ({
      nextGame,
      status: e ? "JIGSAW" : "RUNNING",
      jigSawUrl: e,
      reward,
    }));
  },

  setCompass: (compass, reward?: Reward | null) => {
    set(() => ({
      status: compass ? "COMPASS" : "RUNNING",
      compass,
      reward,
    }));
  },

  setLexigram: (lexigram?: string[], reward?: Reward | null) =>
    set(() => {
      return {
        status: lexigram ? "LEXIGRAM" : "RUNNING",
        lexigram,
        reward,
      };
    }),

  setHand: (h?: string) => {
    set((s) => {
      s.setSound(`08_select_from_inventory`);
      const hand = s.hand === h ? undefined : h;
      return { hand };
    });
  },
  setguideLinesVissible: (b: boolean) => {
    set((s) => {
      if (b) s.setSound(`02_instruction_box`);
      return {
        status: b ? "GUIDELINES" : "RUNNING",
        guideLinesVissible: b,
      };
    });
  },

  setSelectItem: (i: Item) => set(() => ({ selectItem: i })),

  setHint: (hint?: string) =>
    set(() => ({
      hint: hint,
    })),

  setReward: async (reward) => {
    set((s) => {
      setTimeout(() => {
        if (reward?._id) s.setSound(`18_success`);
      });
      return {
        reward,
        status: reward ? "REWARD" : "RUNNING",
      };
    });
  },

  setIsHintVisible: (isHintVisible, sound) =>
    set((s) => {
      if (sound) s.setSound(sound);
      else if (isHintVisible) s.setSound(`05_hint`);
      return { isHintVisible };
    }),
  setLevel: (l: Level) => set(() => ({ level: l })),
  setguideLines: (guideLines?: string) =>
    set(() => {
      return {
        status: guideLines ? "GUIDELINES" : "RUNNING",
        guideLines,
      };
    }),
  setAncientText: (ancientText?: AncientText) =>
    set((s) => {
      if (ancientText?.text) s.setSound(`03_main_text_box`);
      return {
        status: ancientText ? "ANCIENT_TEXT" : "RUNNING",
        ancientText,
      };
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

  setOpenModal: (s: Modal) => set(() => ({ modal: s })),
  setScene: (n: Scene) => set(() => ({ isHintVisible: false, scene: n })),
}));
