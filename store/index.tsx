import { Euler, Vector3 } from "three";
import create from "zustand";
import { HintType } from "../components/AdminSettings/SceneSettings";
import { ancientText } from "../components/AncientText";
import { Reward } from "../pages";
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
  reward?: Item | null;
  jigSawUrl?: string;
  hidden?: boolean;
  collectableIfHandHas?: string | null;
  onClickTrigger?: string;
  text?: string;
  delayTimeHint?: number;
  position?: Vector3;
  selectable?: boolean;
  collectable?: boolean;
  onClickOpenModal?: "hint" | "guidelines" | "timerHint" | undefined;
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

// @ts-ignore
export const guideLines: Record<string | Scene, string> = {
  intro: `Ώρα να περιπλανηθείς στο φως και να βυθιστείς στο σκοτάδι. Μάζεψε αντικείμενα-κλειδιά  και με αυτά ξεκλείδωσε τις σκοτεινές και φωτεινές εσοχές του δωματίου. 
    Για να δούμε.... Θα αντέξουν τα μάτια σου το φως; Θα προσαρμοστούν στο σκοτάδι; Θα καταφέρεις να ξεκλειδώσεις το δωμάτιο; `,
  archeologikos: `Αναζήτησε το κρυμμένο κείμενο. Βρες το "Ρολόι των γραμμάτων" και σχημάτισε σε αυτό τις 4 λέξεις που σχετίζονται με το ζευγάρι των αντιθέσεων «ομιλία και σιωπή». Ποιο είναι το μυστικό που είναι φυλακισμένο μέσα στον χρόνο;`,
  teletourgeio: `Διάβασε το κρυμμένο  κείμενο και βρες τα αντικείμενα που θα σε βοηθήσουν να τελέσεις το μυστήριο. Ποιο είναι το μυστικό που κρύβεται στις δάφνες; `,
  karnagio: `Πάτησε πάνω στη θήκη του ταξιδιώτη για να διαβάσεις το κείμενο. Γέμισέ την με το βιος των ξεριζωμένων που περιγράφεται σε αυτό. Σε τι θα γυρίσει η μνήμη αν τους βοηθήσεις να την κουβαλήσουν; `,
  teletourgeioLogotexnikoKeimeno: `Ακούς και τ’ άλογα στο στάβλο, και το νερό που πέφτει
  καθώς υψώνουν οι προσκυνητές δυο πήλινα δοχεία,
  το ’να προς την ανατολή και τ’ άλλο προς τη δύση, χύνοντας υδρομέλι
  ή κριθαρόνερο ανακατεμένο με άγρια μέντα
  πάνω στο λάκκο με τις δάφνες, ενώ μουρμουρίζουν
  διφορούμενα λόγια, παρακλήσεις και ξόρκια.
  Περσεφόνη, Γ. Ρίτσος`,
  karnakioLogotexniko: `Αλήθεια σου λέω, — ήμουν καλά εκεί πέρα. Συνήθισα. Εδώ δεν αντέχω·
  είναι πολύ το φως —μ’ αρρωσταίνει— απογυμνωτικό, απροσπέλαστο·
  όλα τα δείχνει και τα κρύβει· αλλάζει κάθε τόσο — δεν προφταίνεις· αλλάζεις·
  αισθάνεσαι το χρόνο που φεύγει — μια ατέλειωτη, κουραστική μετακίνηση·
  σπάζουν τα γυαλικά στη μετακόμιση, μένουν στο δρόμο, αστράφτουν·
  άλλοι πηδούν στη στεριά, άλλοι ανεβαίνουν στα πλοία· — όπως τότε,
  έρχονταν, φεύγαν οι επισκέπτες μας, έρχονταν άλλοι·
  μέναν για λίγο στους διαδρόμους οι μεγάλες βαλίτσες τους —
  μια ξένη μυρωδιά, ξένες χώρες, ξένα ονόματα, — το σπίτι
  δε μας ανήκε· — ήταν κι αυτό μια βαλίτσα μ’ εσώρουχα καινούρια, άγνωστά μας —
  μπορούσε κάποιος να την πάρει απ’ το πέτσινο χερούλι και να φύγει.
  Περσεφόνη, Γ. Ρίτσος`,
  elaiourgeio: `Βρες το κρυμμένο κείμενο,  εντόπισε τα χαρακτηριστικά του ζώου που περιγράφονται σε αυτό και χρησιμοποίησέ τα για να λύσεις το "Κρυπτόλεξο του μυθικού τέρατος". Το διπλό καθρέφτισμά του φτιάχνει το μυθικό τέρας που φύλαγε τις πύλες του Άδη.`,
};

