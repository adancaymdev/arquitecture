import { Server } from "@domain/abstracts/http/Server";
import { Exception } from "@domain/exceptions/Exception";
import type { IRoute } from "@domain/interfaces/http/IRoute";
import type { IServerOptions } from "@domain/interfaces/http/IServerOptions";
import type { ILogger } from "@domain/interfaces/logger/ILogger";
import { type IncomingMessage, type ServerResponse, createServer } from "http";
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
  protected logger?: ILogger;
  private base: string;

  /**
   * Initializes a new instance of the HttpServer class.
   * @param options - The server options for the HTTP server.
   * @param logger
   */
  constructor(options: IServerOptions, logger?: ILogger) {
    super(options);
    this.base = `${options.protocol}://${options.host}:${options.port}`;
    this.logger = logger;
  }

  /**
   * Starts the HTTP server on the specified port.
   * @returns A promise that resolves when the server starts successfully or rejects on error.
   */
  public listen(): Promise<void> {
    return new Promise((resolve) => {
      const server = createServer(this.handleRequest.bind(this));
      server.listen(this.options.port, () => {
        this.logger?.success(
          `${new Date().toISOString()}|${this.constructor.name}|SUCCESS|${
            this.base
          }/${this.options.path}`
        );
        resolve();
      });
    });
  }

  /**
   * Handles an incoming HTTP request by executing the associated route handler.
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   * @param route - The route object containing the method handler, or undefined if no route matches.
   */
  protected async handleRoute(
    req: IncomingMessage,
    res: ServerResponse,
    route: IRoute
  ): Promise<void> {
    try {
      await route.handler(
        new HttpRequest(req, this.options, route),
        new HttpResponse(res, route)
      );
    } catch (error: Exception | any) {
      res.statusCode = error.code || 500;
      res.end(error.message);
    } finally {
      this.logRequestOnClose(req, res, process.hrtime.bigint());
    }
  }

  /**
   * Handles an incoming HTTP request by retrieving the associated route and executing the handler.
   * @param req - The incoming HTTP request message.
   * @param res - The outgoing HTTP server response message.
   */
  private async handleRequest(
    req: IncomingMessage,
    res: ServerResponse
  ): Promise<void> {
    const route = this.getRoute(req.method, req.url);
    await this.handleRoute(req, res, route);
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
      this.logger?.error(logMessage);
    } else {
      this.logger?.info(logMessage);
    }
  }
}
