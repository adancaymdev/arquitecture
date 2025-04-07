import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";

export class UserRepositoryMemory implements IUserRepository {
  private users: User[] = [];

  async findAll(): Promise<User[]> {
    return this.users;
  }
  async findAllBy(filter: User): Promise<User[] | null> {
    return this.users.filter((user) => user.name === filter.name);
  }
  async create(user: User): Promise<string> {
    this.users.push(user);
    return user.id;
  }
  async update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return user;
  }
  async delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }
}
