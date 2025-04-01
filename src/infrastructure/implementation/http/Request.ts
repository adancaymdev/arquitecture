import { IncomingHttpHeaders, IncomingMessage } from "http";

import { IRequest, IServerOptions } from "application";

export class Request implements IRequest {
  private options: IServerOptions;
  private request: IncomingMessage;
  private base: string;

  /**
   * Initializes a new instance of the Request class.
   * @param request - The incoming HTTP request message.
   * @param options - The server options including host, port, and protocol.
   */

  constructor(request: IncomingMessage, options: IServerOptions) {
    this.options = options;
    this.request = request;
    this.base = `${this.options.protocol}://${this.options.host}:${this.options.port}`;
  }

  /**
   * Returns the query string parameters as a typed object.
   * @returns A promise that resolves with an object containing the query string parameters.
   * @example
   * const req = new Request(incomingMessage, options);
   * const query = await req.getQuery<{ foo: string; bar: number }>();
   * // query: { foo: 'hello', bar: 123 }
   */
  getQuery<T>(): Promise<T> {
    return new Promise((resolve) => {
      const parsedUrl = new URL(this.request.url ?? "", this.base);
      const queryObject = Object.fromEntries(parsedUrl.searchParams.entries());
      resolve(queryObject as T);
    });
  }
  /**
   * Retrieves the HTTP headers from the incoming request.
   * @returns A promise that resolves with an object containing the headers,
   * typed as a combination of the generic type T and IncomingHttpHeaders.
   * @example
   * const req = new Request(incomingMessage, options);
   * const headers = await req.getHeaders<{ Authorization: string }>();
   * // headers: { authorization: 'Bearer token', ... }
   */

  getHeaders<T>(): Promise<T & IncomingHttpHeaders> {
    const headers = this.request.headers;
    return new Promise((resolve) => {
      resolve(headers as T & IncomingHttpHeaders);
    });
  }

  /**
   * Retrieves the request body as a typed object.
   * @returns A promise that resolves with an object containing the request body.
   * @example
   * const req = new Request(incomingMessage, options);
   * const body = await req.getBody<{ foo: string; bar: number }>();
   * // body: { foo: 'hello', bar: 123 }
   */
  getBody<T>(): Promise<T> {
    return new Promise((resolve) => {
      let body = "";
      this.request.on("data", (chunk) => (body += chunk));
      this.request.on("end", () => resolve(JSON.parse(body) as T));
    });
  }
}
