import { IResponse } from "application";
import { ServerResponse } from "http";
export class Response implements IResponse {
  response: ServerResponse;
  /**
   * Initializes a new instance of the Response class with the given
   * ServerResponse object.
   *
   * @param response - The ServerResponse object to use for sending the
   * response.
   */
  constructor(response: ServerResponse) {
    this.response = response;
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
    this.response.statusCode = status ?? 200;
    this.response.end(JSON.stringify(data));
  }
}
