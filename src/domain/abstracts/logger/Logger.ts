import type { ILogger } from "@domain/interfaces/logger/ILogger";

/**
 * Abstract class to define a logger. It implements the {@link ILogger} interface.
 * A logger is a class that logs messages to the console.
 *
 * @remarks
 * The methods of the logger must be marked as `void` to allow the use of `void`.
 * The methods of the logger will be called with the message and optional parameters as arguments.
 */
export class Logger implements ILogger {
  /**
   * Logs a message to the console.
   *
   * @param message - The primary message to log. It can be of any type.
   * @param optionalParams - Additional parameters to log. These can be of any type and are spread into the console log.
   */
  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  /**
   * Logs a table to the console.
   *
   * @param data - The data to log as a table. It must be an object with keys and values
   * of any type.
   * @param optionalParams - Additional parameters to log. These can be of any type and are
   * spread into the console log.
   */
  table(data: any, ...optionalParams: any[]): void {
    console.table(data, ...optionalParams);
  }

  /**
   * Logs an error message to the console.
   *
   * @param message - The error message to log.
   */
  error(message: string): void {
    this.log(message);
  }

  /**
   * Logs a success message to the console in green color.
   *
   * @param message - The success message to log.
   */
  success(message: string): void {
    this.log(message);
  }

  /**
   * Logs an informational message to the console in blue color.
   *
   * @param message - The informational message to log.
   */
  info(message: string): void {
    this.log(message);
  }

  /**
   * Logs a warning message to the console in yellow color.
   *
   * @param message - The warning message to log.
   */
  warn(message: string): void {
    this.log(message);
  }
}
