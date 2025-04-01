import http from "http";

import { IController, IRoute, IServerOptions } from "application";
import { Request, Response } from "infrastructure";

export class HttpServer {
  private routes: IRoute[] = [];
  private options: IServerOptions;

  /**
   * Initializes a new instance of the HttpServer class with the provided server options.
   * @param options - The server options including host, port, and protocol.
   */

  constructor(options: IServerOptions) {
    this.options = options;
  }

  /**
   * Adds one or more controllers to the server. Each controller's methods are
   * extracted and added to the server's routes.
   * @param controllers - The controller instances containing the methods to be registered as routes.
   */

  public addController(...controllers: IController[]) {
    controllers.forEach((controller) =>
      Object.getOwnPropertyNames(controller).map((methodName) =>
        this.routes.push(controller[methodName]())
      )
    );
  }

  /**
   * Starts the HTTP server on the specified port.
   * Sets up request handling to match incoming requests with registered routes.
   * Sends a 'Bad Request' response for requests with missing method or URL.
   * Sends a 'Not Found' response for unmatched routes.
   *
   * @param port - The port number on which the server listens for connections.
   * @param callback - An optional callback function to be executed once the server starts listening.
   */

  public listen(port: number, callback?: () => void): void {
    const server = http.createServer((req, res) => {
      const { method, url } = req;
      if (!method || !url) {
        res.statusCode = 400;
        return res.end("Bad Request");
      }

      this.handleRoute(req, res, this.getRoute(method, url));
    });

    server.listen(port, callback);
  }

  /**
   * Retrieves a route from the server's route list based on the request's HTTP method and URL.
   * @param method - The HTTP method of the request.
   * @param path - The URL of the request.
   * @returns The route matching the request's method and URL, or undefined if no route matches.
   */
  private getRoute(method: string, path: string) {
    return this.routes.find((r) => r.method === method && r.path === path);
  }

  /**
   * Handles an incoming HTTP request by executing the associated route handler.
   * If the route is not found, sends a 'Not Found' response with a 404 status code.
   *
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   * @param route - The route object containing the method handler, or undefined if no route matches.
   */

  private handleRoute(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    route?: IRoute
  ) {
    if (!route) {
      res.statusCode = 404;
      return res.end("Not Found");
    }
    route.handler(new Request(req, this.options), new Response(res));
  }
}
