import { useRouter } from "next/router";
import useMutation from "../Hooks/useMutation";
import { updateUser } from "../lib/users";

export default function Login() {
  const router = useRouter();
  const [_updateUser] = useMutation(updateUser, ["/api/auth"], {
    onSuccess: (data) => {
      router.push("/game");
    },
  });

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

        <div className=" w-full mt- pl-4 py-4 bg-gray-300 text-center bg-opacity-70">
          <h1 className=" text-2xl font-bold text-white drop-shadow ">
            Διάβασε τα αποσπάσματα των λογοτεχνικών κειμένων καθώς μέσα τους
            κρύβονται οι απαντήσεις σε ότι θα σου συμβεί από εδώ και πέρα... Στη
            διαδρομή αντικείμενα και θα λύσεις γρίφους για να καταφέρεις να
            διαφύγεις σου, θα μαζέψεις από κάθε έναν από τους χώρους στους
            οποίους θα βρεθείς παγιδευμένος. Στο τέλος κάθε τέτοιας διαφυγής, θα
            συλλέγεις κι από ένα αντικείμενο που θα σε βοηθήσει στην τελική σου
            απόδραση.... «Θα κινηθείς ανάμεσα στο φως και το σκοτάδι, θα χαθείς
            ανάμεσα στο παρελθόν και το παρόν θα συρθείς ανάμεσα στο υπόγειο και
            το επίγειο, θα μπερδευτείς ανάμεσα στο είναι και στο φαίνεσθαι. Μην
            φοβηθείς και μην σταματήσεις θα ανταμειφθείς γι αυτό θα γίνεις κι
            εσύ ένας μύστης)
          </h1>
        </div>

        <div className="  ml-auto mt- pl-4 py-4  justify-end grid grid-cols-2 gap-2 ">
          <button
            onClick={() =>
              _updateUser({
                time: 600,
              })
            }
            className="bg-gray-300 px-8 py-4 mr-8 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow "
          >
            Δύσκολο
          </button>
          <button
            onClick={() => {
              _updateUser({
                time: 900,
              });
            }}
            className="bg-gray-300 px-8 py-4 mr-8 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow "
          >
            Εύκολο
          </button>
        </div>
      </section>
    </>
  );
}
