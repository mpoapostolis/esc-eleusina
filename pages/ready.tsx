import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useMutation from "../Hooks/useMutation";
import { useT } from "../Hooks/useT";
import { updateUser, useUser } from "../lib/users";

export default function Login() {
  const router = useRouter();
  const [_updateUser] = useMutation(updateUser, ["/api/auth"], {
    onSuccess: (data) => {
      router.push("/game");
    },
  });
  const [step, setStep] = useState(0);
  const user = useUser();
  const t = useT();
  return (
    <>
      <section
        style={{
          backgroundImage: `url(/scenes/xorafi_low.jpg)`,
          backgroundSize: "100% 100%",
        }}
        className="h-screen flex flex-col justify-around w-screen overflow-hidden"
      >
        <div className=" w-full pl-4 py-4 bg-black bg-opacity-50">
          <h1 className=" text-3xl font-bold text-white">{t("ready_title")}</h1>
        </div>
        <div className=" grid h-full w-full p-4 grid-cols-[300px_1fr]">
          <div className="  ml-auto  py-4 my-auto justify-end grid grid-cols-1 w-full gap-2 ">
            {user.data?.scene && user.data?.scene !== "intro" && step === 0 && (
              <Link href="/game">
                <button className=" hover:scale-105 w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-xl font-bold text-white drop-shadow ">
                  {t("ready_continue")}
                </button>
              </Link>
            )}

            {step === 0 && (
              <button
                onClick={() => {
                  setStep(1);
                }}
                className="hover:scale-105 w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-xl font-bold text-white drop-shadow "
              >
                {t("ready_new_game")}
              </button>
            )}
            {step === 0 && (
              <Link href="/learn-more">
                <button className=" hover:scale-105 w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-xl font-bold text-white drop-shadow ">
                  {t("learn_more")}
                </button>
              </Link>
            )}

            {step === 1 && (
              <button
                onClick={async () => {
                  await axios.post("/api/auth?type=reset");
                  _updateUser({
                    time: 900,
                  });
                }}
                className="hover:scale-105 w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-xl font-bold text-white drop-shadow "
              >
                {t("ready_easy")}
              </button>
            )}
            {step === 1 && (
              <button
                onClick={async () => {
                  await axios.post("/api/auth?type=reset");

                  _updateUser({
                    time: 600,
                  });
                }}
                className="hover:scale-105 w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-xl font-bold text-white drop-shadow "
              >
                {t("ready_hard")}
              </button>
            )}

            {step === 1 && (
              <button
                onClick={() => {
                  setStep(0);
                }}
                className="hover:scale-105 w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-xl font-bold text-white drop-shadow "
              >
                {t("ready_back")}
              </button>
            )}
          </div>

          <div className=" w-3/5 mx-auto  py-4 h-fit p-8 my-auto rounded-xl bg-black  text-center bg-opacity-70">
            <h1 className=" text-xl font-bold text-white drop-shadow leading-10 ">
              {t("ready_text")}
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}
