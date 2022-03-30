export function loadSound(src: string) {
  return typeof window !== "undefined"
    ? new Audio(src)
    : {
        play: () => 0,
        cancel: void 0,
        commitStyles: void 0,
        finish: void 0,
        pause: void 0,
        persist: void 0,
      };
}

export const randomNum = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const loremIpsum = `Με τον όρο Lorem ipsum αναφέρονται τα κείμενα εκείνα τα οποία είναι ακατάληπτα, δεν μπορεί δηλαδή κάποιος να βγάλει κάποιο λογικό νόημα από αυτά, και έχουν δημιουργηθεί με σκοπό να παρουσιάσουν στον αναγνώστη μόνο τα γραφιστικά χαρακτηριστικά, αυτά καθ' εαυτά, ενός κειμένου`;

export type ImgName =
  | "scythe"
  | "doxeio1"
  | "doxeio2"
  | "emoji"
  | "dafni"
  | "book"
  | "stone"
  | "box"
  | "case"
  | "flower"
  | "garbage"
  | "key"
  | "lingerie"
  | "rock1"
  | "rock"
  | "wing1"
  | "dog"
  | "mirror1"
  | "mirror2"
  | "wing";

export const images: {
  name: ImgName;
  src: string;
}[] = [
  { name: "scythe", src: "/images/scythe.png" },
  {
    name: "case",
    src: "/images/case.png",
  },
  {
    name: "flower",
    src: "/images/flower.png",
  },
  {
    name: "garbage",
    src: "/images/garbage.png",
  },
  {
    name: "key",
    src: "/images/key.png",
  },
  {
    name: "lingerie",
    src: "/images/lingerie.png",
  },
  {
    name: "rock1",
    src: "/images/rock1.png",
  },
  {
    name: "rock",
    src: "/images/rock.png",
  },
  {
    name: "wing1",
    src: "/images/wing1.png",
  },
  {
    name: "wing",
    src: "/images/wing.png",
  },
  {
    name: "stone",
    src: `/images/stone.png`,
  },
  {
    name: "doxeio1",
    src: `/images/doxeio1.png`,
  },
  {
    name: "doxeio2",
    src: `/images/doxeio2.png`,
  },
  {
    name: "emoji",
    src: "/images/emoji.png",
  },
  {
    name: "dafni",
    src: "/images/flower.png",
  },
  {
    name: "book",
    src: "/images/book.png",
  },
  {
    name: "box",
    src: "/images/woodenBox.png",
  },
  {
    name: "dog",
    src: "/images/dog.png",
  },
  {
    name: "mirror1",
    src: "/images/mirror1.png",
  },
  {
    name: "mirror2",
    src: "/images/mirror2.png",
  },
];

export const intersection = (arr1: unknown[], arr2: unknown[]) =>
  arr1.filter((x) => arr2.includes(x));
