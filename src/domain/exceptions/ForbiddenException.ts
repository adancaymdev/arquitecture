import { Exception } from "./Exception";

/**
 * Exception thrown when a request is forbidden due to insufficient permissions or access rights.
 */
export class ForbiddenException extends Exception {
  /**
   * Creates a new instance of the ForbiddenException.
   * @param message - The error message describing the reason for the exception.
   */
  constructor(message: string) {
    super({ message, code: 403 });
  }
}
