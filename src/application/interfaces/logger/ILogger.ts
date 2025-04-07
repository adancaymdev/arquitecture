/**
 * Interface that represents a logger that can be used to log messages
 * to the console.
 */
export interface ILogger {
  /**
   * Logs a message to the console.
   * @param message - The message to log.
   * @param optionalParams - Additional parameters to log.
   */
  log(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs a table to the console.
   * @param message - The message to log.
   * @param optionalParams - Additional parameters to log.
   */
  table(message?: any, ...optionalParams: any[]): void;

  /**
   * Logs an error message to the console.
   * @param message - The error message to log.
   */
  error(message: string): void;

  /**
   * Logs a success message to the console.
   * @param message - The success message to log.
   */
  success(message: string): void;

  /**
   * Logs an informational message to the console.
   * @param message - The informational message to log.
   */
  info(message: string): void;

  /**
   * Logs a warning message to the console.
   * @param message - The warning message to log.
   */
  warn(message: string): void;
}
