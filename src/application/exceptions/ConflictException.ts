import { Exception } from "./Exception";

/**
 * Exception thrown when a request is made with data that conflicts with the existing data.
 */
export class ConflictException extends Exception {
  /**
   * Creates a new instance of the exception.
   * @param message The error message.
   */
  constructor(message: string) {
    super({ message, code: 409 });
  }
}
