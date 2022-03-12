// eslint-disable-line import/no-webpack-loader-syntax
// @ts-ignore
import mapboxgl, { Map, Point } from "mapbox-gl";
import { useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./index.module.css";
import clsx from "clsx";

mapboxgl.accessToken =
  "pk.eyJ1IjoibXBvYXBvc3RvbGlzYXBwIiwiYSI6ImNsMGt0NWEycTBwbWEzY205cmxjNjZuMjUifQ.PjvkTnV_Puw9hKmBQXVJBA";

const points = [
  {
    name: "Σκαραμαγκάς",
    bearing: 90,
    pitch: 70,
    coords: {
      lng: 23.5890555,
      lat: 38.004808,
      zoom: 15,
    },
    desc: `Διάσημα τα ναυπηγεία του - ανατολικά `,
  },
  {
    name: "Σαλαμίνα",
    bearing: 0,
    pitch: 60,
    coords: {
      lng: 23.5023259,
      lat: 37.9763449,
      zoom: 13,
    },
    desc: `Νησί που συνδέεται με αρχαία ναυμαχία - δυτικά  `,
  },

  {
    name: "Σαρανταπόταμος",
    bearing: 0,
    pitch: 60,
    coords: {
      lng: 23.5061835,
      lat: 38.0282363,
      zoom: 14,
    },
    desc: `Αλλιώς ο ποταμός Ελευσινιακός Κηφισσός - βόρεια `,
  },
  {
    name: "Σαρωνικός",
    bearing: 0,
    pitch: 60,
    coords: {
      lng: 23.5431423,
      lat: 37.979663,
      zoom: 14,
    },
    desc: `Ο Ελευσινιακός Κόλπος αποτελεί μικρότερο κομμάτι του -νότια `,
  },
];

export default function Piksida() {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);

  useEffect(() => {
    if (map.current) return;
    // initialize map only once
    const initialMap = new mapboxgl.Map({
      container: "map",
      pitch: 0, // pitch in degrees
      style: "mapbox://styles/mpoapostolisapp/cl0l2qd4g009p15ql3of8ktpb",
      center: [23.5275785, 38.0208724],
      zoom: 11,
    });

    initialMap.on("load", () => {
      initialMap.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,
        maxzoom: 14,
      });
      // add the DEM source as a terrain layer with exaggerated height
      initialMap.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });

      // add a sky layer that will show when the initialMap is highly pitched
      initialMap.addLayer({
        id: "sky",
        type: "sky",
        paint: {
          "sky-type": "atmosphere",
          "sky-atmosphere-sun": [0.0, 0.0],
          "sky-atmosphere-sun-intensity": 15,
        },
      });
    });

    points.forEach((c) => {
      const popup = new mapboxgl.Popup({
        offset: 25,
        focusAfterOpen: true,
      }).setText(c.desc);
      new mapboxgl.Marker()
        .setLngLat(c.coords)
        .setPopup(popup)
        .addTo(initialMap);
    });

    initialMap.addControl(new mapboxgl.NavigationControl());
    initialMap.on("click", console.log);

    map.current = initialMap;
  });

  const flyTo = async (
    c: { lat: number; lng: number; zoom: number },
    bearing: number,
    pitch: number
  ) => {
    if (!map.current) return;
    map.current.easeTo({
      bearing: bearing,
      duration: 500,
      pitch: pitch,
      center: {
        lat: c.lat,
        lng: c.lng,
      },
      zoom: c.zoom,
      easing: (x) => x,
    });
  };
  const setIdx = (i: number) => {
    if (!map.current) return;
    console.log(i, deg);
    setDeg((s) => i * 90);
  };

  const [deg, setDeg] = useState(0);

  return (
    <div className="fixed flex  items-center z-50 bg-opacity-80 bg-transparent border-b h-screen w-screen">
      <div className="relative bg-black h-screen  m-auto  w-full">
        <div
          className=" rounded w-screen h-screen z-0"
          id="map"
          ref={mapContainer}
        >
          <div
            style={{ zIndex: 9999 }}
            className="absolute bottom-0 right-0 z-50 max-w-lg w-full items-center justify-between flex-col md:m-5"
          >
            <div className={styles.take}>
              <div className={styles.ring}></div>
            </div>
            <div
              className={clsx(
                styles.compass,
                "relative w-full p-4 flex items-center"
              )}
            >
              <div
                style={{
                  transform: `rotate(${deg}deg)`,
                }}
                className={clsx(
                  styles.panel,
                  "w-full overflow-hidden aspect-square duration-1000  flex items-center justify-center relative rounded-full"
                )}
              >
                <div className="w-full rounded-full h-full relative">
                  <img
                    className="relative right-3"
                    src="/images/compass.svg"
                    alt=""
                  />
                  {[...Array(24).fill("")].map((_, idx) => (
                    <div
                      key={idx}
                      style={{
                        top: "50%",
                        transform: `rotate(${idx * 7.5}deg)`,
                      }}
                      className={clsx(
                        styles.r,
                        "top-5 border-b   opacity-10  w-full absolute"
                      )}
                    />
                  ))}
                </div>

                <div className="flex w-full justify-center absolute z-50 ">
                  <input
                    onFocus={() => {
                      const p = points[2];
                      flyTo(p.coords, p.bearing, p.pitch);
                      setIdx(2);
                    }}
                    className={clsx(styles.input, "rotate-180 ")}
                  ></input>

                  <div
                    style={{
                      transform: `rotate(${-deg}deg)`,
                    }}
                    className={clsx(
                      "duration-300  flex justify-center items-center",
                      styles.textShadow
                    )}
                  >
                    Σ
                  </div>

                  <input
                    onFocus={() => {
                      const p = points[0];
                      flyTo(p.coords, p.bearing, p.pitch);
                      setIdx(0);
                    }}
                    className={clsx(styles.input, " ")}
                  ></input>
                </div>

                <div className="flex w-full rotate-90 justify-center  absolute z-50 ">
                  <input
                    onFocus={() => {
                      const p = points[1];
                      flyTo(p.coords, p.bearing, p.pitch);
                      setIdx(1);
                    }}
                    className={clsx(styles.input, " rotate-180 ")}
                  ></input>
                  <input
                    onFocus={() => {
                      const p = points[3];
                      flyTo(p.coords, p.bearing, p.pitch);
                      setIdx(3);
                    }}
                    className={clsx(styles.input, "ml-10")}
                  ></input>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-0 left-0 z-0 bg-opacity-70 w-full p-10 bg-black   text-gray-400 text-3xl full items-center flex justify-left font-bold">
            <div className="w-2/4">{points[deg / 90].desc}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
