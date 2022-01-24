import { ReturnValue } from "use-timer/lib/types";
import Portals from "../Portals";

function Karavi() {
  return (
    <>
      <Portals />
    </>
  );
}

Karavi.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Karavi;
