import { Scene } from "../../store";

export type User = {
  _id: string;
  test?: boolean;
  userName: string;
  scene: Scene;
  time?: number;
};
