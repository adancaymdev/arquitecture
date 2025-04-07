import { Exception } from "./Exception";

/**
 * Exception thrown when a request is made without proper authorization.
 */
export class UnauthorizedException extends Exception {
  /**
   * Creates a new instance of the UnauthorizedException.
   * @param message - The error message describing the reason for the exception.
   */
  constructor(message: string) {
    super({ message, code: 401 });
  }
}
