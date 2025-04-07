import { IncomingHttpHeaders, IncomingMessage } from "http";
import { IRequest } from "../../application/interfaces/http/IRequest";
import { IRoute } from "../../application/interfaces/http/IRoute";
import { IServerOptions } from "../../application/interfaces/http/IServerOptions";

export class HttpRequest implements IRequest {
  private options: IServerOptions;
  private request: IncomingMessage;
  private base: string;
  private route: IRoute;

  /**
   * Initializes a new instance of the Request class.
   * @param request - The incoming HTTP request message.
   * @param options - The server options including host, port, and protocol.
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
   * @returns The value of the route parameter, or undefined if no parameter matches.
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
    return new Promise((resolve) => {
      const parsedUrl = new URL(this.request.url ?? "", this.base);
      const queryObject = Object.fromEntries(parsedUrl.searchParams.entries());
      resolve(queryObject as T);
    });
  }

  /**
   * Retrieves the headers of the request as an object.
   * @returns The headers of the request as an object, or an empty object if no headers are present.
   */
  getHeaders<T>(): Promise<T & IncomingHttpHeaders> {
    const headers = this.request.headers;
    return new Promise((resolve) => {
      resolve(headers as T & IncomingHttpHeaders);
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
        reject(error);
      }
    });
  }
}
