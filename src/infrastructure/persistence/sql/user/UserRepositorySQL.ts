import { User } from "@domain/entities/User";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";

export class UserRepositorySQL implements IUserRepository {

  constructor(private readonly db: IDatabase) {}

  findById(id: string): Promise<User> {
    return this.db.get<User>(new Map([["id", id]]));
  }
  findAll(): Promise<User[]> {
    return this.db.all<User>();
  }
  findAllBy(filter: User): Promise<User[]> {
    const params = new Map(Object.entries(filter));
    return this.db.all<User>(params);
  }
  update(user: User): Promise<User> {
    const params = new Map(Object.entries(user));
    return this.db.update<User>(user.id, params);
  }
  delete(id: number | string): Promise<void> {
    return this.db.delete(id);
  }

  async create(user: User): Promise<User> {
    const params = new Map(Object.entries(user));
    return this.db.insert<User>(params);
  }
}
