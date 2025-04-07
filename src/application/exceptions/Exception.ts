/**
 * Represents an exception thrown by the application.
 */
export class Exception extends Error {
  /**
   * The HTTP status code associated with the exception.
   */
  code: number;

  /**
   * Creates a new instance of the exception.
   * @param {string} message The error message.
   * @param {number} code The HTTP status code associated with the exception.
   */
  constructor({ message, code }: { message: string; code: number }) {
    super(message);
    this.code = code;
  }
}
