import { type IncomingMessage, type ServerResponse, createServer } from "http";
import { Server } from "../../application/abstracts/http/Server";
import { Exception } from "../../application/exceptions/Exception";
import { IRoute } from "../../application/interfaces/http/IRoute";
import { IServerOptions } from "../../application/interfaces/http/IServerOptions";
import { ILogger } from "../../application/interfaces/logger/ILogger";
import { HttpRequest } from "../../infrastructure/http/HttpRequest";
import { HttpResponse } from "../../infrastructure/http/HttpResponse";
import { LoggerConsole } from "../../infrastructure/logger/LoggerConsole";

/**
 * Represents an HTTP server that can listen on a port and register controllers.
 * @remarks
 * It creates an HTTP server instance that listens for incoming requests.
 * For each request, it checks for the presence of an HTTP method and URL.
 * If either is missing, it sends a 'Bad Request' response with a 400 status code.
 * Otherwise, it retrieves the corresponding route and handles the request.
 */
export class HttpServer extends Server {
  protected logger: ILogger;
  private base: string;

  /**
   * Initializes a new instance of the HttpServer class.
   * @param options - The server options for the HTTP server.
   */
  constructor(options: IServerOptions) {
    super(options);
    this.base = `${options.protocol}://${options.host}:${options.port}/${options.path}`;
    this.logger = new LoggerConsole();
  }

  /**
   * Starts the HTTP server on the specified port.
   * @returns A promise that resolves when the server starts successfully or rejects on error.
   */
  public listen(): Promise<void> {
    return new Promise((resolve, reject) => {
      const server = createServer((req, res) => {
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
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   * @param route - The route object containing the method handler, or undefined if no route matches.
   */
  protected handleRoute(
    req: IncomingMessage,
    res: ServerResponse,
    route: IRoute
  ): void {
    if (!route) {
      res.statusCode = 404;
      res.end("Not Found");
    }
    try {
      route.handler(
        new HttpRequest(req, this.options, route),
        new HttpResponse(res, route)
      );
    } catch (error: Exception | any) {
      res.statusCode = error.code || 500;
      res.end(error.message);
    }
  }

  /**
   * Handles an incoming HTTP request by retrieving the associated route and executing the handler.
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
