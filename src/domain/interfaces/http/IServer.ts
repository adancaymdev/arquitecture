import type { IController } from "./IController";

/**
 * Represents a server that can listen on a port and register controllers.
 * @remarks
 * Each method of the controller must be marked as `async` to allow the use of `await`.
 * The methods of the controller will be called with the request and response objects as arguments.
 */
export interface IServer {
  /**
   * Starts the server on a specified port.
   * @returns A promise that resolves when the server starts successfully.
   */
  listen(): Promise<void>;
  /**
   * Registers the routes of the given controllers with the server.
   * @param controllers - The controllers to register with the server.
   * @throws {Error} If a route with the same name is already registered.
   */
  addController(...controllers: IController[]): void;
}
