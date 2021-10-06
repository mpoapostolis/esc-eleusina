import { Item, useStore } from "../../../store";
import clsx from "clsx";
import { useEffect, useState } from "react";

export default function MiniGameOrder() {
  const store = useStore();
  const hasEmoji = store.invHas("emoji");
  const hasAlpha = store.invHas("alpha");
  const hasIstos = store.invHas("istos");
  const hasStone = store.invHas("stone");
  const [order, setOrder] = useState<Item[] | any[]>([{}, {}, {}, {}]);
  const [idx, setIdx] = useState<number>(0);
  const items = store.inventory.filter((i) =>
    ["emoji", "alpha", "istos", "stone"].includes(i.name)
  );

  useEffect(() => {
    if (
      order.map((e) => e.name).toString() ===
      ["alpha", "emoji", "istos", "stone"].toString()
    ) {
      items.forEach((i) => {
        store.removeInvItem(i.name);
        store.removeInventoryNotf(i.name);
      });
      store.setDialogue(["Συγχαρητηρια κερδισατε την Αγέλαστος πέτρα"]);
      store.setIntentory({
        name: "Αγέλαστος πέτρα",
        description: `Η αγέλαστος πέτρα είναι βράχος στην Ελευσίνα. Ο τόπος αυτός θεωρείτο ιερός διότι σύμφωνα με την παράδοση η Δήμητρα κάθησε εδώ για να ξαποστάσει και να μοιρολογήσει την κόρη της Περσεφόνη που την άρπαξε ο Πλούτωνας. Ο Όττο Ρούμπενζον υποστήριζε την άποψη ότι η «αγέλαστος πέτρα» αποτελείτο από σειρά τριών βράχων που έδειχναν την είσοδο μιας σπηλιάς που θεωρείτο ότι ήταν η είσοδος για τον κάτω κόσμο. Οι τρεις βράχοι συνοδεύονταν και από τρεις πηγές νερού, τις Ανθίων, Πανθίων και Καλλίχρονον.`,
        src: "/images/agelastospetra.jpg",
      });
      store.setInventoryNotf("Αγέλαστος πέτρα");
    }
  }, [order]);

  return (
    <div
      style={{ background: "#000e" }}
      className={clsx("h-full fixed z-50 w-screen min-h-screen", {
        hidden: !(hasEmoji && hasAlpha && hasIstos && hasStone),
      })}
    >
      <div className="flex h-full  justify-center items-center">
        <div>
          <h1 className="text-5xl text-white">
            Βάλε τα σύμβολα στη σωστή σειρά <br /> για να εμφανιστή η λέξη
          </h1>
          <br />
          <hr className="opacity-50" />
          <br />
          <br />
          <div className="grid w-96 pointer-events-auto grid-cols-4">
            {items.map((o, i) => (
              <div
                key={o.name}
                className={clsx(
                  "border items-center justify-center  text-white border-white z-50"
                )}
              >
                <img
                  draggable
                  onDragStart={() => setIdx(i)}
                  className="w-36 m-auto"
                  src={o.src}
                  alt=""
                />
              </div>
            ))}
          </div>
          <br />
          <hr className="opacity-50" />
          <br />
          <div className="grid pointer-events-auto grid-cols-4">
            {order.map((o, i) => (
              <div
                key={i}
                onDragEnter={() => {
                  const tmp = [...order].map((x) =>
                    x.name === order[i].name ? {} : x
                  );
                  tmp[i] = items[idx];
                  setOrder(tmp);
                }}
                className={clsx(
                  "border w-40 h-40 items-center justify-center text-white border-white z-50"
                )}
              >
                {o.src && (
                  <img draggable className="w-36 m-auto" src={o.src} alt="" />
                )}
              </div>
            ))}
          </div>
          <br />
          <a
            onClick={() => {
              setOrder(Array(4).fill({}));
            }}
            role="button"
            className={`w-full mt-2 text-shadow  bg-gradient-to-tl  border
          text-center flex justify-center items-center h-20 text-yellow-50
          rounded-md transform transition text-lg 
          hover:underline hover:bg-black duration-150 font-bold shadow-lg`}
          >
            <div
              onClick={store.restart}
              className="flex items-center w-64 gap-x-2"
            >
              <img
                className="w-10 mr-10"
                src="https://s2.svgbox.net/materialui.svg?ic=refresh&color=fffc"
                width="32"
                height="32"
              />
              <span className="">Restart</span>
            </div>
          </a>{" "}
        </div>
      </div>
    </div>
  );
}
