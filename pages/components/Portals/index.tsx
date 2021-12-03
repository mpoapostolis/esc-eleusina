import { Scene, useStore } from "../../../store";
import Portal from "../Portal";

const stages: Scene[] = [
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
      {stages
        .filter((s) => s !== store.stage)
        .map((s, idx) => (
          <Portal
            key={s}
            onPointerLeave={() => {
              store.setDialogue([]);
            }}
            onClick={() => {
              store.setDialogue([]);
              store.setStage(s);
            }}
            src={s}
            position={[-20 + idx * 10, 0, -20]}
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
