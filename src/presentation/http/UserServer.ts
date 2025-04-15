import { IController } from "@domain/interfaces/http/IController";
import type { IServerOptions } from "@domain/interfaces/http/IServerOptions";
import type { ILogger } from "@domain/interfaces/logger/ILogger";
import { HttpServer } from "@infrastructure/http/HttpServer";

export class UserServer extends HttpServer {
  /**
   * Initializes a new instance of the UserServer class.
   * @param {IServerOptions} options The server options for the HTTP server.
   * @param controllers
   * @param {ILogger} logger The logger to use for logging.
   */
  constructor(
    options: IServerOptions,
    controllers: IController[],
    logger?: ILogger
  ) {
    super(options, logger);
    this.addController(...controllers);
  }
}
