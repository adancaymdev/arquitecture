/**
 * Represents an HTTP response.
 */
export interface IResponse {
  /**
   * Sets the status code of the response.
   * @param code - The status code to set.
   * @returns The response object.
   */
  status(code: number): IResponse;

  /**
   * Sets the response body.
   * @param data - The data to be sent as the response body.
   * @returns The response object.
   */
  send<T>(data: T): IResponse;

  /**
   * Sets the response body to a JSON object.
   * @param data - The data to be serialized to JSON and sent as the response body.
   * @param status - The status code to set. Defaults to 200.
   */
  json<T>(data: T, status?: number): void;
}
