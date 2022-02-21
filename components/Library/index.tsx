import axios from "axios";
import { useEffect, useState } from "react";

export default function Library(p: { setLibrary: () => void }) {
  const [f, setF] = useState<File>();
  const [imgs, setImgs] = useState<string[]>();

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/assets_conf.json"
      )
      .then((d) => setImgs(d.data.assets));
  }, []);
  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  useEffect(() => {
    if (!f) return;
    const [_, type] = f.type.split("/");
    toBase64(f).then((d) => {
      const [_, data] = `${d}`.split("base64,");
      axios.post("/api/upload", { data, type });
    });
  }, [f]);
  return (
    <div className="w-screen h-screen flex   bg-black fixed z-50 bg-opacity-90">
      <div className="container grid grid-cols-3 gap-3 py-4 px-10">
        {imgs?.map((str) => (
          <img
            src={`https://raw.githubusercontent.com/mpoapostolis/escape-vr/main/public/${str}`}
            key={str}
          />
        ))}
      </div>
      <div className=" text-gray-300 mt-auto flex flex-col overflow-auto pointer-events-auto border-l px-10 py-5 border-gray-600 w-96 h-screen">
        <label
          role="button"
          className="w-full cursor-pointer px-3 py-2 text-center bg-white bg-opacity-20"
          htmlFor="files"
        >
          Select Image
        </label>

        <input
          accept="jpg, .jpeg, .png"
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
              if (!f) return;
              const [_, type] = f.type.split("/");
              toBase64(f).then((d) => {
                const [_, data] = `${d}`.split("base64,");
                axios.post("/api/upload", { data, type }).then((d) => {
                  console.log(d.data);
                });
              });
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
