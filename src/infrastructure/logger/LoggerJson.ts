import { Logger } from "@application/abstracts/logger/Logger";
import { Injectable } from "@infrastructure/dependency-inyection/dependency";
/**
 * Implementation of the {@link Logger} interface that logs to the console.
 */
@Injectable()
export class LoggerJson extends Logger {
  /**
   * Logs a message to the console.
   *
   * @param message - The message to log.
   * @param optionalParams - Additional parameters to log.
   */
  log(message?: any, ...optionalParams: any[]): void {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "LOG",
        component: "LoggerConsole",
        message,
        context: optionalParams,
      })
    );
  }

  /**
   * Logs a table to the console.
   *
   * @param message - The message to log.
   * @param optionalParams - Additional parameters to log.
   */
  table(message?: any, ...optionalParams: any[]): void {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "TABLE",
        component: "LoggerConsole",
        message,
        context: optionalParams,
      })
    );
  }

  error(message: string): void {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "ERROR",
        component: "LoggerConsole",
        message,
        context: [],
      })
    );
  }

  success(message: string): void {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "SUCCESS",
        component: "LoggerConsole",
        message,
        context: [],
      })
    );
  }

  info(message: string): void {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "INFO",
        component: "LoggerConsole",
        message,
        context: [],
      })
    );
  }

  warn(message: string): void {
    console.log(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "WARN",
        component: "LoggerConsole",
        message,
        context: [],
      })
    );
  }
}
