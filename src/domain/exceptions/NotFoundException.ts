import { Exception } from "./Exception";

/**
 * Exception thrown when a resource is not found.
 */
export class NotFoundException extends Exception {
  /**
   * Creates a new instance of the exception.
   * @param message - The error message.
   */
  constructor(message: string) {
    super({ message, code: 404 });
  }
}
