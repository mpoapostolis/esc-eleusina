import "../styles/globals.css";
import type { AppProps } from "next/app";
import { useEffect } from "react";
import { useRouter } from "next/router";

declare global {
  interface Window {
    sound: HTMLAudioElement;
  }
}

export const readLang = () => {
  const locale = localStorage.getItem("lang");
  if (locale) return locale;
  return "el";
};

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();
  useEffect(() => {
    router.push(router.pathname, router.pathname, { locale: readLang() });
  }, []);
  return <Component {...pageProps} />;
}

export default MyApp;
