import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useMutation from "../Hooks/useMutation";
import { updateUser, useUser } from "../lib/users";
import { withSessionSsr } from "../lib/withSession";
import myDb from "../helpers/mongo";
import { ObjectId } from "mongodb";

export default function Home() {
  const router = useRouter();
  const { locale } = router;
  const { data: user } = useUser();
  const [_updateUser] = useMutation(updateUser, ["/api/auth"]);
  return (
    <div
      style={{
        backgroundImage: `url(/images/bg.png)`,
        backgroundSize: "100% 100%",
      }}
      className="w-screen h-screen flex items-center justify-center"
    >
      <div className="container p-8 border-dashed bg-black bg-opacity-70  grid gap-4 text-center">
        <select
          value={locale}
          onChange={(evt) => {
            const locale = evt.currentTarget.value;
            router.push("/", "/", { locale });
          }}
          className="cursor-pointer rounded-xl border-dashed bg-opacity-70  bg-white text-center text-4xl appearance-none block px-3 py-4 w-full   text-orange-400 drop-shadow-xl font-bold    border-opacity-70 border-white border-2 outline-none"
        >
          <option
            className=" text-orange-400 uppercase  bg-white text-2xl "
            value="en"
          >
            🇬🇧 &nbsp; {(locale === "el" ? "ΑΓΓΛΙΚΑ" : `English`).toUpperCase()}
          </option>
          <option
            className="text-orange-400 drop-shadow-xl uppercase  bg-white text-2xl "
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
          className="cursor-pointer rounded-xl border-dashed bg-opacity-70  bg-white text-center text-4xl appearance-none block px-3 py-4 w-full   text-orange-400 drop-shadow-xl font-bold    border-opacity-70 border-white border-2 outline-none"
        >
          <option
            className=" text-orange-400 drop-shadow-xl uppercase  bg-white text-2xl "
            value="eleusina"
          >
            {(locale === "el" ? "ΕΛΕΥΣΙΝΑ" : `ELEUSINA`).toUpperCase()}
          </option>
          <option
            disabled
            className="text-orange-400 drop-shadow-xl uppercase  bg-white text-2xl "
            value="skiathos"
          >
            {(locale === "el" ? "ΣΚΙΑΘΟΣ" : `SKIATHOS`).toUpperCase()}
          </option>
        </select>

        <select
          value={user?.scene ?? "intro"}
          onChange={(evt) => {
            _updateUser({ scene: evt.currentTarget.value });
          }}
          className="cursor-pointer rounded-xl border-dashed bg-opacity-70  bg-white text-center text-4xl appearance-none block px-3 py-4 w-full   text-orange-400 drop-shadow-xl font-bold    border-opacity-70 border-white border-2 outline-none"
        >
          <option
            className=" text-orange-400 drop-shadow-xl uppercase  bg-white text-2xl "
            value="intro"
          >
            {(locale === "el" ? "Φως-Σκόταδι" : `Light-Dark`).toUpperCase()}
          </option>
          <option
            className="text-orange-400 drop-shadow-xl uppercase  bg-white text-2xl "
            value="pp0_xorafi"
          >
            {(locale === "el"
              ? "Παρελθόν-Παρον"
              : `Past-Present`
            ).toUpperCase()}
          </option>
        </select>

        <select
          value={user?.time ?? 1200}
          onChange={(evt) => {
            _updateUser({ time: +evt.currentTarget.value });
          }}
          className="cursor-pointer rounded-xl border-dashed bg-opacity-70  bg-white text-center text-4xl appearance-none block px-3 py-4 w-full   text-orange-400 drop-shadow-xl font-bold    border-opacity-70 border-white border-2 outline-none"
        >
          <option
            className="text-orange-400 drop-shadow-xl uppercase  bg-white text-2xl "
            value={1200}
          >
            {(locale === "el" ? "ΑΡΧΑΡΙΟΣ" : `BEGINNER`).toUpperCase()}
          </option>
          <option
            className="text-orange-400 drop-shadow-xl uppercase  bg-white text-2xl "
            value={600}
          >
            {(locale === "el" ? "ΕΜΠΕΙΡΟΣ" : `EXPERIENCED`).toUpperCase()}
          </option>
        </select>

        <form
          className="w-full h-full"
          action="/api/auth?type=logout"
          method="POST"
        >
          <input
            value="LOGOUT"
            type="submit"
            src="https://s2.svgbox.net/hero-outline.svg?ic=logout&color=fff9"
            title="LOGOUT"
            className="cursor-pointer rounded-xl border-dashed bg-opacity-70  bg-white text-center text-4xl appearance-none block px-3 py-4 w-full   text-orange-400 drop-shadow-xl font-bold    border-opacity-70 border-white border-2 outline-none"
          />
        </form>
        <Link href="/learn-more">
          <a className="cursor-pointer rounded-xl border-dashed bg-opacity-70  bg-white text-center text-4xl appearance-none block px-3 py-4 w-full   text-orange-400 drop-shadow-xl font-bold    border-opacity-70 border-white border-2 outline-none">
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

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    let destination = null;
    const db = await myDb();

    const account = await db
      .collection("users")
      .findOne({ _id: new ObjectId(`${user?.id ?? ""}`) });

    if (!user) destination = "/login";
    if (user?.admin) destination = "/admin";
    if (destination)
      return {
        redirect: {
          destination,
          permanent: true,
        },
      };
    else
      return {
        props: { ...user, time: account?.time ?? 600 },
      };
  }
);
