import { IRoute } from "./IRoute";

export interface IController {
  [key: string]: () => IRoute;
}
