import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import {IRepository} from "@domain/interfaces/repositories/IRepository";
import {NotFoundException} from "@domain/exceptions/NotFoundException";

export abstract class RepositorySQL<T> implements IRepository<T> {

  protected readonly db: IDatabase

  constructor(db: IDatabase) {
    this.db = db;
  }

  async findById(id: string): Promise<T> {
    const user = await this.db.get<T>(new Map([["id", id]]));
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
  findAll(): Promise<T[]> {
    return this.db.all<T>();
  }
  findAllBy(filter: T): Promise<T[]> {
    const params = new Map(Object.entries(filter as object));
    return this.db.all<T>(params);
  }
  update(obj: T): Promise<T> {
    const params = new Map(Object.entries(obj as object));
    const id = params.get("id");
    return this.db.update<T>(id, params);
  }
  delete(id: number | string): Promise<void> {
    return this.db.delete(id);
  }

  async create(obj: T): Promise<T> {
    const params = new Map(Object.entries(obj as object));
    return this.db.insert<T>(params);
  }
}
