import { IMethodHandler } from "./IMethodHandler";
import { IMethodName } from "./IMethodName";

export type IRoute = {
  method: IMethodName;
  path: string;
  name?: string;
  handler: IMethodHandler;
};
