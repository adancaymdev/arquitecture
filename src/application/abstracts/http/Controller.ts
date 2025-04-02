import { IController } from "../../interfaces/http/IController";
import { IRoute } from "../../interfaces/http/IRoute";

export abstract class Controller implements IController {
  [methodName: string]: (...args: any[]) => IRoute;
}
