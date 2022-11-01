import Link from "next/link";

export default function Login() {
  return (
    <>
      <section
        style={{
          backgroundImage: `url(/scenes/pp0_xorafi.jpg)`,
          backgroundSize: "100% 100%",
        }}
        className="h-screen flex flex-col justify-around w-screen overflow-hidden"
      >
        <div className=" w-full pl-4 py-4 bg-black bg-opacity-50">
          <h1 className=" text-3xl font-bold text-white">Στοιχεία χρήστη</h1>
        </div>

        <div className=" w-full mt- pl-4 py-4 bg-gray-300 text-center bg-opacity-70">
          <h1 className=" text-2xl font-bold text-white drop-shadow ">xxx</h1>
        </div>

        <div className=" w-full mt- pl-4 py-4 flex justify-end ">
          <Link href="/step-2">
            <a className="bg-gray-300 px-8 py-4 mr-8 rounded-xl border border-dashed border-white  text-center bg-opacity-70 text-2xl font-bold text-white drop-shadow ">
              Θα γίνεις και εσυ ένας μύστης
            </a>
          </Link>
        </div>
      </section>
    </>
  );
}
