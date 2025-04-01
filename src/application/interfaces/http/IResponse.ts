export interface IResponse {
  status(code: number): IResponse;
  send<T>(data: T): IResponse;
  json<T>(data: T, status?: number): void;
}