export const helps: Record<string, string> = {
  intro1:
    "Ψάξε και βρες την πέτρινη πλάκα με τον Όρκο του Μύστη. Στο κείμενο, δείξε το ζευγάρι των αντίθετων λέξεων που θα φωτίσει τις πύλες μύησης στο σκοτεινό δωμάτιο.",
  portals: `Διάλεξε τη σφαίρα που θα σε οδηγήσει στο δωμάτιο.`,
  archPortalHover: `Και συ, από κει αναδύθηκες, σκοτεινέ σύζυγε,
  με τη σιωπή γραμμένη στο πρόσωπο…`,
  elaiourgeioPortalHover: `Κει πέρα
  τίποτα δεν ταράζει τη σιωπή. Μονάχα ένας σκύλος (κι αυτός δε γαβγίζει),
  άσκημος σκύλος…`,
  planoEleusPortalHover: `Γίνεται τότε μια μεγάλη ησυχία, μαλακή, ευγενική, νοτισμένη,
  ως πέρα απ’ τον κήπο, ως την άκρη της θύμησης, σα να ’χει μεμιάς φθινοπωριάσει.`,
  telestirioPortalHover: `Ακούς και τ’ άλογα στο στάβλο, και το νερό που πέφτει
  καθώς υψώνουν οι προσκυνητές δυο πήλινα δοχεία…`,
  kampinaPloiouPortalHover: `Έχει γυρίσει, όπως κάθε καλοκαίρι, απ’ την ξένη σκοτεινή χώρα, στο μεγάλο, εξοχικό, πατρικό της σπίτι…`,
  karnagioPortalHover: `μια ατέλειωτη, κουραστική μετακίνηση·
  σπάζουν τα γυαλικά στη μετακόμιση, μένουν στο δρόμο, αστράφτουν·
  άλλοι πηδούν στη στεριά, άλλοι ανεβαίνουν στα πλοία·`,
  archeologikos1: `Σχημάτισε τις λέξεις ενώνοντας τα γράμματα με συνεχόμενη γραμμή`,
  teletourgeio1: `Πρέπει να βρεις το εργαλείο για να κόψεις τις δάφνες.`,
  teletourgeio2: `Μπορείς να το χρησιμοποιήσεις για να κόψεις το φυτό που αναφέρεται στο κείμενο`,
  notCollectable: `Ουπς! Αυτό το αντικείμενο δεν μπορεί να μπει στο αποθετήριο`,
  karnagioXerouli1: `Ουπς! Αυτό το αντικείμενο δεν μπορεί να μπει στη βαλίτσα`,
  metaforaValitsas: `Πρέπει να βρεις κάποιο τρόπο για να μεταφέρεις τη βαλίτσα`,
  search: `ψαξε τα υπόλοιπα αντικειμενα`,
  karnagioCaseFull: `Πρέπει να βρεις κάποιο τρόπο για να μεταφέρεις τη βαλίτσα`,
  karnagioSeira: `Σειρά: γυάλινο μυροδοχείο, γυάλινο κηροπήγιο, εσώρουχο`,
  teletourgeioGrifos: `Βάλε τη δάφνη και τα δοχεία στο κουτί`,
  teletourgeioGrifosErr1: `Πρώτα πρέπει να μπουν οι δάφνες`,
};

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
  | "UNITY"
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
  | "EPIC_ITEM"
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
  onTrigger: (s?: string) => void;
  level: Level;
  guideLinesVissible?: boolean;
  setguideLinesVissible: (e: boolean) => void;
  guideLines?: string;
  modal: Modal;
  inventory: Item[];
  epicInventory: Reward[];
  unity?: string;

  jigSawUrl?: string;
  lexigram?: string[];
  compass?: boolean;
  reward?: Reward | null;

  inventoryNotf: string[];
  selectItem?: Item;
  epicItem?: Reward;
  usedItems: Record<string, boolean>;

  scene: Scene;
  hand?: string;
  status: Status;

  setCompass: (p?: boolean, reward?: Reward | null) => void;
  setLexigram: (s?: string[], reward?: Reward | null) => void;
  setJigSaw: (e?: string, reward?: Reward | null) => void;
  setUnity: (e?: string, reward?: Reward | null) => void;

  setUsedItem: (id: string) => void;
  setSelectItem: (i: Item) => void;
  setHand: (s?: string) => void;
  setEmail: (s: string) => void;
  setguideLines: (s?: string) => void;
  setEpicItem: (s?: Reward) => void;
  setToken: (s: string) => void;
  setLevel: (s: Level) => void;
  invHas: (e?: string) => boolean;
  epicInvHas: (e: string) => boolean;
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
  scene: "elaiourgeio",
  level: "Φως-Σκοτάδι",
  inventory: [],
  epicInventory: [],
  hint: undefined,
  isHintVisible: false,
  usedItems: {},
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

    set((s) => {});
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

  setUnity: (unity, reward) =>
    set(() => {
      dap?.play();
      return {
        status: unity ? "UNITY" : "RUNNING",
        unity,
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
  onTrigger: (triggerEvent?: string) =>
    set((s) => {
      switch (triggerEvent) {
        case "ancientText":
          return s.setAncientText(ancientText);

        case "teletourgeio":

        default:
          break;
      }
    }),

  setEpicItem: (epicItem) =>
    set((s) => {
      if (!epicItem) return { ...s, epicItem, status: "RUNNING" };
      const found = s.epicInventory
        .map((o) => o.name)
        .includes(`${epicItem._id}`);
      if (found) return s;
      else {
        win?.play();
        return {
          ...s,
          reward: null,
          epicItem: epicItem,
          status: "EPIC_ITEM",
          epicInventory: epicItem
            ? [...s.epicInventory, epicItem]
            : s.epicInventory,
        };
      }
    }),

  setHint: (hint?: string) =>
    set(() => ({
      hint: hint,
    })),
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
      return { status: ancientText ? "MODAL" : "RUNNING", ancientText };
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
  epicInvHas: (e: string) =>
    get()
      .epicInventory.map((i) => i._id)
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
      };
    }),
  setOpenModal: (s: Modal) => set(() => ({ modal: s })),
  setScene: (n: Scene) => set(() => ({ isHintVisible: false, scene: n })),
}));
