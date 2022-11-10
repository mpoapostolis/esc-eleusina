import { GetServerSideProps } from "next";
import Link from "next/link";
import { useRouter } from "next/router";
import useMutation from "../Hooks/useMutation";
import { updateUser, useUser } from "../lib/users";
import { withSessionSsr } from "../lib/withSession";
import myDb from "../helpers/mongo";
import clsx from "clsx";

const arr = [
  "/images/btn-1.png",
  "/images/btn-2.png",
  "/images/btn-3.png",
  "/images/btn-4.png",
  "/images/btn-5.png",
];
export default function Home() {
  const router = useRouter();
  return (
    <div className="h-screen w-screen grid grid-cols-5 gap-2 bg-black ">
      {arr.map((e, idx) => (
        <Link
          href={router.query?.newUser ? "/learn-more?newUser=true" : "/ready"}
        >
          <button
            className="disabled:cursor-not-allowed relative disabled:opacity-30 overflow-hidden"
            disabled={idx !== 2}
          >
            <img
              className={clsx("h-full scale-110 w-full", {
                "transition hover:scale-150  duration-200": idx == 2,
              })}
              src={e}
            />
            <div
              className={clsx({
                "w-full text-opacity-0 bg-opacity-20 hover:bg-opacity-25 h-full absolute hover:bg-yellow-300 bg-black top-0 left-0 ":
                  idx === 2,
              })}
            ></div>
          </button>
        </Link>
      ))}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = withSessionSsr(
  async function getServerSideProps({ req }) {
    const user = req.session.user;
    let destination = null;
    const db = await myDb();

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
        props: { ...user },
      };
  }
);
