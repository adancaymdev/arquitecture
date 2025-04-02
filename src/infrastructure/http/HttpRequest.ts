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

  public async getParam<T = string>(name: string): Promise<T> {
    return new Promise((resolve) => {
      // 1) Dividimos el patrón en segmentos
      const patternSegments = this.route.path.split("/").filter(Boolean);
      // 2) Dividimos la URL real en segmentos
      const urlSegments = (this.request.url ?? "").split("/").filter(Boolean);

      // Limpieza por si el nombre viene con ":" (e.g. ":id")
      const cleanName = name.replace(/^:/, "");

      let value: string | undefined;

      // Recorremos los segmentos del patrón
      for (let i = 0; i < patternSegments.length; i++) {
        const segment = patternSegments[i]; // e.g. ":id" o "users"

        if (segment.startsWith(":")) {
          // es un parámetro
          const paramName = segment.slice(1); // e.g. "id"
          if (paramName === cleanName) {
            // Si coincide con el paramName que buscamos,
            // extraemos el valor desde la URL en la misma posición
            value = urlSegments[i];
            break;
          }
        }
      }

      // value podría ser undefined si no encontró nada
      resolve(value as T);
    });
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
