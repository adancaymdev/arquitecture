import type { IController } from "../../interfaces/http/IController";

export abstract class Controller implements IController {
  [methodName: string]: (...args: any[]) => Promise<void>;
}
