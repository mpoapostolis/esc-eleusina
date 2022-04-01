import clsx from "clsx";
import Unity, { UnityContext } from "react-unity-webgl";
import { useStore } from "../../store";

export default function UnityMiniGame() {
  const store = useStore();

  const unityContext = new UnityContext({
    loaderUrl: `/unity/cerberus/myunityapp.loader.js`,
    dataUrl: `/unity/cerberus/myunityapp.data.unityweb`,
    frameworkUrl: `/unity/cerberus/myunityapp.framework.js.unityweb`,
    codeUrl: `/unity/cerberus/myunityapp.wasm.unityweb`,
  });
  return (
    <div
      className={clsx(
        "fixed w-screen h-screen z-50 flex bg-black bg-opacity-50  items-center justify-center",
        {
          hidden: store.status !== "UNITY",
        }
      )}
    >
      <Unity
        style={{
          width: "60%",
          height: "75%",
        }}
        className="border-dashed border-black border-2 w-full h-full"
        unityContext={unityContext}
      />
      ;
    </div>
  );
}
