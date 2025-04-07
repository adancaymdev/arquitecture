import { ServerResponse } from "http";
import { IResponse } from "../../application/interfaces/http/IResponse";
import { IRoute } from "../../application/interfaces/http/IRoute";
import { ILogger } from "../../application/interfaces/logger/ILogger";
import { LoggerConsole } from "../logger/LoggerConsole";

export class HttpResponse implements IResponse {
  /**
   * The server response object used to interact with the HTTP response.
   */
  response: ServerResponse;
  /**
   * The route associated with the current HTTP request.
   */
  route?: IRoute;
  /**
   * The logger used to log HTTP related events.
   */
  logger: ILogger;

  /**
   * Initializes a new instance of the HttpResponse class.
   *
   * @param response - The server response object used to interact with the HTTP response.
   * @param route - The route associated with the current HTTP request.
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
