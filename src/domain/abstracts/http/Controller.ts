import { type IController } from "@application/interfaces/http/IController";
import type { HttpRequest } from "@infrastructure/http/HttpRequest";
import type { HttpResponse } from "@infrastructure/http/HttpResponse";

/**
 * Abstract class to define a controller. It implements the {@link IController} interface.
 * Each method of the controller must return a Promise that resolves to void.
 * The methods of the controller will be called with the request and response objects as arguments.
 * The methods must be marked as `async` to allow the use of `await`.
 *
 * @example
 * class ExampleController extends Controller {
 *   async getExample(req: HttpRequest, res: HttpResponse): Promise<void> {
 *     // Code to handle the request
 *   }
 * }
 */
export abstract class Controller implements IController {
  [methodName: string]: (req: HttpRequest, res: HttpResponse) => Promise<void>;
}
