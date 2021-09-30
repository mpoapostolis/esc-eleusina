import { useStore } from "../../../store";
import Portal from "../Portal";

function Livadi() {
  const store = useStore();
  return (
    <>
      <Portal
        onClick={() => store.setStage("archeologikos")}
        src="archeologikos"
        position={[10, 0, 0]}
      />
      <Portal
        onClick={() => store.setStage("elaioyrgeio")}
        src="elaioyrgeio"
        position={[-10, 0, 0]}
      />
      <Portal
        onClick={() => store.setStage("intro")}
        src="intro"
        position={[0, 0, 10]}
      />
      <Portal
        onClick={() => store.setStage("intro")}
        src="intro"
        position={[0, 0, -10]}
      />
    </>
  );
}

Livadi.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Livadi;
