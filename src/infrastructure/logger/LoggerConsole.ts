import { Logger } from "../../application/abstracts/logger/Logger";
import { Injectable } from "../dependency-inyection/dependency";

/**
 * Implementation of the {@link Logger} interface that logs to the console.
 */
@Injectable()
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
}
