export interface IDatabase {
  insert<T>(params: Map<string, unknown>): Promise<T>;
  update<T>(id: number | string, params: Map<string, unknown>): Promise<T>;
  delete(id: number | string): Promise<void>;
  get<T>(params: Map<string, unknown>): Promise<T>;
  all<T>(params?: Map<string, unknown>): Promise<T[]>;
  exec(sql: string): Promise<void>;
}
