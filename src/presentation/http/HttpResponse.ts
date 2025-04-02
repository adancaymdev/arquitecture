import { ServerResponse } from "http";
import { IResponse } from "../../application/interfaces/http/IResponse";
import { IRoute } from "../../application/interfaces/http/IRoute";
import { ILogger } from "../../application/interfaces/logger/ILogger";
import { LoggerConsole } from "../../infrastructure/logger/LoggerConsole";

export class HttpResponse implements IResponse {
  response: ServerResponse;
  route?: IRoute;
  logger: ILogger;
  /**
   * Initializes a new instance of the Response class with the given
   * ServerResponse object.
   *
   * @param response - The ServerResponse object to use for sending the
   * response.
   */
  constructor(response: ServerResponse, route: IRoute) {
    this.response = response;
    this.route = route;
    this.logger = new LoggerConsole();
  }

  /**
   * Sets the HTTP status code of the response.
   *
   * @param code - The status code to set.
   * @returns The Response object, allowing method chaining.
   */
  status(code: number): IResponse {
    this.response.statusCode = code;
    return this;
  }
  /**
   * Sends the given data as the response body.
   *
   * @param data - The data to send as the response body.
   * @returns The Response object, allowing method chaining.
   */
  send<T>(data: T): IResponse {
    this.response.end(data);
    return this;
  }
  /**
   * Sends the given data as the response body in JSON format.
   *
   * If the given status code is not specified, defaults to 200.
   *
   * @param data - The data to send as the response body.
   * @param status - An optional status code for the response.
   */
  json<T>(data: T, status?: number): void {
    this.response.setHeader("Content-Type", "application/json");
    this.status(status || 200).send(JSON.stringify(data));
  }
}
