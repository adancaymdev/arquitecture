export interface IRequest {
  /**
   * Retrieves the body of the request as a parsed JSON object.
   * @returns A promise that resolves to the parsed JSON object, or rejects if the body is not valid JSON.
   */
  getBody<T>(): Promise<T>;

  /**
   * Retrieves the query string parameters of the request as an object.
   * @returns A promise that resolves to the query string parameters as an object, or an empty object if no query string is present.
   */
  getQuery<T>(): Promise<T>;

  /**
   * Retrieves the headers of the request as an object.
   * @returns A promise that resolves to the headers of the request as an object, or an empty object if no headers are present.
   */
  getHeaders<T>(): Promise<T>;

  /**
   * Retrieves a route parameter by name.
   * @param name - The name of the route parameter to retrieve.
   * @returns A promise that resolves to the value of the route parameter, or undefined if no parameter matches.
   */
  getParam<T>(name: string): Promise<T>;
}
