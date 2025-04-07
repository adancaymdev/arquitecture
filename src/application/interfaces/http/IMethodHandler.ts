import type { IRequest } from "./IRequest";
import type { IResponse } from "./IResponse";

/**
 * Represents a method handler, which is a function that handles a request and
 * sends a response.
 * @param req - The request object.
 * @param res - The response object.
 */
export type IMethodHandler = (req: IRequest, res: IResponse) => void;
