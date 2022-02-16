import {
  MarkerProperties,
  MarkersPlugin,
} from "photo-sphere-viewer/dist/plugins/markers";
import "photo-sphere-viewer/dist/plugins/markers.css";
import "photo-sphere-viewer/dist/photo-sphere-viewer.css";
import React, { useEffect, useRef, useState } from "react";
import { useStore } from "../../store";
import { ImgName } from "../../utils/items";
import useConstant from "../../Hooks/useConstant";
import { Viewer } from "photo-sphere-viewer";

export type MyMarker = {
  selectable?: boolean;
  collectable?: boolean;
  name?: ImgName;
  onCollectError?: () => void;
  onCollectSucccess?: () => void;
  color?: string;
  hide?: boolean;
  opacity?: number;
  onClick?: () => void;
} & MarkerProperties;

export default function V() {
  const ref = useRef(null);
  const viewerRef = useRef<Viewer>(null);
  const store = useStore();
  const markersPlugin = viewerRef.current?.getPlugin(MarkersPlugin);

  useEffect(() => {
    if (!ref.current) return;
    const v = new Viewer({
      container: ref.current,
      defaultZoomLvl: 0,
      navbar: undefined,
      plugins: [[MarkersPlugin, { markers: [] }]],
    });
    viewerRef.current = v;
  }, []);

  useEffect(() => {
    if (!viewerRef.current) return;
    viewerRef.current?.setPanorama("/scenes/intro.jpg");
  }, [viewerRef.current]);
  useEffect(() => {
    if (!viewerRef.current) return;

    const markersPlugin = viewerRef.current?.getPlugin(MarkersPlugin);
    markersPlugin?.on("select-marker", (e, marker, data) => {
      if (marker?.config && "onClick" in marker?.config)
        // @ts-ignore
        marker?.config?.onClick();
    });
  }, []);
  useEffect(() => {
    if (!viewerRef.current) return;
    console.log("---");
    store.myMarkers?.map((m) => {
      markersPlugin?.addMarker(m);
    });
  }, [store.myMarkers]);

  useEffect(() => {
    if (!viewerRef.current) return;
    markersPlugin?.clearMarkers();
    viewerRef.current?.setPanorama(`/scenes/${store.scene}.jpg`);
  }, [viewerRef.current, store.scene]);

  return <div ref={ref} className="w-screen h-screen" />;
}
