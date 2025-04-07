import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";

export class UserRepositoryFile implements IUserRepository {
  private users: User[] = [];

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }
}
