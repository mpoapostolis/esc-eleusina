import clsx from "clsx";
import Link from "next/link";
import { useRouter } from "next/router";
import { useRef } from "react";
import MenuItem from "../../components/MenuItem";
import useMutation from "../../Hooks/useMutation";
import { useItems } from "../../lib/items";
import { updateUser } from "../../lib/users";
import { scenes, useStore } from "../../store";

export default function Menu() {
  const store = useStore();
  const ref = useRef<HTMLAudioElement>(null);
  const { data: items } = useItems("intro");
  const router = useRouter();
  const [_updateUser] = useMutation(updateUser, ["/api/auth"], {
    onSuccess: (data) => {
      router.push("/");
    },
  });
  return (
    <div className="flex justify-center items-center w-screen h-screen bg-black bg-opacity-50">
      <audio ref={ref} src={`/sounds/${store.sound ?? `01_click`}.wav`} />

      <div className="grid container  gap-y-3 w-full p-5">
        <img
          className="w-28 mx-auto h-28 mb-12 "
          src="https://s2.svgbox.net/materialui.svg?ic=account_circle&color=fff9"
          alt=""
        />
        <div className="grid gap-4 grid-cols-4">
          {scenes.map((item) => (
            <img
              key={item}
              onClick={() => _updateUser({ scene: item })}
              role="button"
              className={clsx("w-full", {
                // "opacity-20 cursor-not-allowed": true,
              })}
              id={item}
              src={`/scenes/${item}.jpg`}
              alt=""
            />
          ))}
        </div>
      </div>
    </div>
  );
}
