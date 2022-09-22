import MiniGameWrapper from "../MiniGameWrapper";

export function Clock() {
  const normalizeLexi = ["Ena", "duo"]?.map((s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toUpperCase()
  ) ?? [""];
  const groups = new Set<number>();
  normalizeLexi.map((e) => groups.add(e.length));
  return <MiniGameWrapper status="CLOCK">s</MiniGameWrapper>;
}
