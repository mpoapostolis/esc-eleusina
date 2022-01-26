import { Scene, useStore } from "../../../store";
import Archeologikos from "./Archeologikos";
import Teletourgeio from "./Teletourgeio";
import Elaioyrgeio from "./Elaioyrgeio";
import Intro from "./Intro";
import Karavi from "./Karavi";
import Livadi from "./Livadi";
import Karnagio from "./Karnagio";

const Component = (p: { scene: Scene }) => {
  switch (p.scene) {
    case "intro":
      return <Intro />;
    case "karnagio":
      return <Karnagio />;

    case "teletourgeio":
      return <Teletourgeio />;

    case "karavi":
      return <Karavi />;
    case "elaioyrgeio":
      return <Elaioyrgeio />;
    case "livadi":
      return <Livadi />;
    case "archeologikos":
      return <Archeologikos />;

    default:
      return <Intro />;
  }
};

function Scenes() {
  const store = useStore();

  return <Component scene={store.scene} />;
}

Scenes.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Scenes;
