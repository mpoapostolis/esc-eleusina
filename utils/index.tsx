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
