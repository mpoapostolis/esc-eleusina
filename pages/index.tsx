import Link from "next/link";
import { useRouter } from "next/router";

export default function Home() {
  const router = useRouter();
  const { locale } = router;
  return (
    <div
      style={{
        backgroundImage: `url(/images/bg.png)`,
        backgroundSize: "100% 100%",
      }}
      className="w-screen h-screen flex items-center justify-center"
    >
      <div className="container bg-black p-8 bg-opacity-95 rounded-xl  grid gap-4 text-center">
        <label className="text-2xl text-left border-white border-opacity-20 text-gray-600">
          ΕΛΛΗΝΙΚΑ / ENGLISH
        </label>

        <select
          value={locale}
          onChange={(evt) => {
            const locale = evt.currentTarget.value;
            router.push("/", "/", { locale });
          }}
          className="cursor-pointer text-center text-4xl appearance-none block px-3 py-4 w-full  text-white font-bold bg-transparent  border border-opacity-25 border-white outline-none"
        >
          <option
            className=" text-white uppercase  bg-black text-2xl "
            value="en"
          >
            🇬🇧 &nbsp; {(locale === "el" ? "ΑΓΓΛΙΚΑ" : `English`).toUpperCase()}
          </option>
          <option
            className="text-white uppercase  bg-black text-2xl "
            value="el"
          >
            🇬🇷 &nbsp;{(locale === "el" ? "ΕΛΛΗΝΙΚΑ" : `Greek`).toUpperCase()}
          </option>
        </select>

        <select
          value={"eleusina"}
          onChange={(evt) => {
            const locale = evt.currentTarget.value;
          }}
          className="cursor-pointer text-center text-4xl appearance-none block px-3 py-4 w-full  text-white font-bold bg-transparent  border border-opacity-25 border-white outline-none"
        >
          <option
            className=" text-white uppercase  bg-black text-2xl "
            value="eleusina"
          >
            {(locale === "el" ? "ΕΛΕΥΣΙΝΑ" : `ELEUSINA`).toUpperCase()}
          </option>
          <option
            disabled
            className="text-white uppercase  bg-black text-2xl "
            value="skiathos"
          >
            {(locale === "el" ? "ΣΚΙΑΘΟΣ" : `SKIATHOS`).toUpperCase()}
          </option>
        </select>
        <Link href="/learn-more">
          <a className="text-4xl uppercase hover:bg-white hover:bg-opacity-10 transition duration-100 py-4 font-bold text-white w-full border border-opacity-25 border-white">
            {(locale === "el"
              ? "ΜΑΘΕ ΠΕΡΙΣΣΟΤΕΡΑ"
              : `LEARN MORE`
            ).toUpperCase()}
          </a>
        </Link>
      </div>
    </div>
  );
}
