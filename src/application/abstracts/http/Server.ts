import { LoggerConsole } from "../../../infrastructure/logger/LoggerConsole";
import { IController } from "../../interfaces/http/IController";
import { IRoute } from "../../interfaces/http/IRoute";
import { IServer } from "../../interfaces/http/IServer";
import { IServerOptions } from "../../interfaces/http/IServerOptions";
import { ILogger } from "../../interfaces/logger/ILogger";

export abstract class Server implements IServer {
  protected routes: IRoute[] = [];
  protected options: IServerOptions;
  protected readonly logger: ILogger;

  /**
   * Initializes a new instance of the HttpServer class with the provided server options.
   * @param options - The server options including host, port, and protocol.
   */

  constructor(options: IServerOptions) {
    this.options = options;
    this.logger = new LoggerConsole();
  }

  /**
   * Adds one or more controllers to the server. Each controller's methods are
   * extracted and added to the server's routes.
   * @param controllers - The controller instances containing the methods to be registered as routes.
   */

  public addController(...controllers: IController[]) {
    controllers.forEach((controller) => {
      // Obtener el prototipo
      const proto = Object.getPrototypeOf(controller);

      // Obtener todas las propiedades "propias" del prototipo (métodos de la clase)
      const methodNames = Object.getOwnPropertyNames(proto).filter(
        (methodName) =>
          methodName !== "constructor" &&
          typeof proto[methodName] === "function"
      );

      // Invocar cada método para que devuelva IRoute (o lo que necesites)
      methodNames.forEach((methodName) => {
        const route = controller[methodName]();
        this.routes.push({
          name: methodName,
          ...route,
          path: `${this.options.path}${route.path}`,
        });
      });
      this.logger.table(
        this.routes.map((r) => ({
          name: r.name,
          method: r.method,
          path: r.path,
        }))
      );
    });
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
    const methodLower = method.toLocaleLowerCase();
    const pathSegments = path.split("/").filter(Boolean);

    return this.routes.find((r) => {
      // Checamos que coincida el método
      if (r.method.toLowerCase() !== methodLower) {
        return false;
      }

      const routeSegments = r.path.split("/").filter(Boolean);
      // Si difiere la cantidad de segmentos, no es match
      if (routeSegments.length !== pathSegments.length) {
        return false;
      }

      // Verificamos cada segmento
      for (let i = 0; i < routeSegments.length; i++) {
        const routeSegment = routeSegments[i];
        const pathSegment = pathSegments[i];

        // Si el segmento comienza con ":", asumimos que es param => match implícito
        if (routeSegment.startsWith(":")) {
          continue; // Se considera coincidencia, no validamos valor
        }

        // De lo contrario, debe coincidir exactamente
        if (routeSegment !== pathSegment) {
          return false;
        }
      }

      // Si llegamos hasta aquí, todos los segmentos encajan
      return true;
    });
  }

  /**
   * Handles an incoming HTTP request by executing the associated route handler.
   * If the route is not found, sends a 'Not Found' response with a 404 status code.
   *
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   * @param route - The route object containing the method handler, or undefined if no route matches.
   */

  protected handleRoute(req: any, res: any, route?: IRoute): void {
    throw new Error("Method not implemented.");
  }
}
