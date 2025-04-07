import { IController } from "../../application/interfaces/http/IController";
import { IServerOptions } from "../../application/interfaces/http/IServerOptions";
import { ILogger } from "../../application/interfaces/logger/ILogger";
import { TOKENS } from "../../infrastructure/dependency-inyection/container";

import {
  Inject,
  Injectable,
} from "../../infrastructure/dependency-inyection/dependency";
import { HttpServer } from "../../infrastructure/http/HttpServer";

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
