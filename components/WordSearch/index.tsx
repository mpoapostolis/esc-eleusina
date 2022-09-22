import { useGesture } from "@use-gesture/react";
import clsx from "clsx";
import { useState } from "react";
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

// generate random string
const randomString = () => {
  let s = "";
  for (let i = 0; i < 10; i++) {
    s += r();
  }
  return s;
};

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
  .map((e) =>
    e.map((e) => ({
      letter: e,
      id: randomString(),
    }))
  )
  .sort(() => Math.random() - 0.5);

type Word = { id: string; letter: string };
export function WordSearch() {
  const [found, setFound] = useState<Word[][]>([]);
  const [selected, setSelected] = useState<Word[]>([]);

  const bind = useGesture({
    onMouseUp: (w) => {
      const word = selected.map((e) => e.letter).join("");
      const found = words.find((e) => {
        return e.replace(/ /g, "") === word;
      });
      if (found) setFound((f) => [...f, selected]);
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
    <MiniGameWrapper status="RUNNING">
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
          </ul>
        </div>
      </div>
    </MiniGameWrapper>
  );
}
