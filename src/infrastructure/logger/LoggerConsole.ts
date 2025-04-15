import { Logger } from "@domain/abstracts/logger/Logger";
/**
 * Implementation of the {@link Logger} interface that logs to the console.
 */
export class LoggerConsole extends Logger {
  /**
   * Logs a message to the console.
   *
   * @param message - The message to log.
   * @param optionalParams - Additional parameters to log.
   */
  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  /**
   * Logs a table to the console.
   *
   * @param message - The message to log.
   * @param optionalParams - Additional parameters to log.
   */
  table(message?: any, ...optionalParams: any[]): void {
    console.table(message, ...optionalParams);
  }

  error(message: string): void {
    this.log(`[Error]: ${message}`);
  }

  success(message: string): void {
    this.log(`[Success]: ${message}`);
  }

  info(message: string): void {
    this.log(`[Info]: ${message}`);
  }

  warn(message: string): void {
    this.log(`[Warn]: ${message}`);
  }
}
