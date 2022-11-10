import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import useMutation from "../Hooks/useMutation";
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
  return (
    <>
      <section
        style={{
          backgroundImage: `url(/scenes/pp0_xorafi.jpg)`,
          backgroundSize: "100% 100%",
        }}
        className="h-screen flex flex-col justify-around w-screen overflow-hidden"
      >
        <div className=" w-full pl-4 py-4 bg-black bg-opacity-50">
          <h1 className=" text-3xl font-bold text-white">Σενάριο</h1>
        </div>
        <div className=" grid h-full w-full p-4 grid-cols-[300px_1fr]">
          <div className="  ml-auto  py-4 my-auto justify-end grid grid-cols-1 w-full gap-2 ">
            {user.data?.scene && user.data?.scene !== "intro" && step === 0 && (
              <Link href="/game">
                <button className=" w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow ">
                  Συνέχεια
                </button>
              </Link>
            )}
            {step === 0 && (
              <button
                onClick={() => {
                  setStep(1);
                }}
                className=" w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow "
              >
                Νεο παιχνίδι
              </button>
            )}

            {step === 1 && (
              <button
                onClick={async () => {
                  await axios.post("/api/auth?type=reset");
                  _updateUser({
                    time: 900,
                  });
                }}
                className=" w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow "
              >
                Εύκολο
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
                className=" w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow "
              >
                Δύσκολο
              </button>
            )}

            {step === 1 && (
              <button
                onClick={() => {
                  setStep(0);
                }}
                className=" w-full bg-black px-8 py-4 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow "
              >
                Πίσω
              </button>
            )}
          </div>

          <div className=" w-3/5 mx-auto  py-4 h-fit p-8 my-auto rounded-xl bg-black  text-center bg-opacity-70">
            <h1 className=" text-3xl font-bold text-white drop-shadow leading-10 ">
              Διάβασε τα αποσπάσματα των λογοτεχνικών κειμένων καθώς μέσα τους
              κρύβονται οι απαντήσεις σε ότι θα σου συμβεί από εδώ και πέρα...
              Στη διαδρομή αντικείμενα και θα λύσεις γρίφους για να καταφέρεις
              να διαφύγεις σου, θα μαζέψεις από κάθε έναν από τους χώρους στους
              οποίους θα βρεθείς παγιδευμένος. Στο τέλος κάθε τέτοιας διαφυγής,
              θα συλλέγεις κι από ένα αντικείμενο που θα σε βοηθήσει στην τελική
              σου απόδραση.... «Θα κινηθείς ανάμεσα στο φως και το σκοτάδι, θα
              χαθείς ανάμεσα στο παρελθόν και το παρόν θα συρθείς ανάμεσα στο
              υπόγειο και το επίγειο, θα μπερδευτείς ανάμεσα στο είναι και στο
              φαίνεσθαι. Μην φοβηθείς και μην σταματήσεις θα ανταμειφθείς γι
              αυτό θα γίνεις κι εσύ ένας μύστης)
            </h1>
          </div>
        </div>
      </section>
    </>
  );
}
