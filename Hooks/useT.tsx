import { useRouter } from "next/router";
type Locale = "en" | "el";

type Key =
  | "login_title"
  | "login_button"
  | "login_signup"
  | "login_username"
  | "login_password"
  | "menu_play"
  | "menu_select_level"
  | "menu_achievements"
  | "menu_logout"
  | "menu_reset"
  | "register_button"
  | "register_title"
  | "register_login"
  | "register_username"
  | "register_password"
  | "register_password_confirm"
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
  | "wordsearch_title_cerberus"
  | "wordsearch_text_cerberus"
  | "wordsearch_author_cerberus"
  | "wordsearch_title_pp4"
  | "wordsearch_text_pp4"
  | "wordsearch_author_pp4"
  | "learn_more"
  | "clock_pp5_title"
  | "clock_pp5_text"
  | "clock_pp5_author";

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
    login_username: `Username`,
    login_password: `Password`,

    register_button: `Register`,
    register_title: `User info`,
    register_login: `Already have an account? Login`,
    register_username: `Username`,
    register_password: `Password`,
    register_password_confirm: `Confirm Password`,

    ready_new_game: `New Game`,
    ready_level: `Level`,
    ready_back: `<`,
    ready_text: `Welcome to Elefsina!nl-nl 
This is the starting point of your adventure to become an Initiate. You will move into different places.nl
You’ll wander in Light and Darkness!nl
You’ll get lost in the Past and the Present!nl
You’ll crawl in the Underword and the Upworld!nl
You’ll get confused with Being and Appearing!nl
Along the way you will find excerpts from literary texts. Do not pass them by. They will help you solve the puzzles. Each escape from the individual places offers you an object that will help you in your final escape...nl-nl
Will you manage to escape and become an Initiate or will you be trapped forever?`,
    ready_easy: `Easy`,
    ready_hard: `Hard`,
    ready_continue: `Continue`,
    ready_title: `Scenario`,
    ui_inventory: `Inventory`,
    ui_time: `Time Remaining`,
    ui_play_the_game: `Play the game`,

    clock_text: `Form 4 words related to the pair of opposites "speech and silence" to find the secret that is imprisoned in time. The words shown in the "word clocks" will help you.`,

    reward_title: `Good job! Υου did it!`,
    reward_continue: `Keep going!`,

    wordsearch_title_cerberus: `Find words or phrases with the characteristics of the animal as mentioned in the text.`,
    wordsearch_text_cerberus: `Over therenl
nothing disturbs the silence. Only a dognl
(and he doesn't bark),nl
an ugly dog, his, dark, withnl
crooked teeth,nl and two large, ambiguous eyes, trusting and strange,nl dark like wells in which you cannot discernnl your face, your hands, or his face. And yetnl you can distinguish the darkness, total, dense and transparent,nl complete, consoling, sinless.`,
    wordsearch_author_cerberus: `Persephone, Y. Ritsos`,

    wordsearch_title_pp4: `In the cryptword look for four phrases that oscillate between life and death, earth and sky, night and day…`,
    wordsearch_text_pp4: `
  The Starry Night
  The ship has crossed the glossy night bringing back Persephone. The joy is so great, even the stars have gone down low. But they remain untouched to maintain balance.
  The couple at the foot of the hill are the Maiden and the painter. He confides the secrets of his soul that drive him to death. The goddess, for her part, peacefully initiates him into Hades, while urging him to reconsider life.`,
    wordsearch_author_pp4: ``,
    learn_more: `Learn more`,
    clock_pp5_title: `Search through the ‘lengths’ and the ‘widths’ of the poem to find the words starting with the same letter to complete the ‘Compass of the Caryatid of Eleusis`,
    clock_pp5_text: `My meek struggle,
to cast off the tinge of shadow
from my face, knowledge
of the most secret expression, though I emerge
from the darkness.
Aphrodite, emerging from the waters
the generator of coiling, the transparent
and mighty beauty, help me
to overcome the density of substance
that then closed upon me,
an obstacle visible to the light of heaven.`,
    clock_pp5_author: `Persephone, Zoe Karelli, 1973`,
  },
  el: {
    menu_play: "Παίξε",
    menu_select_level: "Επιλογή Επιπέδου",
    menu_achievements: "Επιτεύγματα",
    menu_logout: "Αποσύνδεση",
    menu_reset: "Επαναφορά",
    login_title: `Στοιχεία χρήστη`,
    login_button: `Είσοδος`,
    login_username: `Όνομα χρήστη`,
    login_password: `Συνθηματικό`,
    login_signup: `Δεν έχετε λογαριασμό; Εγγραφείτε εδώ`,

    register_button: `Εγγραφή`,
    register_title: `Στοιχεία χρήστη`,
    register_login: `Έχετε ήδη λογαριασμό; Συνδεθείτε εδώ`,
    register_username: `Όνομα χρήστη`,
    register_password: `Συνθηματικό`,
    register_password_confirm: `Επιβεβαίωση Συνθηματικού`,
    ready_title: "Απόδραση στον Πολιτισμό” -  Ελευσίνα",
    ready_continue: "Συνέχεια",

    ready_new_game: "Νέο παιχνίδι",
    ready_level: "Επίπεδο",
    ready_back: "<",
    ready_text: `Καλωσήλθες στην Ελευσίνα!nl
Η περιπέτεια για να γίνεις Μύστης ξεκινά. Θα κινηθείς σε ποικίλους χώρους.nl
Θα πλανηθείς στο Φως και το Σκοτάδι!nl
Θα χαθείς στο Παρελθόν και το Παρόν!nl
Θα συρθείς στο Υπόγειο και το Επίγειο!nl
Θα μπερδευτείς στο Είναι και στο Φαίνεσθαι!nl 
Στη διαδρομή θα βρεις αποσπάσματα λογοτεχνικών κειμένων. Μην τα προσπεράσεις. Θα σε βοηθήσουν να λύσεις τους γρίφους. Κάθε διαφυγή από τους επιμέρους χώρους σού δίνει ένα αντικείμενο που θα σε βοηθήσει στην τελική σου απόδραση...nl
Θα καταφέρεις τελικά να διαφύγεις και να γίνεις Μύστης ή θα παγιδευτείς για πάντα;`,
    ready_easy: "Εύκολο",
    ready_hard: "Δύσκολο",
    ui_inventory: "Η συλλογή μου",
    ui_time: "Χρόνος που απομένει",
    ui_play_the_game: "Παίξε το παιχνίδι",

    clock_text: `Σχημάτισε 4 λέξεις που σχετίζονται με το ζευγάρι των αντιθέσεων «ομιλία και σιωπή» για να βρεις το μυστικό που είναι φυλακισμένο στον χρόνο. Θα σε βοηθήσουν οι λέξεις που προβάλλονται στα "ρολόγια των λέξεων". `,
    reward_title: `Συγχαρητήρια! Τα κατάφερες! `,
    reward_continue: `Συνέχισε τη διαδρομή σου.`,

    wordsearch_title_cerberus: `Βρες λέξεις ή φράσεις με τα χαρακτηριστικά του ζώου όπως αναφέρονται στο κείμενο.`,
    wordsearch_text_cerberus: `Κει πέραnl
τίποτα δεν ταράζει τη σιωπή.Μονάχα ένας σκύλος (κι αυτός δε γαβγίζει),nl
άσκημος σκύλος, ο δικός του, σκοτεινός με στραβά δόντια,nl
με δυο μεγάλα μάτια αόριστα, πιστά και ξένα,nl
σκοτεινά σαν πηγάδια, — κι ούτε ξεχωρίζεις μέσα τουςnl
το πρόσωπό σου, τα χέρια σου ή το πρόσωπό του.nl
Ωστόσοnl
διακρίνεις το σκοτάδι ακέριο, συμπαγές και διάφανο,nl
πλήρες, παρηγορητικό, αναμάρτητο.`,
    wordsearch_author_cerberus: `Περσεφόνη, Γ.Ρίτσος`,

    wordsearch_title_pp4: `Αναζήτησε στο κρυπτόλεξο τις τέσσερις φράσεις που ταλαντεύονται μεταξύ ζωής και θανάτου, γης και ουρανού, νύχτας και μέρας…`,
    wordsearch_text_pp4: `Η έναστρη νύχτα
  Το πλοίο έχει διασχίσει το στιλπνό βράδυ φέρνοντας πίσω την Περσεφόνη. Η χαρά τόση, ακόμα και τ’ αστέρια έχουν κατεβεί χαμηλά. Αλλά παραμένουν ανέγγιχτα για διατήρηση της ισορροπίας.
  Το ζευγάρι στους πρόποδες του υψώματος είναι η Κόρη και ο ζωγράφος. Εκείνος εμπιστεύεται τα μυστικά της ψυχής του που τον ωθούν στο θάνατο. Η θεά από τη μεριά της τον μυεί γαλήνια στον Άδη, ενώ ταυτόχρονα προτρέπει για επανεξέταση της ζωής.`,
    wordsearch_author_pp4: `Αθηνά Παπαδάκη. 2007. Με άλλα λόγια. Αθήνα: Ροές.`,
    learn_more: `Μάθε περισσότερα`,
    clock_pp5_title: `Ψάξε σε όλα τα ‘μήκη’ και τα ‘πλάτη’ του ποιήματος να βρεις τις λέξεις που ξεκινούν από το ίδιο γράμμα και συμπλήρώσε την Πυξίδα της Καρυάτιδας της Ελευσίνας`,
    clock_pp5_text: `Δεινή μου πάλη,
nl για ν’ αποβάλλω τη χροιά της σκιάς
nl απ’ το πρόσωπό μου, γνώση
nl της πιο μυστικής έκφρασης κι ας αναδύομαι
nl απ’ το σκοτάδι.
nl Κύπρις, αναδυομένη απ’ των νερών
nl τη γεννήτρα συσπείρωση, τη διάφανη
nl και παντοδύναμη καλλονή, βοήθησέ με
nl την πυκνότητα να ξεπεράσω της ύλης
nl που, τότε, κλείστηκε απάνω μου,
nl εμπόδιο φανερό στο φως τ’ ουρανού.
`,
    clock_pp5_author: `Περσεφόνη, Ζωή Καρέλλη, 1973`,
  },
};

