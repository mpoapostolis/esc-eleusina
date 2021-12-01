import { Scene, useStore } from "../../../store";
import JigSaw from "../JigSaw";
import Archeologikos from "./Archeologikos";
import Elaioyrgeio from "./Elaioyrgeio";
import Intro from "./Intro";
import Karavi from "./Karavi";
import Livadi from "./Livadi";

const Component = (p: { scene: Scene }) => {
  switch (p.scene) {
    case "intro":
      return <Intro />;
    case "karavi":
      return <Karavi />;
    case "elaioyrgeio":
      return <Elaioyrgeio />;
    case "livadi":
      return <Livadi />;
    case "archeologikos":
      return <Archeologikos />;
    case "jigSaw":
      return <JigSaw />;

    default:
      return <Intro />;
  }
};

function Scenes() {
  const store = useStore();
  return <Component scene={store.stage} />;
}

Scenes.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Scenes;
