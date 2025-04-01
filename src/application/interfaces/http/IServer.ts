import { IController } from "./IController";

export interface IServer {
  listen(port: number): Promise<void>;
  addController(...controllers: IController[]): void;
}
