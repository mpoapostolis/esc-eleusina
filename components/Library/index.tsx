import axios from "axios";
import clsx from "clsx";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Img } from "../../pages/admin";

export default function Library() {
  const [imgs, setImgs] = useState<Img[]>([]);
  const [name, setName] = useState<string>();
  const getImages = () =>
    axios.get("/api/library").then((d) => {
      setImgs(d.data);
    });

  useEffect(() => {
    getImages();
  }, []);

  const toBase64 = (file: File) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  const [load, setLoad] = useState(false);
  const router = useRouter();
  const imgId = router.query.imgId;
  const selectedImg = imgs?.find((e) => e._id === imgId);
  const update = async () => {
    setLoad(true);
    await axios.put(`/api/library/${imgId}`, { name });
    await getImages();
    setLoad(false);
  };

  useEffect(() => {
    setName(selectedImg?.name);
  }, [selectedImg]);

  return (
    <div className="w-screen h-screen flex   bg-black fixed z-50 bg-opacity-90">
      <div className="w-full overflow-auto">
        <div className="grid  items-center   2xl:grid-cols-7 xl:grid-cols-5 lg:grid-cols-4  md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-8 py-4 px-10 ">
          {imgs?.map((img) => (
            <div
              onClick={() =>
                router.push({
                  query: {
                    type: "library",
                    imgId: img._id,
                  },
                })
              }
              key={img._id}
              className={clsx(
                "relative flex cursor-pointer items-center justify-center  p-4 border border-gray-600",
                {
                  "border-green-300 bg-green-300 bg-opacity-20":
                    img._id === imgId,
                }
              )}
            >
              <img className="w-20 h-20" src={img.src} key={img.src} />
              <div className="text-white text-xs absolute bottom-0 text-center w-full bg-black bg-opacity-30">
                {img.name}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="text-gray-300 mt-auto flex flex-col overflow-auto pointer-events-auto border-l px-10 py-5 border-gray-600 w-96 h-screen">
        <div className="flex">
          <button className="mr-auto" onClick={() => router.push("/admin")}>
            <img
              src="https://s2.svgbox.net/materialui.svg?ic=arrow_back&color=888"
              width="32"
              height="32"
            />
          </button>
          {imgId && (
            <button
              className="mr-4"
              onClick={async () => {
                router.push("/admin?type=library");
                await axios.delete(`/api/library/${imgId}`);
                await getImages();
              }}
            >
              <img
                src="https://s2.svgbox.net/materialui.svg?ic=delete&color=a88"
                width="32"
                height="32"
              />
            </button>
          )}

          <button onClick={() => update()}>
            {load ? (
              <svg
                role="status"
                className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            ) : (
              <img
                src="https://s2.svgbox.net/materialui.svg?ic=save&color=777"
                width="32"
                height="32"
              />
            )}
          </button>
        </div>
        <hr className="my-5 opacity-20" />
        {selectedImg && (
          <>
            <input
              value={name}
              onChange={(evt) => setName(evt.currentTarget.value)}
              placeholder="Name"
              className="text-sm  block mb-4 bg-transparent w-full focus:outline-none h-10 p-2 border border-gray-600"
            />
            <img
              className="border border-gray-600 bg-white bg-opacity-5 rounded p-5"
              src={selectedImg.src}
              alt=""
            />
          </>
        )}
        <br />

        <div className="grid mt-auto gap-2">
          <label
            role="button"
            className="w-full flex justify-center py-2 cursor-pointer items-center  text-center bg-white bg-opacity-20"
            htmlFor="files"
          >
            {load && (
              <svg
                role="status"
                className="mr-2 w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            Select Image
          </label>

          <input
            id="files"
            type="file"
            onChange={(files) => {
              if (files.target.files) {
                const f = files.target.files[0];
                if (!f) return;
                const [_, type] = f.type.split("/");
                setLoad(true);
                toBase64(f).then((d) => {
                  const [_, data] = `${d}`.split("base64,");
                  axios.post("/api/upload", { data, type }).then((d) => {
                    router.push({
                      query: {
                        type: "library",
                        imgId: d.data.id,
                      },
                    });
                    getImages();
                    setLoad(false);
                  });
                });
              }
            }}
            className="hidden"
          />
        </div>
      </div>
    </div>
  );
}
