import { Exception } from "./Exception";

/**
 * Exception thrown when a request is made with invalid or missing data.
 */
export class BadRequestException extends Exception {
  /**
   * Creates a new instance of the exception.
   * @param message The error message.
   */
  constructor(message: string) {
    super({ message, code: 400 });
  }
}
