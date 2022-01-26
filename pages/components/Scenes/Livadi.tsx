import { ReturnValue } from "use-timer/lib/types";
import { useStore } from "../../../store";
import Item from "../Item";
import Portals from "../Portals";

function Livadi() {
  return (
    <>
      <Portals />
    </>
  );
}

Livadi.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Livadi;
