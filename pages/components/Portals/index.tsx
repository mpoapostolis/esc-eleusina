import { Scene, useStore } from "../../../store";
import Portal from "../Portal";

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
          <Portal
            key={s}
            onPointerLeave={() => {
              store.setDialogue([]);
            }}
            onClick={() => {
              store.setDialogue([]);
              store.setScene(s);
            }}
            src={s}
            position={[-20 + idx * 10, 0, -20]}
          />
        ))}
    </group>
  );
}

export default Portals;
