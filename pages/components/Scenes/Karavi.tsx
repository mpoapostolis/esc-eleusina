import { useStore } from "../../../store";
import Portal from "../Portal";

function Karavi() {
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
        onClick={() => store.setStage("livadi")}
        src="livadi"
        position={[0, 0, -10]}
      />
    </>
  );
}

Karavi.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Karavi;
