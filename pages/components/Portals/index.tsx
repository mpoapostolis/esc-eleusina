import { HelpKey, Scene, useStore } from "../../../store";
import Exit from "../Exit";

const scenes: {
  scene: string;
  key: HelpKey;
}[] = [
  {
    scene: "teletourgeio",
    key: "archPortalHover",
  },
  {
    scene: "karnagio",
    key: "karnagioPortalHover",
  },
];
function Portals() {
  const store = useStore();
  return (
    <group>
      {scenes
        .filter((e) => e.scene !== store.scene)
        .map((s, idx) => (
          <Exit
            hover={s.key}
            key={idx}
            scene={s.scene as Scene}
            position={[-20 + idx * 10, 0, -50]}
          />
        ))}
    </group>
  );
}

Portals.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Portals;
