import type { IMethodHandler } from "./IMethodHandler";
import type { IMethodName } from "./IMethodName";

/**
 * Represents a route.
 * @property method - The HTTP method of the route.
 * @property path - The path of the route.
 * @property name - The name of the route. Optional.
 * @property handler - The handler of the route.
 */
export type IRoute = {
  method: IMethodName;
  path: string;
  name?: string;
  handler: IMethodHandler;
};
