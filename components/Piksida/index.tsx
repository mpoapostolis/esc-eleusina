import mapboxgl, { Map, Point } from "mapbox-gl";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./index.module.css";
import clsx from "clsx";
import { useStore } from "../../store";
import { loadSound } from "../../utils";
const win = loadSound("/sounds/win.wav");

mapboxgl.accessToken =
  "pk.eyJ1IjoibXBvYXBvc3RvbGlzYXBwIiwiYSI6ImNsMGt0NWEycTBwbWEzY205cmxjNjZuMjUifQ.PjvkTnV_Puw9hKmBQXVJBA";

const points = [
  {
    name: "Σκαραμαγκάς",
    bearing: 90,
    coords: {
      lng: 23.5890555,
      lat: 38.004808,
      zoom: 12,
    },
    desc: `Διάσημα τα ναυπηγεία του - ανατολικά `,
  },
  {
    name: "Σαλαμίνα",
    bearing: 0,
    coords: {
      lng: 23.5023259,
      lat: 37.9763449,
      zoom: 12,
    },
    desc: `Νησί που συνδέεται με αρχαία ναυμαχία - δυτικά  `,
  },

  {
    name: "Σαρανταπόταμος",
    bearing: 0,
    coords: {
      lng: 23.5061835,
      lat: 38.0282363,
      zoom: 12,
    },
    desc: `Αλλιώς ο ποταμός Ελευσινιακός Κηφισσός - βόρεια `,
  },
  {
    name: "Σαρωνικός",
    bearing: 0,
    coords: {
      lng: 23.5431423,
      lat: 37.979663,
      zoom: 12,
    },
    desc: `Ο Ελευσινιακός Κόλπος αποτελεί μικρότερο κομμάτι του -νότια `,
  },
];

