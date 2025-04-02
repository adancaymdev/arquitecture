import { ILogger } from "../../interfaces/logger/ILogger";

export class Logger implements ILogger {
  red: string = "\x1b[31m";
  green: string = "\x1b[32m";
  blue: string = "\x1b[34m";
  yellow: string = "\x1b[33m";
  log(message?: any, ...optionalParams: any[]): void {
    throw new Error("Method not implemented.");
  }
  table(message?: any, ...optionalParams: any[]): void {
    throw new Error("Method not implemented.");
  }
  error(message: string): void {
    this.log(this.red, message);
  }
  success(message: string): void {
    this.log(this.green, message);
  }
  info(message: string): void {
    this.log(this.blue, message);
  }
  warn(message: string): void {
    this.log(this.yellow, message);
  }
}
