/**
 * Represents the options for an HTTP server.
 *
 * @property path - The root path of the server.
 * @property host - The hostname of the server.
 * @property port - The port number of the server.
 * @property protocol - The protocol of the server (http or https).
 */
export interface IServerOptions {
  /**
   * The root path of the server.
   */
  path: string;

  /**
   * The hostname of the server.
   */
  host: string;

  /**
   * The port number of the server.
   */
  port: number;

  /**
   * The protocol of the server (http or https).
   */
  protocol: string;
}
