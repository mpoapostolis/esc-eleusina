import { useGesture } from "@use-gesture/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useMutation from "../../Hooks/useMutation";
import { addItem, useInventory } from "../../lib/inventory";
import { useItems } from "../../lib/items";
import { useStore } from "../../store";
import MiniGameWrapper from "../MiniGameWrapper";

const _words = [
  `άσκημος`,
  `μεγάλα μάτια`,
  `στραβά δόντια`,
  `αόριστα`,
  `πιστά`,
  `ξένα`,
  `σκοτεινά`,
];

const greekLetters = [
  "Α",
  "Β",
  "Γ",
  "Δ",
  "Ε",
  "Ζ",
  "Η",
  "Θ",
  "Ι",
  "Κ",
  "Λ",
  "Μ",
  "Ν",
  "Ξ",
  "Ο",
  "Π",
  "Ρ",
  "Σ",
  "Τ",
  "Υ",
  "Φ",
  "Χ",
  "Ψ",
  "Ω",
];

const words = _words?.map((s) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
) ?? [""];

const r = () => {
  return greekLetters[Math.floor(Math.random() * greekLetters.length)];
};

const solved = words.map((e, i) =>
  e.split("").map((e, j) => ({ letter: e.replace(/ /g, ""), id: `${i}${j}` }))
);

// array of 12 with r as values
const randomLetters = () => Array.from({ length: 12 }, r);

const letters = [
  [r(), r(), r(), "Μ", r(), r(), r(), r(), r(), r(), r(), r()],
  [r(), r(), "Ξ", "Ε", "Ν", "Α", r(), r(), r(), r(), r(), r()],
  [r(), r(), r(), "Γ", r(), r(), r(), "Α", r(), r(), r(), r()],
  ["Σ", "Τ", "Ρ", "Α", "Β", "Α", "Δ", "Ο", "Ν", "Τ", "Ι", "Α"],
  ["Κ", r(), r(), "Λ", r(), r(), r(), "Ρ", r(), r(), r(), "Σ"],
  ["Ο", r(), r(), "Α", r(), r(), r(), "Ι", r(), r(), r(), "Κ"],
  ["Τ", r(), r(), "Μ", r(), "Π", "Ι", "Σ", "Τ", "Α", r(), "Η"],
  ["Ε", r(), r(), "Α", r(), r(), r(), "Τ", r(), r(), r(), "Μ"],
  ["Ι", r(), r(), "Τ", r(), r(), r(), "Α", r(), r(), r(), "Ο"],
  ["Ν", r(), r(), "Ι", r(), r(), r(), r(), r(), r(), r(), "Σ"],
  ["Α", r(), r(), "Α", r(), r(), r(), r(), r(), r(), r(), r()],
].map((e, i) =>
  e.map((e, j) => ({
    letter: e,
    id: `${i}${j}`,
  }))
);

type Word = { id: string; letter: string };
export function WordSearch() {
  const [found, setFound] = useState<Word[][]>([]);
  const [selected, setSelected] = useState<Word[]>([]);
  const store = useStore();

  const { data: items } = useItems();
  const { data: inventory } = useInventory();
  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  useEffect(() => {
    const giveItem = items.find((e) => e.hidden);
    if (invHas(giveItem?._id)) {
      setFound(solved);
    }
  }, [items, inventory]);

  const giveItem = items.find((e) => e.hidden);

  const [_addItem] = useMutation(addItem, [
    `/api/inventory?scene=${store.scene}`,
  ]);

  const solve = () => {
    if (!giveItem) return;
    _addItem(giveItem._id);
    store.setReward({
      _id: "sss",
      name: giveItem.name,
      src: giveItem.src,
      description:
        "Τοποθέτησε τον καθρέφτη για να δεις το διπλό καθρέφτισμα του Κέρβερου.",
    });
  };

  const bind = useGesture({
    onMouseUp: (w) => {
      const word = selected.map((e) => e.letter).join("");
      const foundWord = words.find((e) => {
        return e.replace(/ /g, "") === word;
      });
      if (foundWord) {
        if (found.length + 1 === words.length && giveItem) {
          solve();
        }
        setFound((f) => [...f, selected]);
      }
      setSelected([]);
      setDrag(false);
    },

    onMouseEnter: ({ args }) => {
      if (!drag) return;
      const [l] = args;
      setSelected((s) => [...s, l]);
    },
    onMouseDown: ({ args }) => {
      const [l] = args;
      setSelected((s) => [...s, l]);
      setDrag(true);
    },
  });

  const [drag, setDrag] = useState(false);
  const foundWorlds = found.map((e) => e.map((e) => e.letter).join(""));
  return (
    <MiniGameWrapper status="WORDSEARCH">
      <div className="grid grid-cols-[1fr_0.4fr] p-10 h-full">
        <div
          onMouseLeave={() => {
            if (drag) {
              setSelected([]);
              setDrag(false);
            }
          }}
          className="grid grid-cols-12 "
        >
          {letters.map((word) =>
            word.map((letter, idx) => (
              <div
                key={idx}
                {...bind(letter)}
                className={clsx(
                  "border items-center justify-center text-2xl font-bold w-full h-full flex",
                  {
                    "bg-green-700 bg-opacity-50":
                      selected.map((e) => e.id).includes(letter.id) ||
                      found
                        .map((e) => e.map((e) => e.id))
                        .flat()
                        .includes(letter.id),
                  }
                )}
              >
                {letter.letter}
              </div>
            ))
          )}
        </div>
        <div className="h-full  flex">
          <div className="divider-horizontal divider h-full"></div>
          <div className="w-full h-full p-4">
            <p className="text-2xl">Διάβασε το κείμενο και βρές τις λέξεις</p>
            <div className="divider"></div>
            <ul className=" mx-auto list-disc ">
              {words.map((word, idx) => (
                <li
                  key={idx}
                  className={clsx("whitespace-nowrap list-item font-bold", {})}
                >
                  <span
                    className={clsx("opacity-0", {
                      "opacity-100": foundWorlds.includes(
                        word.replace(/ /g, "")
                      ),
                    })}
                  >
                    {word}
                  </span>
                </li>
              ))}
              <div
                onClick={() => {
                  setFound(solved);
                  solve();
                }}
                className="btn"
              >
                solve
              </div>
            </ul>
            <div className="divider"></div>
            <span className="w-full text-2xl text-center break-words">
              Κει πέρα τίποτα δεν ταράζει τη σιωπή. Μονάχα ένας σκύλος (κι αυτός
              δε γαβγίζει), άσκημος σκύλος, ο δικός του, σκοτεινός με στραβά
              δόντια, με δυο μεγάλα μάτια αόριστα, πιστά και ξένα, σκοτεινά σαν
              πηγάδια, — κι ούτε ξεχωρίζεις μέσα τους το πρόσωπό σου, τα χέρια
              σου ή το πρόσωπό του. Ωστόσο διακρίνεις το σκοτάδι ακέριο,
              συμπαγές και διάφανο, πλήρες, παρηγορητικό, αναμάρτητο. Περσεφόνη,
              <br />
              <span className=" text-center italic">Γ. Ρίτσος</span>
            </span>
          </div>
        </div>
      </div>
    </MiniGameWrapper>
  );
}
