import Link from "next/link";

export default function GameOver() {
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
