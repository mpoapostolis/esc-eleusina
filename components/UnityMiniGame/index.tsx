import clsx from "clsx";
import { useEffect } from "react";
import Unity, { UnityContext } from "react-unity-webgl";
import { useStore } from "../../store";

const getUnity = (s?: string) =>
  s
    ? new UnityContext({
        loaderUrl: `/unity/${s}.loader.js`,
        dataUrl: `/unity/${s}.data.unityweb`,
        frameworkUrl: `/unity/${s}.framework.js.unityweb`,
        codeUrl: `/unity/${s}.wasm.unityweb`,
      })
    : null;

export default function UnityMiniGame() {
  const store = useStore();
  const unityContext = getUnity(store.unity);

  const win = () => {
    if (!store.reward) return;
    store.setStatus("RUNNING");
    store.setUnity(undefined, undefined);
    store.setEpicItem(store.reward);
  };

  useEffect(() => {
    if (!unityContext) return;
    unityContext.on("Win", win);
  }, [unityContext]);

  return (
    <div
      className={clsx(
        "fixed w-screen h-screen z-50 flex bg-black bg-opacity-50  items-center justify-center",
        {
          hidden: store.status !== "UNITY",
        }
      )}
    >
      <img
        onClick={() => {
          store.setStatus("RUNNING");
          store.setUnity(undefined);
        }}
        src="https://s2.svgbox.net/materialui.svg?ic=close&color=fff9"
        role="button"
        className=" w-12 m-5 h-12 z-50 pointer-events-auto absolute right-0 top-0"
      />
      {unityContext && (
        <Unity
          style={{
            width: "60%",
            height: "75%",
          }}
          className="border-dashed border-black border-2 w-full h-full"
          unityContext={unityContext}
        />
      )}
    </div>
  );
}
