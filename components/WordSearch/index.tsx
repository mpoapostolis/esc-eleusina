import { useGesture } from "@use-gesture/react";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import useMutation from "../../Hooks/useMutation";
import { useT } from "../../Hooks/useT";
import { addItem, addReward, useInventory } from "../../lib/inventory";
import { useItems } from "../../lib/items";
import { Reward } from "../../pages/game";
import { Scene, useStore } from "../../store";
import MiniGameWrapper from "../MiniGameWrapper";

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

const englishLetters = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
  "U",
  "V",
  "W",
  "X",
  "Y",
  "Z",
];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace("\n", "")
    .replace(" ", "")
    .toUpperCase();

const normalize = (arr?: string[]) =>
  arr?.map((s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
  ) ?? [""];

const r = (locale?: string) => {
  if (locale === "el")
    return greekLetters[Math.floor(Math.random() * greekLetters.length)];
  else return englishLetters[Math.floor(Math.random() * greekLetters.length)];
};

const solved = (arr: string[]) =>
  arr.map((e, i) =>
    e.split("").map((e, j) => ({ letter: e.replace(/ /g, ""), id: `${i}${j}` }))
  );

// array of 12 with r as values
const randomLetters = () => Array.from({ length: 12 }, r);

type Structure = {
  el_words: string[];
  el_structure: string;
  en_words: string[];
  en_structure: string;
};
const wordOb: Partial<Record<Scene, Structure>> = {
  elaiourgeio: {
    el_words: [
      `ΑΣΚΗΜΟΣ`,
      `ΜΕΓΑΛΑ ΜΑΤΙΑ`,
      `ΣΤΡΑΒΑ ΔΟΝΤΙΑ`,
      `ΑΟΡΙΣΤΑ`,
      `ΠΙΣΤΑ`,
      `ΞΕΝΑ`,
      `ΣΚΟΤΕΙΝΑ`,
    ],
    el_structure: `
      ...Μ........,
      ..ΞΕΝΑ......,
      ...Γ...Α....,
      ΣΤΡΑΒΑΔΟΝΤΙΑ,
      Κ..Λ...Ρ...Σ,
      Ο..Α...Ι...Κ,
      Τ..Μ.ΠΙΣΤΑ.Η,
      Ε..Α...Τ...Μ,
      Ι..Τ...Α...Ο,
      Ν..Ι.......Σ,
      Α..Α........`,
    en_words: [],
    en_structure: ``,
  },
  pp4_navagio: {
    el_words: [`ΕΝΑΣΤΡΗ ΝΥΧΤΑ`, `ΠΡΟΠΟΔΕΣ`, `ΑΣΤΕΡΙΑ`, `ΧΑΡΑ`, `ΑΔΗΣ`],
    el_structure: `
      ............,
      ΕΝΑΣΤΡΗΝΥΧΤΑ,
      ............,
      .........Π..,
      ..ΑΔΗΣ...Ρ..,
      .........Ο..,
      .......Χ.Π..,
      .......Α.Ο..,
      .......Ρ.Δ..,
      .ΑΣΤΕΡΙΑ.Ε..,
      .........Σ..,
      ............`,
    en_words: [`STARRY NIGHT`, `FOOTHILLS`, `STARS`, `JOY`, `HADES`],
    en_structure: `
      ............,
      .STARRYNIGHT,
      ............,
      .........F..,
      ..HADES..O..,
      .........O..,
      ....JOY..T..,
      .........H..,
      .........I..,
      .STARS...L..,
      .........L..,
      .........S..`,
  },
};
type Word = { id: string; letter: string };
export function WordSearch() {
  const [found, setFound] = useState<Word[][]>([]);
  const [selected, setSelected] = useState<Word[]>([]);
  const store = useStore();
  const router = useRouter();
  const locale = router.locale;
  const k = (locale + "_words") as "el_words" | "en_words";
  const words = normalize(wordOb[store.scene]?.[k]);
  const key = (locale + "_structure") as "el_structure" | "en_structure";

  const www = useMemo(
    () =>
      wordOb?.[store.scene]?.[key]?.split(",").map((e, i) =>
        e
          .split("")
          .map(norm)
          .map((e) => e.replace(/\n/g, ""))
          .filter((e) => e !== "")
          .map((e, j) => ({
            letter: e === "." ? r(locale) : e,
            id: `${i}${j}`,
          }))
      ),
    [locale, store.scene]
  );

  useEffect(() => {
    if (store.status === "RUNNING") {
      setFound([]);
      setSelected([]);
    }
  }, [store.status]);

  const { data: items } = useItems();
  const { data: inventory } = useInventory();
  const invHas = (id?: string) => inventory.map((e) => e._id).includes(id);
  useEffect(() => {
    const giveItem = items.find((e) => e.hidden);
    if (invHas(giveItem?._id)) {
      setFound(solved(words));
    }
  }, [items, inventory]);

  const giveItem = items.find((e) => e.hidden);

  const [_addItem] = useMutation(addItem, [
    `/api/inventory?scene=${store.scene}`,
  ]);

  const [_addReward] = useMutation(addReward, [
    `/api/inventory?epic=true`,
    `/api/items?scene=${store.scene}`,
  ]);

  const solve = () => {
    if (!giveItem) return;
    if (store.scene === "pp4_navagio") _addReward(giveItem as Reward);
    else {
      _addItem(giveItem._id);
    }
    store.setReward({
      _id: "sss",
      name: giveItem.name,
      src: giveItem.src,
      description:
        "Τοποθέτησε τον καθρέφτη για να δεις το διπλό καθρέφτισμα του Κέρβερου.",
      enDescription:
        "Place the mirror to see the double reflection of the Cervantes.",
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
  // const xx = store.scene === "teletourgeio" ? letters1 : letters;
  // const l = xx.length;
  const t = useT();
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
          {www?.map((word) =>
            word.map((letter, idx) => (
              <div
                key={letter.id}
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
            <p className="text-md font-bold">
              {t(
                store.scene === "pp4_navagio"
                  ? "wordsearch_title_pp4"
                  : "wordsearch_title_cerberus"
              )}
            </p>
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
              {/* <div
                onClick={() => {
                  setFound(solved(words));
                  solve();
                }}
                className="btn"
              >
                solve
              </div> */}
            </ul>
            <div className="divider"></div>
            <div className="bg-white  p-4 bg-opacity-10">
              <span className="w-full text-lg text-left  break-words">
                {t(
                  store.scene === "pp4_navagio"
                    ? "wordsearch_text_pp4"
                    : "wordsearch_text_cerberus"
                )
                  .split("nl")
                  .map((e, idx) => (
                    <div key={idx}>{e}</div>
                  ))}

                <br />
                <span className=" text-left ">
                  {t(
                    store.scene === "pp4_navagio"
                      ? "wordsearch_author_pp4"
                      : "wordsearch_author_cerberus"
                  )
                    .split("nl")
                    .map((e, idx) => (
                      <div key={idx}>{e}</div>
                    ))}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </MiniGameWrapper>
  );
}
