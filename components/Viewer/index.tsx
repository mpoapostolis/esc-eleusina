import { Viewer as V, Viewer as VType } from "photo-sphere-viewer";
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import "photo-sphere-viewer/dist/plugins/markers.css";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import React, { useEffect, useRef, useState } from "react";

export default function Viewer(props: { scene: string; markers: any[] }) {
  const [viewer, setViewer] = useState<VType>();
  const ref = useRef(null);
  useEffect(() => {
    if (!ref.current) return;
    const v = new V({
      container: ref.current,
      panorama: `/scenes/${props.scene}.jpg`,
      defaultZoomLvl: 0,

      plugins: [
        [
          MarkersPlugin,
          {
            markers: props.markers,
          },
        ],
      ],
    });
    setViewer(v);

    v.on("click", (e, d) => {
      console.log(d.latitude, d.longitude);
    });

    const markersPlugin = v.getPlugin(MarkersPlugin);
    markersPlugin?.on("select-marker", (e, marker, data) => {
      console.log(marker.config);
      // @ts-ignore
      if ("onclick" in marker?.config) marker?.config.onclick();
    });
    return () => {
      v.destroy();
    };

    // setViewer(v);
    // return () => {
    //   markersPlugin?.clearMarkers();
    //   v.destroy();
    // };
  }, []);
  useEffect(() => {
    if (!viewer) return;
    viewer.setPanorama(`/scenes/${props.scene}.jpg`, {});
    const markersPlugin = viewer.getPlugin(MarkersPlugin);
    markersPlugin?.clearMarkers();
    props.markers.map((m) => {
      markersPlugin?.addMarker(m);
    });
    markersPlugin?.on("select-marker", (e, marker, data) => {
      console.log(marker.config);
      // @ts-ignore
      if ("onclick" in marker?.config) marker?.config.onclick();
    });
  }, [props.scene, props.markers]);

  return <div ref={ref} className="w-screen h-screen" />;
}
