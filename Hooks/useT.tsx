import { useRouter } from "next/router";
type Locale = "en" | "el";

type Key = "login_title" | "login_button" | "login_signup";
const translations: Record<Locale, Record<Key, string>> = {
  en: {
    login_title: `User info`,
    login_button: `Login`,
    login_signup: `Don't have an account yet? Sign up`,
  },
  el: {
    login_title: `Στοιχεία χρήστη`,
    login_button: `Είσοδος`,
    login_signup: `Δεν έχετε λογαριασμό; Εγγραφείτε εδώ`,
  },
};

export function useT() {
  const router = useRouter();
  const locale = router.locale as "el" | "en";
  const t = (key: Key) => translations[locale][key] ?? key;
  return t;
}
