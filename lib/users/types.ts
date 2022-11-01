import { Scene } from "../../store";

export type User = {
  _id: string;
  userName: string;
  scene: Scene;
  time?: number;
};
