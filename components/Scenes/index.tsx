import { Scene, useStore } from "../../store";
import Intro from "./Intro";
import Elaiourgeio from "./Elaiourgeio";
import { useState } from "react";

const Component = (p: { scene: Scene }) => {
  switch (p.scene) {
    case "intro":
      return <Intro />;
    case "elaiourgeio":
      return <Elaiourgeio />;

    default:
      return <Intro />;
  }
};

function Scenes() {
  const store = useStore();
  return <Component scene={store.scene} />;
}

export default Scenes;
