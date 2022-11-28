import { useRouter } from "next/router";
type Locale = "en" | "el";

type Key =
  | "login_title"
  | "login_button"
  | "login_signup"
  | "menu_play"
  | "menu_select_level"
  | "menu_achievements"
  | "menu_logout"
  | "menu_reset"
  | "register_button"
  | "register_title"
  | "register_login"
  | "ready_continue"
  | "ready_title"
  | "ready_new_game"
  | "ready_level"
  | "ready_back"
  | "ready_text"
  | "ready_easy"
  | "ready_hard"
  | "ui_inventory"
  | "ui_time"
  | "ui_play_the_game"
  | "clock_text"
  | "reward_title"
  | "reward_continue"
  | "wordsearch_title"
  | "wordsearch_author";

const translations: Record<Locale, Record<Key, string>> = {
  en: {
    menu_play: "Play",
    menu_select_level: "Select Level",
    menu_achievements: "Achievements",
    menu_logout: "Logout",
    menu_reset: "Reset",
    login_title: `User info`,
    login_button: `Login`,
    login_signup: `Don't have an account yet? Sign up`,
    register_button: `Register`,
    register_title: `User info`,
    register_login: `Already have an account? Login`,
    ready_new_game: `New Game`,
    ready_level: `Level`,
    ready_back: `Back`,
    ready_text: ``,
    ready_easy: `Easy`,
    ready_hard: `Hard`,
    ready_continue: `Continue`,
    ready_title: `Scenario`,
    ui_inventory: `Inventory`,
    ui_time: `Time Remaining`,
    ui_play_the_game: `Play the game`,
    clock_text: `Form 4 words related to the pair of opposites
               "speech and silence". Only in this way will you find the secret that it is
               imprisoned in time.`,
    reward_title: `Congratulations! You won the room's reward`,
    reward_continue: `Continue your journey`,
    wordsearch_title: ``,
    wordsearch_author: ``,
  },
  el: {
    menu_play: "Παίξε",
    menu_select_level: "Επιλογή Επιπέδου",
    menu_achievements: "Επιτεύγματα",
    menu_logout: "Αποσύνδεση",
    menu_reset: "Επαναφορά",
    login_title: `Στοιχεία χρήστη`,
    login_button: `Είσοδος`,
    login_signup: `Δεν έχετε λογαριασμό; Εγγραφείτε εδώ`,
    register_button: `Εγγραφή`,
    register_title: `Στοιχεία χρήστη`,
    register_login: `Έχετε ήδη λογαριασμό; Συνδεθείτε εδώ`,
    ready_title: "Σενάριο",
    ready_continue: "Συνέχεια",
    ready_new_game: "Νέο παιχνίδι",
    ready_level: "Επίπεδο",
    ready_back: "Πίσω",
    ready_text: `Διάβασε τα αποσπάσματα των λογοτεχνικών κειμένων καθώς μέσα τους κρύβονται οι απαντήσεις σε ότι θα σου συμβεί από εδώ και πέρα... Στη διαδρομή αντικείμενα και θα λύσεις γρίφους για να καταφέρεις να διαφύγεις σου, θα μαζέψεις από κάθε έναν από τους χώρους στους οποίους θα βρεθείς παγιδευμένος. Στο τέλος κάθε τέτοιας διαφυγής, θα συλλέγεις κι από ένα αντικείμενο που θα σε βοηθήσει στην τελική σου απόδραση.... «Θα κινηθείς ανάμεσα στο φως και το σκοτάδι, θα χαθείς ανάμεσα στο παρελθόν και το παρόν θα συρθείς ανάμεσα στο υπόγειο και το επίγειο, θα μπερδευτείς ανάμεσα στο είναι και στο φαίνεσθαι. Μην φοβηθείς και μην σταματήσεις θα ανταμειφθείς γι αυτό θα γίνεις κι εσύ ένας μύστης)`,
    ready_easy: "Εύκολο",
    ready_hard: "Δύσκολο",
    ui_inventory: "Η συλλογή μου",
    ui_time: "Χρόνος που απομένει",
    ui_play_the_game: "Παίξε το παιχνίδι",
    clock_text: `Σχημάτισε 4 λέξεις που σχετίζονται με το ζευγάρι των αντιθέσεων
              «ομιλία και σιωπή». Μόνον έτσι θα βρεις το μυστικό που είναι
              φυλακισμένο στον χρόνο.`,
    reward_title: `Συγχαρητήρια κέρδισες το έπαθλο του δωματίου`,
    reward_continue: `Συνέχισε τη διαδρομή σου`,
    wordsearch_title: `Κει πέρα τίποτα δεν ταράζει τη σιωπή.Μονάχα ένας σκύλος (κι αυτός
              δε γαβγίζει), άσκημος σκύλος, ο δικός του, σκοτεινός με στραβά
              δόντια, με δυο μεγάλα μάτια αόριστα, πιστά και ξένα, σκοτεινά σαν
              πηγάδια, — κι ούτε ξεχωρίζεις μέσα τους το πρόσωπό σου, τα χέρια
              σου ή το πρόσωπό του.Ωστόσο διακρίνεις το σκοτάδι ακέριο, συμπαγές
              και διάφανο, πλήρες, παρηγορητικό, αναμάρτητο.Περσεφόνη,`,
    wordsearch_author: `Γ.Ρίτσος`,
  },
};

export function useT() {
  const router = useRouter();
  const locale = router.locale as "el" | "en";
  const t = (key: Key) =>
    translations[locale][key] === ""
      ? `to be translated: ${key}`
      : translations[locale][key];
  return t;
}
