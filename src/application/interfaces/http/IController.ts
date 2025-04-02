import { IRoute } from "./IRoute";

export interface IController {
  [methodName: string]: (...args: any[]) => IRoute;
}
