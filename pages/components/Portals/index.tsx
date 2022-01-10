import { Scene, useStore } from "../../../store";
import Exit from "../Exit";

const scenes: Scene[] = [
  "archeologikos",
  "intro",
  "elaioyrgeio",
  "karavi",
  "livadi",
];
function Portals() {
  const store = useStore();
  return (
    <group>
      {scenes
        .filter((s) => s !== store.scene)
        .map((s, idx) => (
          <Exit key={s} scene={s} position={[-20 + idx * 10, 0, -50]} />
        ))}
    </group>
  );
}

Portals.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Portals;
