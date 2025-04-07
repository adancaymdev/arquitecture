import { BadRequestException } from "@application/exceptions/BadRequestException";
import type { IRequest } from "@application/interfaces/http/IRequest";
import type { IRoute } from "@application/interfaces/http/IRoute";
import type { IServerOptions } from "@application/interfaces/http/IServerOptions";
import type { IncomingHttpHeaders, IncomingMessage } from "http";

/**
 * Represents an HTTP request.
 *
 * @remarks
 * This class is not meant to be instantiated directly. Instead, it is created by the
 * {@link HttpServer} when a request is received.
 */
export class HttpRequest implements IRequest {
  /**
   * The server options including host, port, and protocol.
   */
  private options: IServerOptions;

  /**
   * The incoming HTTP request message.
   */
  private request: IncomingMessage;

  /**
   * The base URL of the server.
   */
  private base: string;

  /**
   * The route that matched the request.
   */
  private route: IRoute;

  /**
   * Initializes a new instance of the Request class.
   * @param request - The incoming HTTP request message.
   * @param options - The server options including host, port, and protocol.
   * @param route
   */
  constructor(
    request: IncomingMessage,
    options: IServerOptions,
    route: IRoute
  ) {
    this.options = options;
    this.request = request;
    this.base = `${this.options.protocol}://${this.options.host}:${this.options.port}`;
    this.route = route;
  }

  /**
   * Retrieves a route parameter by name.
   * @param name - The name of the route parameter to retrieve.
   * @returns The value of the route parameter
   */
  public async getParam<T = string>(name: string): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        const patternSegments = this.route.path.split("/").filter(Boolean);
        const urlSegments = (this.request.url ?? "").split("/").filter(Boolean);

        const cleanName = name.replace(/^:/, "");

        let value: string | undefined;

        for (let i = 0; i < patternSegments.length; i++) {
          const segment = patternSegments[i];

          if (segment.startsWith(":")) {
            const paramName = segment.slice(1);
            if (paramName === cleanName) {
              value = urlSegments[i];
              break;
            }
          }
        }
        if (!value) {
          reject(new BadRequestException(`Route param ${name} not found`));
          return;
        }
        resolve(value as T);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Retrieves the query string parameters of the request as an object.
   * @returns The query string parameters as an object, or an empty object if no query string is present.
   */
  getQuery<T>(): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        const parsedUrl = new URL(this.request.url ?? "", this.base);
        const queryObject = Object.fromEntries(
          parsedUrl.searchParams.entries()
        );
        resolve(queryObject as T);
      } catch (error) {
        reject(new BadRequestException("Query not found"));
      }
    });
  }

  /**
   * Retrieves the headers of the request as an object.
   * @returns The headers of the request as an object, or an empty object if no headers are present.
   */
  getHeaders<T>(): Promise<T & IncomingHttpHeaders> {
    const headers = this.request.headers;
    return new Promise((resolve, reject) => {
      try {
        resolve(headers as T & IncomingHttpHeaders);
      } catch (error) {
        reject(new BadRequestException("Headers not found"));
      }
    });
  }

  /**
   * Retrieves the body of the request as a parsed JSON object.
   * @returns A promise that resolves to the parsed JSON object, or rejects if the body is not valid JSON.
   */
  getBody<T>(): Promise<T> {
    return new Promise((resolve, reject) => {
      try {
        let body = "";
        this.request.on("data", (chunk) => (body += chunk));
        this.request.on("end", () => resolve(JSON.parse(body) as T));
      } catch (error) {
        reject(new BadRequestException("Body not found"));
      }
    });
  }
}
