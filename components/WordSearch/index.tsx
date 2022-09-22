import { useGesture } from "@use-gesture/react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import useMutation from "../../Hooks/useMutation";
import { addItem, useInventory } from "../../lib/inventory";
import { getInventory } from "../../lib/inventory/api";
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
  [r(), r(), r(), r(), r(), "Α", "Σ", "Κ", "Η", "Μ", "Ο", "Σ"],
  randomLetters(),
  ["Μ", "Ε", "Γ", "Α", "Λ", "Α", "Μ", "Α", "Τ", "Ι", "Α", r()],
  ["Σ", "Τ", "Ρ", "Α", "Β", "Α", "Δ", "Ο", "Ν", "Τ", "Ι", "Α"],
  randomLetters(),
  [r(), "Α", "Ο", "Ρ", "Ι", "Σ", "Τ", "Α", r(), r(), r(), r()],
  randomLetters(),
  [r(), r(), r(), r(), r(), "Π", "Ι", "Σ", "Τ", "Α", r(), r()],
  ["Ξ", "Ε", "Ν", "Α", r(), r(), r(), r(), r(), r(), r(), r()],
  [r(), "Σ", "Κ", "Ο", "Τ", "Ε", "Ι", "Ν", "Α", r(), r(), r()],
]
  .map((e, i) =>
    e.map((e, j) => ({
      letter: e,
      id: `${i}${j}`,
    }))
  )
  .sort(() => Math.random() - 0.5);

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
      description: "Βρήκες την κρυμμένη λέξη!",
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
      <div className="grid grid-cols-[1fr_0.2fr] p-10 h-full">
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
            word.map((letter) => (
              <div
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

          <ul className=" mx-auto list-disc">
            {words.map((word) => (
              <li
                className={clsx("whitespace-nowrap list-item font-bold", {
                  "line-through": foundWorlds.includes(word.replace(/ /g, "")),
                })}
              >
                {word}
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
        </div>
      </div>
    </MiniGameWrapper>
  );
}
