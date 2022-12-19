import Link from "next/link";
import { useEffect } from "react";
import { useStore } from "../store";

export default function GameOver() {
  const store = useStore();
  return (
    <main className="h-screen w-full flex flex-col justify-center items-center bg-black">
      <h1 className="text-6xl font-extrabold text-white tracking-widest">
        Συγχαρητήρια 🎉🎉🎉🎉🎉🎉🎉
      </h1>
      <br />
      <form action="/api/auth?type=reset" method="POST">
        <a className="mt-5 w-full">
          <button className="btn w-72   btn-xl">Παίξε πάλι</button>
        </a>
      </form>
    </main>
  );
}
