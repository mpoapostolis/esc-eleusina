import mapboxgl, { Map, Point } from "mapbox-gl";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import "mapbox-gl/dist/mapbox-gl.css";
import styles from "./index.module.css";
import clsx from "clsx";
import { useStore } from "../../store";
import useMutation from "../../Hooks/useMutation";
import { addReward } from "../../lib/inventory";
import MiniGameWrapper from "../MiniGameWrapper";

mapboxgl.accessToken =
  "pk.eyJ1IjoiZmFyYW5kb3VyaXNwIiwiYSI6ImNsOTZ3dzhpczBzNHg0MHFxZ211dGN3OGcifQ.wG1mCl8Bl26T-w2zFwYK8g";

const points = [
  {
    name: "Σκαραμαγκάς",
    bearing: 90,
    coords: {
      lng: 23.601992,
      lat: 38.005316,
      zoom: 12,
    },
    desc: `Διάσημα τα ναυπηγεία του - ανατολικά `,
  },
  {
    name: "Σαλαμίνα",
    bearing: 0,
    coords: {
      lat: 37.967521,
      lng: 23.472213,
      zoom: 12,
    },
    desc: `Νησί που συνδέεται με αρχαία ναυμαχία - δυτικά  `,
  },

  {
    name: "Σαρανταπόταμος",
    bearing: 0,
    coords: {
      lng: 23.597602,
      lat: 38.047757,
      zoom: 12,
    },
    desc: `Αλλιώς ο ποταμός Ελευσινιακός Κηφισσός - βόρεια `,
  },
  {
    name: "Σαρωνικός",
    bearing: 0,
    coords: {
      lng: 23.564024,
      lat: 37.891304,
      zoom: 12,
    },
    desc: `Ο Ελευσινιακός Κόλπος αποτελεί μικρότερο κομμάτι του -νότια `,
  },
];

export default function Compass() {
  const map = useRef<Map | null>(null);
  const [marker, setMarker] = useState<mapboxgl.Marker | null>(null);
  const r = useRef(null);

  useEffect(() => {
    if (map.current) return;
    setTimeout(() => {
      const initialMap = new mapboxgl.Map({
        container: "map",
        pitch: 0, // pitch in degrees
        center: {
          lng: 23.5061835,
          lat: 38.0,
        },
        style: "mapbox://styles/farandourisp/cl96wxlg300fn15qu2u22crjs",
        zoom: 12,
      });

      initialMap.on("load", () => {
        initialMap.addSource("mapbox-dem", {
          type: "raster-dem",
          url: "mapbox://mapbox.mapbox-terrain-dem-v1",
          tileSize: 512,

          maxzoom: 10,
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
    }, 1000);
    // initialize map only once
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
  const store = useStore();

  const [_addReward] = useMutation(addReward, [
    `/api/inventory?epic=true`,
    `/api/items?scene=${store.scene}`,
  ]);

  useEffect(() => {
    if (answers.north && answers.east && answers.west && answers.south) {
      store.setCompass(false);
      if (store.reward) {
        _addReward(store.reward);
        store.setReward(store.reward);
      }
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

  return (
    <MiniGameWrapper status="COMPASS">
      <div className="relative h-full w-full">
        <div id="map" className="w-full h-full" />

        <div className="absolute p-2 border border-dashed border-black items-center   w-96 h-96 right-0 bg-white bottom-0 rounded-full z-50  ">
          <div className="border relative  rounded-full w-full h-full  flex justify-center border-black items-center overflow-hidden">
            <div
              className={clsx(
                "grid absolute  gap-x-2 grid-cols-[20px_1fr_20px_1fr_20px] w-full"
              )}
            >
              <span className="flex justify-center items-center bg-black w-full">
                W
              </span>
              <input
                onFocus={() => {
                  setIdx(0);
                }}
                className="uppercase bg-gray-300 -scale-100 text-black outline-none w-full px-2"
              />
              <div className="text-4xl flex text-black items-center justify-center ">
                Σ
              </div>
              <input
                onFocus={() => {
                  setIdx(1);
                }}
                className="uppercase bg-gray-300 text-black outline-none w-full px-2"
              />
              <span className="flex justify-center items-center bg-black w-full">
                E
              </span>
            </div>

            <div
              className={clsx(
                "grid absolute  gap-x-2 grid-cols-[20px_1fr_20px_1fr_20px] w-full",
                {
                  " rotate-90": true,
                }
              )}
            >
              <span className="flex justify-center items-center bg-black w-full">
                N
              </span>
              <input
                onFocus={() => {
                  setIdx(2);
                }}
                className="uppercase bg-gray-300 -scale-100 text-black outline-none w-full px-2"
              />
              <div className="text-4xl opacity-0 flex items-center justify-center ">
                Σ
              </div>
              <input
                onFocus={() => {
                  setIdx(3);
                }}
                className="uppercase bg-gray-300  text-black outline-none w-full px-2"
              />
              <span className="flex justify-center items-center bg-black w-full">
                S
              </span>
            </div>
          </div>
        </div>

        <div className="absolute  bottom-0 left-0 z-0 bg-opacity-70 w-full p-10 bg-black   text-gray-400 text-3xl full items-center flex justify-left font-bold">
          <div className="w-2/4">{points[deg / 90].desc}</div>
        </div>
      </div>
    </MiniGameWrapper>
  );
}
