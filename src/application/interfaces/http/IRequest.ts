export interface IRequest {
  getBody<T>(): Promise<T>;
  getQuery<T>(): Promise<T>;
  getHeaders<T>(): Promise<T>;
  getParam<T>(name: string): Promise<T>;
}
