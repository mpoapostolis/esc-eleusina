import { Scene, useStore } from "../../store";
import Intro from "./Intro";

const Component = (p: { scene: Scene }) => {
  switch (p.scene) {
    case "intro":
      return <Intro />;

    default:
      return <Intro />;
  }
};

function Scenes() {
  const store = useStore();
  return <Component scene={store.scene} />;
}

export default Scenes;
