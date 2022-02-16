import { Viewer, ViewerOptions, ViewerProps } from "photo-sphere-viewer";
import { MarkersPlugin } from "photo-sphere-viewer/dist/plugins/markers";
import { Component, ReactNode } from "react";

type P = {};

const conf: ViewerOptions = {
  container: "#viewer",
  defaultZoomLvl: 0,
  navbar: undefined,
  plugins: [[MarkersPlugin, { markers: [] }]],
};
const x = new Viewer(conf);

export default class _Viewer extends Component {
  viewer?: Viewer = undefined;
  constructor(props: P) {
    super(props);
  }
  componentDidMount() {}

  render(): ReactNode {
    return null;
  }
}
