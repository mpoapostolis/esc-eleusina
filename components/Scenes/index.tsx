import { Scene, useStore } from "../../store";
import Intro from "./Intro";
import Teletourgeio from "./Teletourgeio";

const Component = (p: { scene: Scene }) => {
  switch (p.scene) {
    case "intro":
      return <Intro />;
    case "teletourgeio":
      return <Teletourgeio />;

    default:
      return <Intro />;
  }
};

function Scenes() {
  const store = useStore();
  return <Component scene={store.scene} />;
}

export default Scenes;
