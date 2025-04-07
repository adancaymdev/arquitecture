import { User } from "@domain/entities/User";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";

export class UserRepositoryMemory implements IUserRepository {
  private users: User[] = [];

  findAll(): Promise<User[]> {
    return Promise.resolve(this.users);
  }
  findAllBy(filter: User): Promise<User[] | null> {
    return Promise.resolve(
      this.users.filter((user) => user.name === filter.name)
    );
  }
  create(user: User): Promise<string> {
    this.users.push(user);
    return Promise.resolve(user.id);
  }
  update(user: User): Promise<User> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
    return Promise.resolve(user);
  }
  delete(id: string): Promise<void> {
    this.users = this.users.filter((user) => user.id !== id);
    return Promise.resolve();
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find((user) => user.id === id) || null;
  }

  async save(user: User): Promise<void> {
    const index = this.users.findIndex((u) => u.id === user.id);
    if (index !== -1) {
      this.users[index] = user;
    }
  }
}
