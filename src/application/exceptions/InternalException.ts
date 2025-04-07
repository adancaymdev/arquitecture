import { Exception } from "./Exception";

/**
 * Exception thrown when an unexpected error occurs.
 * The error should be handled by the application.
 */
export class InternalException extends Exception {
  /**
   * Creates a new instance of the exception.
   * @param message - The error message.
   */
  constructor(message: string) {
    super({ message, code: 500 });
  }
}