// const _translations: Record<Locale, Record<Key, string>> = {
//   en: {
//     menu_play: "Play",
//     menu_select_level: "Select Level",
//     menu_achievements: "Achievements",
//     menu_logout: "Logout",
//     menu_reset: "Reset",
//     login_title: `User info`,
//     login_button: `Login`,
//     login_signup: `Don't have an account yet? Sign up`,
//     login_username: `Username`,
//     login_password: `Password`,
//     register_button: `Register`,
//     register_title: `User info`,
//     register_login: `Already have an account? Login`,
//     register_username: `Username`,
//     register_password: `Password`,
//     register_password_confirm: `Confirm Password`,
//     ready_new_game: `New Game`,
//     ready_level: `Level`,
//     ready_back: `Back`,
//     ready_text: ``,
//     ready_easy: `Easy`,
//     ready_hard: `Hard`,
//     ready_continue: `Continue`,
//     ready_title: `Scenario`,
//     ui_inventory: `Inventory`,
//     ui_time: `Time Remaining`,
//     ui_play_the_game: `Play the game`,
//     clock_text: `Form 4 words related to the pair of opposites
//                 "speech and silence". Only in this way will you find the secret that it is
//                 imprisoned in time.`,
//     reward_title: `Congratulations! You won the room's reward`,
//     reward_continue: `Continue your journey`,
//     wordsearch_title_cerberus: `Find words or phrases with the characteristics of the animal as mentioned in the text.`,
//     wordsearch_text_cerberus: ``,
//     wordsearch_author_cerberus: ``,
//     wordsearch_title_pp4: `In the cryptword look for four phrases that oscillate between life and death, earth and sky, night and day…`,
//     wordsearch_text_pp4: `
//   The Starry Night
//   The ship has crossed the glossy night bringing back Persephone. The joy is so great, even the stars have gone down low. But they remain untouched to maintain balance.
//   The couple at the foot of the hill are the Maiden and the painter. He confides the secrets of his soul that drive him to death. The goddess, for her part, peacefully initiates him into Hades, while urging him to reconsider life.`,
//     wordsearch_author_pp4: ``,
//     learn_more: `Learn more`,
//     clock_pp5_title: `Search through the ‘lengths’ and the ‘widths’ of the poem to find the words starting with the same letter to complete the ‘Compass of the Caryatid of Eleusis`,
//     clock_pp5_text: `My meek struggle,
// to cast off the tinge of shadow
// from my face, knowledge
// of the most secret expression, though I emerge
// from the darkness.
// Aphrodite, emerging from the waters
// the generator of coiling, the transparent
// and mighty beauty, help me
// to overcome the density of substance
// that then closed upon me,
// an obstacle visible to the light of heaven.`,
//     clock_pp5_author: `Persephone, Zoe Karelli, 1973`,
//   },
//   el: {
//     menu_play: "Παίξε",
//     menu_select_level: "Επιλογή Επιπέδου",
//     menu_achievements: "Επιτεύγματα",
//     menu_logout: "Αποσύνδεση",
//     menu_reset: "Επαναφορά",
//     login_title: `Στοιχεία χρήστη`,
//     login_button: `Είσοδος`,
//     login_username: `Όνομα χρήστη`,
//     login_password: `Συνθηματικό`,
//     login_signup: `Δεν έχετε λογαριασμό; Εγγραφείτε εδώ`,
//     register_button: `Εγγραφή`,
//     register_title: `Στοιχεία χρήστη`,
//     register_login: `Έχετε ήδη λογαριασμό; Συνδεθείτε εδώ`,
//     register_username: `Όνομα χρήστη`,
//     register_password: `Συνθηματικό`,
//     register_password_confirm: `Επιβεβαίωση Συνθηματικού`,
//     ready_title: "Απόδραση στον Πολιτισμό” -  Ελευσίνα",
//     ready_continue: "Συνέχεια",
//     ready_new_game: "Νέο παιχνίδι",
//     ready_level: "Επίπεδο",
//     ready_back: "Πίσω",
//     ready_text: `Όλα όσα πρόκειται να δεις από εδώ και πέρα δεν επιτρέπεται να τα πεις σε κανέναν!
// 			Θα κινηθείς ανάμεσα στο Φως και το Σκοτάδι!
// 			Θα χαθείς ανάμεσα στο Παρελθόν και το Παρόν!
// 			Θα συρθείς ανάμεσα στο Υπόγειο και το Επίγειο!
// 			Θα μπερδευτείς ανάμεσα στο Είναι και το Φαίνεσθαι!
// 			Μην φοβηθείς και μην σταματήσεις! Θα ανταμειφθείς γι’ αυτό. Θα γίνεις κι εσύ ένας μύστης!
// 			Διάβασε τα λογοτεχνικά κείμενα καθώς σε αυτά κρύβονται οι απαντήσεις σε όσα θα σου συμβούν. Στη διαδρομή, θα μαζέψεις αντικείμενα και θα λύσεις γρίφους για να καταφέρεις να διαφύγεις από κάθε χ			ώρο στον οποίο θα παγιδευτείς. Σε κάθε διαφυγή, θα συλλέγεις κι από ένα αντικείμενο, που θα σε βοηθήσει στην τελική σου απόδραση.
// 			Καλή τύχη!`,
//     ready_easy: "Εύκολο",
//     ready_hard: "Δύσκολο",
//     ui_inventory: "Η συλλογή μου",
//     ui_time: "Χρόνος που απομένει",
//     ui_play_the_game: "Παίξε το παιχνίδι",
//     clock_text: `Σχημάτισε 4 λέξεις που σχετίζονται με το ζευγάρι των αντιθέσεων «ομιλία και σιωπή» για να βρεις το μυστικό που είναι φυλακισμένο στον χρόνο. Θα σε βοηθήσουν οι λέξεις που προβάλλονται στα "ρολόγια των λέξεων". `,
//     reward_title: `Συγχαρητήρια! κέρδισες το έπαθλο του δωματίου.`,
//     reward_continue: `Συνέχισε τη διαδρομή σου.`,
//     wordsearch_title_cerberus: `Βρες λέξεις ή φράσεις με τα χαρακτηριστικά του ζώου όπως αναφέρονται στο κείμενο.`,
//     wordsearch_text_cerberus: `Κει πέρα τίποτα δεν ταράζει τη σιωπή.Μονάχα ένας σκύλος (κι αυτός
//                nl δε γαβγίζει), άσκημος σκύλος, ο δικός του, σκοτεινός με στραβά
//                nl δόντια, με δυο μεγάλα μάτια αόριστα, πιστά και ξένα, σκοτεινά σαν
//                nl πηγάδια, — κι ούτε ξεχωρίζεις μέσα τους το πρόσωπό σου, τα χέρια
//                nl σου ή το πρόσωπό του.Ωστόσο διακρίνεις το σκοτάδι ακέριο, συμπαγές
//                nl και διάφανο, πλήρες, παρηγορητικό, αναμάρτητο.Περσεφόνη,`,
//     wordsearch_author_cerberus: `Γ.Ρίτσος`,
//     wordsearch_title_pp4: `Αναζήτησε στο κρυπτόλεξο τις τέσσερις φράσεις που ταλαντεύονται μεταξύ ζωής και θανάτου, γης και ουρανού, νύχτας και μέρας…`,
//     wordsearch_text_pp4: `Η έναστρη νύχτα
//   Το πλοίο έχει διασχίσει το στιλπνό βράδυ φέρνοντας πίσω την Περσεφόνη. Η χαρά τόση, ακόμα και τ’ αστέρια έχουν κατεβεί χαμηλά. Αλλά παραμένουν ανέγγιχτα για διατήρηση της ισορροπίας.
//   Το ζευγάρι στους πρόποδες του υψώματος είναι η Κόρη και ο ζωγράφος. Εκείνος εμπιστεύεται τα μυστικά της ψυχής του που τον ωθούν στο θάνατο. Η θεά από τη μεριά της τον μυεί γαλήνια στον Άδη, ενώ ταυτόχρονα προτρέπει για επανεξέταση της ζωής.`,
//     wordsearch_author_pp4: ``,
//     learn_more: `Μάθε περισσότερα`,
//     clock_pp5_title: `Ψάξε σε όλα τα ‘μήκη’ και τα ‘πλάτη’ του ποιήματος να βρεις τις λέξεις που ξεκινούν από το ίδιο γράμμα και συμπλήρώσε την Πυξίδα της Καρυάτιδας της Ελευσίνας`,
//     clock_pp5_text: `Δεινή μου πάλη,
// nl για ν’ αποβάλλω τη χροιά της σκιάς
// nl απ’ το πρόσωπό μου, γνώση
// nl της πιο μυστικής έκφρασης κι ας αναδύομαι
// nl απ’ το σκοτάδι.
// nl Κύπρις, αναδυομένη απ’ των νερών
// nl τη γεννήτρα συσπείρωση, τη διάφανη
// nl και παντοδύναμη καλλονή, βοήθησέ με
// nl την πυκνότητα να ξεπεράσω της ύλης
// nl που, τότε, κλείστηκε απάνω μου,
// nl εμπόδιο φανερό στο φως τ’ ουρανού.
// `,
//     clock_pp5_author: `Περσεφόνη, Ζωή Καρέλλη, 1973`,
//   },
// };

export function useT() {
  const router = useRouter();
  const locale = router.locale as "el" | "en";
  const t = (key: Key) =>
    translations[locale][key] === ""
      ? `to be translated: ${key}`
      : translations[locale][key];
  return t;
}
