import { useStore } from "../../store";
import { useEffect } from "react";

import useSetHint from "../../Hooks/useSetHint";
import { EventEmitter } from "uevent";

function Intro() {
  const store = useStore();

  useEffect(() => {
    store.setScene("intro");
    setTimeout(
      () =>
        store.setMyMarkers([
          {
            onClick: () => {
              store.setInventory({
                name: "stone",
                src: "https://vr-next.vercel.app/images/stone.png",
              });
            },
            id: "marker-h8qiudbq1ba",
            name: "stone",
            imageLayer: "https://vr-next.vercel.app/images/stone.png",
            longitude: 5.717,
            latitude: -0.683,
            width: 128,
            height: 128,
            hide: store.invHas("stone"),
          },
          {
            onClick: () => store.setScene("elaiourgeio"),
            id: "marker-rfqd2q2h668",
            polygonRad: [
              [6.01, 0.356],
              [0.356, 0.325],
              [0.36, -0.295],
              [6.029, -0.359],
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

    // setTimeout(
    //   () =>
    //     store.setMyMarkers([
    //   1000
    // )];
  }, []);

  useSetHint("intro1");

  useEffect(() => {
    if (store.epicInvHas(`stone`)) store.setHint("portals");
  }, [store.epicInventory]);
  return <></>;
}

Intro.getInitialProps = () => {
  const statusCode = 404;
  return { statusCode };
};

export default Intro;
