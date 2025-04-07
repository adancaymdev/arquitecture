import { Logger } from "../../application/abstracts/logger/Logger";
import { Injectable } from "../dependency-inyection/dependency";

@Injectable()
export class LoggerConsole extends Logger {
  log(message?: any, ...optionalParams: any[]): void {
    console.log(message, ...optionalParams);
  }

  table(message?: any, ...optionalParams: any[]): void {
    console.table(message, ...optionalParams);
  }
}
