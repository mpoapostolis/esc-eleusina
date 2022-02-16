import { useStore } from "../../store";
import { useEffect } from "react";

import useSetHint from "../../Hooks/useSetHint";

function Elaiourgeio() {
  const store = useStore();

  useEffect(() => {
    setTimeout(
      () =>
        store.setMyMarkers([
          {
            onClick: () => store.setScene("intro"),
            id: "marker-rfqd2q2h635",
            polygonRad: [
              [5.252, 0.333],
              [5.91, 0.51],
              [5.94, -0.582],
              [5.271, -0.393],
            ],

            svgStyle: {
              fill: "#ffff0045",
              stroke: "#00000000",
              strokeWidth: "2",
            },
          },
        ]),
      1000
    );
  }, []);

  useSetHint("intro1");

  useEffect(() => {
    if (store.epicInvHas(`stone`)) store.setHint("portals");
  }, [store.epicInventory]);
  return <></>;
}

export default Elaiourgeio;
