import { useStore } from "../../../store";
import Img from "../Img";
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
