import axios from "axios";
import { useEffect, useState } from "react";

export default function Library(p: { setLibrary: () => void }) {
  const [f, setF] = useState<File>();

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (!f) return;
    toBase64(f).then((d) => {
      const [_, data] = `${d}`.split("base64,");
      axios.post("/api/upload", { data });
    });
  }, [f]);
  return (
    <div className="w-screen h-screen flex flex-row-reverse  bg-black fixed z-50 bg-opacity-90">
      <div className="">a</div>
      <div className=" text-gray-300 mt-auto flex flex-col overflow-auto pointer-events-auto border-l px-10 py-5 border-gray-600 w-96 h-screen">
        <label
          role="button"
          className="w-full cursor-pointer px-3 py-2 text-center bg-white bg-opacity-20"
          htmlFor="files"
        >
          Select Image
        </label>

        <input
          id="files"
          type="file"
          onChange={(f) => {
            if (f.target.files) setF(f.target.files[0]);
          }}
          className="hidden"
        />
        <hr className="my-5 opacity-50" />
        {f && (
          <img
            onClick={() => setF(undefined)}
            src={URL.createObjectURL(f)}
            alt=""
          />
        )}
        <br />
        <div className="grid mt-auto  grid-cols-2 gap-2">
          <button
            onClick={() => p.setLibrary()}
            className="w-full px-3 py-2 text-center bg-white bg-opacity-20"
          >
            back
          </button>

          <button
            onClick={() => {
              axios.post("/api/upload", {});
            }}
            className="mt-auto w-full px-3 py-2 text-center bg-white bg-opacity-20"
          >
            save{" "}
          </button>
        </div>
      </div>
    </div>
  );
}
