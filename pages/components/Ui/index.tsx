import { useCountdown } from "rooks";

const endTime = new Date(Date.now() + 1000 * 60);
export default function Ui() {
  const count = useCountdown(endTime, {
    interval: 1000,
    onDown: () => console.log("onDown"),
    onEnd: () => console.log("onEnd"),
  });
  return (
    <div className="fixed pointer-events-none z-50 p-3 h-screen w-screen">
      <div className="stroke text-white drop-shadow-2xl text-5xl">
        <div className="">Time: {count}</div>
      </div>
    </div>
  );
}
