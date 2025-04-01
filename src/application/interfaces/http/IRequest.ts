export interface IRequest {
  getBody<T>(): Promise<T>;
  getQuery<T>(): Promise<T>;
  getHeaders<T>(): Promise<T>;
}
