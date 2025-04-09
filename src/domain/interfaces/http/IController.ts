import type { HttpRequest } from "@infrastructure/http/core/HttpRequest";
import type { HttpResponse } from "@infrastructure/http/core/HttpResponse";

/**
 * Interface that represents a controller. It is a class with methods that are
 * called by the server when a request is received.
 *
 * The methods of the controller must be marked as `async` to allow the use of
 * `await`.
 *
 * @example
 * class ExampleController implements IController {
 *   async getExample(req: HttpRequest, res: HttpResponse): Promise<void> {
 *     // Code to handle the request
 *   }
 * }
 */
export interface IController {
  [methodName: string]: (req: HttpRequest, res: HttpResponse) => Promise<void>;
}
