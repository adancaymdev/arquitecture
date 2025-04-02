import { IController } from "./IController";

export interface IServer {
  listen(): Promise<void>;
  addController(...controllers: IController[]): void;
}
