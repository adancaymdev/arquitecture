import { BadRequestException } from "@application/exceptions/BadRequestException";
import { IController } from "@application/interfaces/http/IController";
import { IRoute } from "@application/interfaces/http/IRoute";
import { IServer } from "@application/interfaces/http/IServer";
import { IServerOptions } from "@application/interfaces/http/IServerOptions";
import { ILogger } from "@application/interfaces/logger/ILogger";
import { LoggerConsole } from "@infrastructure/logger/LoggerConsole";
/**
 * Represents an HTTP server that can listen on a port and register controllers.
 * @remarks
 * Each implementation of this abstract class must provide the implementation of the {@link listen} method.
 * The {@link listen} method creates an HTTP server instance that listens for incoming requests.
 * For each request, it checks for the presence of an HTTP method and URL.
 * If either is missing, it sends a 'Bad Request' response with a 400 status code.
 * Otherwise, it retrieves the corresponding route and handles the request.
 * The server resolves the promise when it starts listening on the specified port,
 * and rejects the promise if an error occurs during the server operation.
 */
export abstract class Server implements IServer {
  protected routes: IRoute[] = [];
  protected options: IServerOptions;
  protected readonly logger: ILogger = new LoggerConsole();

  /**
   * Initializes a new instance of the HttpServer class with the provided server options.
   * @param options - The server options including host, port, and protocol.
   */
  constructor(options: IServerOptions) {
    this.options = options;
  }

  /**
   * Registers the routes of the given controllers with the server.
   * @param controllers - The controllers to register with the server.
   * @throws {Error} If a route with the same name is already registered.
   */
  public addController(...controllers: IController[]) {
    controllers.forEach((controller) => {
      const proto = Object.getPrototypeOf(controller);
      const methodNames = Object.getOwnPropertyNames(proto).filter(
        (methodName) =>
          methodName !== "constructor" &&
          typeof proto[methodName] === "function"
      );

      methodNames.forEach((methodName) => {
        const route: IRoute = proto[methodName]();
        if (!route) return;
        if (this.routes.find((r) => r.name === methodName)) {
          throw new Error(
            `Route with name ${methodName} already exists in the server.`
          );
        }
        this.routes.push({
          name: methodName,
          path: `${this.options.path}${route.path}`,
          method: route.method,
          handler: route.handler,
        });
      });
      this.logger.table(
        this.routes.map((r) => ({
          ...r,
          path: `${this.options.protocol}://${this.options.host}:${this.options.port}/${r.path}`,
        })),
        ["name", "path", "method"]
      );
    });
  }

  /**
   * Starts the HTTP server on the specified port.
   * Sets up request handling to match incoming requests with registered routes.
   * Sends a 'Bad Request' response for requests with missing method or URL.
   * Sends a 'Not Found' response for unmatched routes.
   */
  public listen(): Promise<void> {
    return Promise.reject(new Error("Method not implemented."));
  }

  /**
   * Retrieves a route from the server's route list based on the request's HTTP method and URL.
   * @param method - The HTTP method of the request.
   * @param path - The URL of the request.
   * @returns The route matching the request's method and URL, or undefined if no route matches.
   */
  protected getRoute(method: string, path: string) {
    const methodLower = method.toLowerCase();
    const pathSegments = path.split("/").filter(Boolean);

    const route = this.routes.find((r) => {
      if (r.method.toLowerCase() !== methodLower) return false;
      const routeSegments = r.path.split("/").filter(Boolean);
      if (routeSegments.length !== pathSegments.length) return false;

      return routeSegments.every(
        (routeSegment, i) =>
          routeSegment.startsWith(":") || routeSegment === pathSegments[i]
      );
    });
    if (!route) {
      throw new BadRequestException(`Route not found for ${method} ${path}`);
    }
    return route;
  }

  /**
   * Handles an incoming HTTP request by executing the associated route handler.
   * If the route is not found, sends a 'Not Found' response with a 404 status code.
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   * @param route - The route object containing the method handler, or undefined if no route matches.
   */
  protected handleRoute(req: any, res: any, route?: IRoute): void {
    throw new Error("Method not implemented.");
  }
}