export default function Piksida() {
  const mapContainer = useRef(null);
  const map = useRef<Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);

  useEffect(() => {
    if (map.current) return;
    // initialize map only once
    const initialMap = new mapboxgl.Map({
      container: "map",
      pitch: 0, // pitch in degrees
      center: {
        lng: 23.5061835,
        lat: 38.0,
      },
      style: "mapbox://styles/mpoapostolisapp/cl0qm3nwo00dk15n0fderkmw0",
      zoom: 12,
    });

    initialMap.on("load", () => {
      initialMap.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.mapbox-terrain-dem-v1",
        tileSize: 512,

        maxzoom: 11,
      });
      // add the DEM source as a terrain layer with exaggerated height
      initialMap.setTerrain({ source: "mapbox-dem", exaggeration: 1.5 });
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
    const marker = new mapboxgl.Marker({
      color: "color",
      scale: 1.2,
    }).setLngLat({
      lng: 0,
      lat: 0,
    });

    setMarker(marker);
    marker.addTo(initialMap);
    initialMap.addControl(new mapboxgl.NavigationControl(), "top-left");

    map.current = initialMap;
  });

  const flyTo = async (c: { lat: number; lng: number; zoom: number }) => {
    if (!map.current || !marker) return;
    marker.setLngLat({
      lat: c.lat,
      lng: c.lng,
    });

    map.current.easeTo({
      duration: 500,
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
    setDeg(i * 90);
  };

  const [deg, setDeg] = useState(0);
  const [answers, setAnswers] = useState({
    north: false,
    east: false,
    west: false,
    south: false,
  });

  useEffect(() => {
    if (answers.north && answers.east && answers.west && answers.south) {
      win?.play();
      store.setCompass(false);
      store.setEpicItem({
        name: "cerberous",
        scale: 1,
        src: "/images/cerberous.png",
        scene: "arxaiologikos",
      });
    }
  }, [answers]);

  const setPlace = (e: ChangeEvent<HTMLInputElement>) => {
    e.currentTarget.value = e.currentTarget.value.toUpperCase();
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;

    switch (name) {
      case "west":
        if (value === "ΑΡΑΝΤΑΠΟΤΑΜΟΣ")
          setAnswers((s) => ({ ...s, [name]: true }));
        break;
      case "south":
        if (value === "ΑΡΩΝΙΚΟΣ") setAnswers((s) => ({ ...s, [name]: true }));
        break;
      case "north":
        if (value === "ΑΛΑΜΙΝΑ") setAnswers((s) => ({ ...s, [name]: true }));
        break;
      case "east":
        if (value === "ΚΑΡΑΜΑΓΚΑΣ") setAnswers((s) => ({ ...s, [name]: true }));
        break;
    }
  };

  const rotateComapss = (idx: number) => {
    const p = points[idx];
    flyTo(p.coords);
    setIdx(idx);
  };
  const store = useStore();
  return (
    <div
      className={clsx(
        "fixed flex  items-center z-50 bg-opacity-80 bg-transparent border-b h-screen w-screen",
        {
          hidden: store.status !== "MODAL" || !store.compass,
        }
      )}
    >
      <div className="relative bg-black h-screen   m-auto  ">
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
                  <div
                    onClick={() => rotateComapss(2)}
                    className={clsx("flex rotate-180 ")}
                  >
                    <input
                      onFocus={() => rotateComapss(2)}
                      disabled={answers.west}
                      name="west"
                      onChange={setPlace}
                      className={clsx(
                        styles.input,
                        "bg-black bg-opacity-70 text-lg",
                        {
                          "opacity-0 ": deg !== 90 * 2,
                        }
                      )}
                    ></input>
                    <img
                      className={clsx(
                        "absolute right-0 top-2 rounded-full w-7",
                        {
                          hidden: !answers.west,
                        }
                      )}
                      src="https://s2.svgbox.net/hero-solid.svg?ic=check-circle&color=2a2"
                      alt=""
                    />
                  </div>

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

                  <div
                    onClick={() => rotateComapss(0)}
                    className={clsx("flex ")}
                  >
                    <input
                      autoFocus
                      onFocus={() => rotateComapss(0)}
                      disabled={answers.east}
                      name="east"
                      onChange={setPlace}
                      className={clsx(
                        styles.input,
                        "bg-black bg-opacity-70 text-lg",
                        {
                          "opacity-0 ": deg !== 90 * 0,
                        }
                      )}
                    ></input>
                    <img
                      className={clsx(
                        "absolute right-0 top-2 rounded-full w-7",
                        {
                          hidden: !answers.east,
                        }
                      )}
                      src="https://s2.svgbox.net/hero-solid.svg?ic=check-circle&color=2a2"
                      alt=""
                    />
                  </div>
                </div>

                <div className="flex w-full rotate-90 justify-center  absolute z-50 ">
                  <div
                    onClick={() => rotateComapss(1)}
                    className={clsx("flex rotate-180 ")}
                  >
                    <input
                      onFocus={() => rotateComapss(1)}
                      disabled={answers.north}
                      name="north"
                      onChange={setPlace}
                      className={clsx(
                        styles.input,
                        "bg-black bg-opacity-70 text-lg",
                        {
                          "opacity-0 ": deg !== 90 * 1,
                        }
                      )}
                    ></input>
                    <img
                      className={clsx(
                        "absolute right-0 top-2 rounded-full w-7",
                        {
                          hidden: !answers.north,
                        }
                      )}
                      src="https://s2.svgbox.net/hero-solid.svg?ic=check-circle&color=2a2"
                      alt=""
                    />
                  </div>
                  <div
                    onClick={() => rotateComapss(3)}
                    className={clsx("flex ml-10")}
                  >
                    <input
                      onFocus={() => rotateComapss(3)}
                      disabled={answers.south}
                      name="south"
                      onChange={setPlace}
                      className={clsx(
                        styles.input,
                        "bg-black bg-opacity-70 text-lg",
                        {
                          "opacity-0 ": deg !== 90 * 3,
                        }
                      )}
                    ></input>
                    <img
                      className={clsx(
                        "absolute right-0 top-2 rounded-full w-7",
                        {
                          hidden: !answers.south,
                        }
                      )}
                      src="https://s2.svgbox.net/hero-solid.svg?ic=check-circle&color=2a2"
                      alt=""
                    />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => store.setCompass(false)}
              className="fixed text-gray-800 font-  w-10 h-10 flex items-center justify-center rounded-full  border border-gray-300 bg-white shadow-lg  top-0 right-0 z-0 bg-opacity-70 m-3 text-xl"
            >
              ✖
            </button>

            <div className="fixed bottom-0 left-0 z-0 bg-opacity-70 w-full p-10 bg-black   text-gray-400 text-3xl full items-center flex justify-left font-bold">
              <div className="w-2/4">{points[deg / 90].desc}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
