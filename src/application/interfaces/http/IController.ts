/**
 * Interface for a controller that defines methods returning routes.
 */
export interface IController {
  /**
   * The name of the controller.
   * @type {string}
   * @default "Controller"
   * @readonly
   * @static
   * @memberof IController
   * */
  [methodName: string]: (...args: any[]) => Promise<void>;
}
