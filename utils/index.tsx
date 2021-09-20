export function loadSound(src: string) {
  return typeof window !== "undefined"
    ? new Audio(src)
    : {
        play: () => 0,
      };
}
