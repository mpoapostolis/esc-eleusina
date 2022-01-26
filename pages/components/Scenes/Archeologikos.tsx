import { useEffect, useState } from "react";
import { descriptiveText, helps, useStore } from "../../../store";
import Item from "../Item";

function Archeologikos() {
  const store = useStore();
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    store.setHint("archeologikos1");
    setTimeout(() => {
      store.setDescriptiveText(descriptiveText.teletourgeio);
    }, 2000);
  }, []);

  return <group></group>;
}

Archeologikos.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Archeologikos;
