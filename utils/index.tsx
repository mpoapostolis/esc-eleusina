export function loadSound(src: string) {
  return typeof window !== "undefined"
    ? new Audio(src)
    : {
        play: void 0,
        cancel: void 0,
        commitStyles: void 0,
        finish: void 0,
        pause: void 0,
        persist: void 0,
      };
}
