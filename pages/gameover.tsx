import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "../store";

export default function GameOver() {
  const store = useStore();
  useEffect(() => {
    store.setTimer(600);
    store.setScene("intro");
  }, []);
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-black">
      <h1 className="text-6xl font-extrabold text-white tracking-widest">
        Ο χρόνος σας έληξε
      </h1>
      <Link href="/">
        <button className="mt-5 w-full">
          <button className="btn w-72   btn-xl">Προσπαθήστε πάλι</button>
        </button>
      </Link>
    </main>
  );
}
