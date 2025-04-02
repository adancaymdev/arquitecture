export interface ILogger {
  log(message?: any, ...optionalParams: any[]): void;
  table(message?: any, ...optionalParams: any[]): void;
  error(message: string): void;
  success(message: string): void;
  info(message: string): void;
  warn(message: string): void;
}
