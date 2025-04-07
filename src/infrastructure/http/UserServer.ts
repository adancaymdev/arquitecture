import type { IController } from "@domain/interfaces/http/IController";
import type { IServerOptions } from "@domain/interfaces/http/IServerOptions";
import type { ILogger } from "@domain/interfaces/logger/ILogger";
import { TOKENS } from "@infrastructure/dependency-inyection/container";
import {
  Inject,
  Injectable,
} from "@infrastructure/dependency-inyection/dependency";
import { HttpServer } from "./core/HttpServer";

@Injectable()
export class UserServer extends HttpServer {
  /**
   * Initializes a new instance of the UserServer class.
   * @param {IServerOptions} options The server options for the HTTP server.
   * @param {IController[]} controllers The controllers to register with the server.
   * @param {ILogger} logger The logger to use for logging.
   */
  constructor(
    @Inject(TOKENS.UserServerOptions) options: IServerOptions,
    @Inject(TOKENS.UserControllers) controllers: IController[],
    @Inject(TOKENS.ILogger) logger: ILogger
  ) {
    super(options, logger);
    this.addController(...controllers);
  }
}
