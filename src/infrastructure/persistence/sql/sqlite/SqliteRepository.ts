import { NotFoundException } from "@domain/exceptions/NotFoundException";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import { IRepository } from "@domain/interfaces/repositories/IRepository";

export abstract class SqliteRepository<T> implements IRepository<T> {
  protected readonly db: IDatabase;

  constructor(db: IDatabase) {
    this.db = db;
  }
  /**
   * Retrieves a user by its id.
   * @param id - The id of the user to retrieve.
   * @returns A promise that resolves to the user if found, or rejects if not found.
   * @throws NotFoundException If the user is not found.
   */
  async findById(id: string): Promise<T> {
    const user = await this.db.get<T>(new Map([["id", id]]));
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
  /**
   * Retrieves all users.
   *
   * @returns A promise that resolves to an array of users.
   */
  findAll(): Promise<T[]> {
    return this.db.all<T>();
  }
  /**
   * Retrieves all users that match the specified filter.
   * @param filter - The filter to apply.
   * @returns A promise that resolves to an array of users if found, or an empty array if not found.
   */
  findAllBy(filter: T): Promise<T[]> {
    const params = new Map(Object.entries(filter as object));
    return this.db.all<T>(params);
  }
  /**
   * Updates an existing user.
   *
   * @param obj - The user to update, with the id set to the id of the user to update.
   * @returns A promise that resolves to the updated user if successful, or rejects if not.
   */
  update(id: number | string, obj: T): Promise<T> {
    const params = new Map(Object.entries(obj as object));
    return this.db.update<T>(id, params);
  }
  /**
   * Deletes a user by its id.
   *
   * @param id - The id of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   */
  delete(id: number | string): Promise<void> {
    return this.db.delete(id);
  }

  /**
   * Creates a new user.
   *
   * @param obj - The user to create.
   * @returns A promise that resolves to the created user if successful, or rejects if not.
   */
  async create(obj: T): Promise<T> {
    const params = new Map(Object.entries(obj as object));
    return this.db.insert<T>(params);
  }
}
