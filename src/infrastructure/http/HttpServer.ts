import http, { IncomingMessage, ServerResponse } from "http";
import { Server } from "../../application/abstracts/http/Server";
import { Exception } from "../../application/exceptions/Exception";
import { IRoute } from "../../application/interfaces/http/IRoute";
import { IServerOptions } from "../../application/interfaces/http/IServerOptions";
import { ILogger } from "../../application/interfaces/logger/ILogger";
import { HttpRequest } from "./HttpRequest";
import { HttpResponse } from "./HttpResponse";

/**
 * Represents an HTTP server that can listen on a port and register controllers.
 * @remarks
 * It creates an HTTP server instance that listens for incoming requests.
 * For each request, it checks for the presence of an HTTP method and URL.
 * If either is missing, it sends a 'Bad Request' response with a 400 status code.
 * Otherwise, it retrieves the corresponding route and handles the request.
 */
export class HttpServer extends Server {
  private base: string;

  /**
   * Initializes a new instance of the HttpServer class.
   * @param {IServerOptions} options The server options for the HTTP server.
   * @param {ILogger} logger The logger to use for logging.
   */
  constructor(options: IServerOptions, protected readonly logger: ILogger) {
    super(options);
    this.base = `${options.protocol}://${options.host}:${options.port}/${options.path}`;
  }
  /**
   * Starts the HTTP server on the specified port.
   *
   * This method creates an HTTP server instance that listens for incoming requests.
   * For each request, it checks for the presence of an HTTP method and URL.
   * If either is missing, it sends a 'Bad Request' response with a 400 status code.
   * Otherwise, it retrieves the corresponding route and handles the request.
   *
   * The server resolves the promise when it starts listening on the specified port,
   * and rejects the promise if an error occurs during the server operation.
   *
   * @param port - The port number on which the server will listen for incoming connections.
   * @returns A promise that resolves when the server starts successfully or rejects on error.
   */
  public listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = http.createServer((req, res) => {
        this.handleRequest(req, res);
      });

      server.listen(this.options.port, () => {
        this.logger.warn(
          `${new Date().toISOString()}|${this.constructor.name}|SUCCESS|${
            this.base
          }`
        );
        resolve();
      });

      server.on("error", reject);
    });
  }

  /**
   * Handles an incoming HTTP request by executing the associated route handler.
   * If the route is not found, sends a 'Not Found' response with a 404 status code.
   * If an error occurs during handler execution, sends a 'Internal Server Error' response with a 500 status code.
   *
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   * @param route - The route object containing the method handler, or undefined if no route matches.
   * @remarks
   * This method is the core request handling method of the HTTP server.
   * It takes an incoming HTTP request and checks if there is a registered route matching the request's method and URL.
   * If there is a matching route, it calls the associated route handler with the request and response objects.
   * If the route handler throws an error, it catches the error and sends a 'Internal Server Error' response.
   * If there is no matching route, it sends a 'Not Found' response with a 404 status code.
   */
  protected handleRoute(
    req: http.IncomingMessage,
    res: http.ServerResponse,
    route?: IRoute
  ) {
    if (!route) {
      // If there is no matching route, send a 'Not Found' response with a 404 status code
      res.statusCode = 404;
      return res.end("Not Found");
    }
    try {
      // Call the associated route handler with the request and response objects
      route.handler(
        new HttpRequest(req, this.options, route),
        new HttpResponse(res, route)
      );
    } catch (error: Exception | any) {
      // If an error occurs during handler execution, catch the error and send a 'Internal Server Error' response with a 500 status code
      res.statusCode = error.code || 500;
      return res.end(error.message);
    }
  }

  /**
   * Handles an incoming HTTP request by retrieving the associated route and executing the handler.
   * If the request is invalid (i.e. lacks a method or URL), it sends a 'Bad Request' response with a 400 status code.
   * Otherwise, it logs the request and calls the handler.
   *
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   */
  private handleRequest(req: IncomingMessage, res: ServerResponse): void {
    const startTime = process.hrtime.bigint();
    if (!req.method || !req.url) {
      res.statusCode = 400;
      res.end("Bad Request");
      return;
    }
    this.handleRoute(req, res, this.getRoute(req.method, req.url));

    res.on("close", () => {
      this.logRequestOnClose(req, res, startTime);
    });
  }
  /**
   * Logs the request once it has been fully processed and the response has been sent.
   * The log message includes the timestamp, server name, request method, URL, status code, and response time in milliseconds.
   * If the status code is 400 or higher, the log message is treated as an error, otherwise it is treated as an info message.
   *
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   * @param startTime - The high-resolution timestamp when the request was received.
   */
  private logRequestOnClose(
    req: IncomingMessage,
    res: ServerResponse,
    startTime: bigint
  ): void {
    const endTime = process.hrtime.bigint();
    const diffMs = Number(endTime - startTime) / 1_000_000;

    const timeStamp = new Date().toISOString();
    const method = req.method || "UNKNOWN";
    const url = req.url || "";
    const statusCode = res.statusCode;

    // Construye el mensaje
    const logMessage = `${timeStamp}|${this.constructor.name}|${
      statusCode >= 400 ? "ERROR" : "SUCCESS"
    }|${this.base}${url}|${method}|${statusCode}|${diffMs.toFixed()}ms `;

    if (statusCode >= 400) {
      this.logger.error(logMessage);
    } else {
      this.logger.info(logMessage);
    }
  }
}
