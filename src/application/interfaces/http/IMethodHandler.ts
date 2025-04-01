import { IRequest } from "./IRequest";
import { IResponse } from "./IResponse";

export type IMethodHandler = (req: IRequest, res: IResponse) => void;
