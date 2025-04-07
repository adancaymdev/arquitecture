import { User } from "@domain/entities/User";
import { InternalException } from "@domain/exceptions/InternalException";
import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { Database, open } from "sqlite";
import sqlite3 from "sqlite3";

export class UserRepositorySQL implements IUserRepository {
  /**
   * The database connection.
   */
  private db: Database;
  /**
   * The transaction database connection.
   */
  private transaction?: Database;

  constructor() {
    this.init();
  }

  /**
   * Retrieves all users.
   */
  async findAll(): Promise<User[]> {
    const executor = this.transaction ?? this.db;
    const rows = await executor.all<User[]>("SELECT * FROM users");
    return rows.map((row) => new User(row.id, row.name));
  }

  /**
   * Retrieves all users that match the specified filter.
   *
   * @param filter - The filter to apply.
   * @returns A promise that resolves to an array of users if found, or null if not found.
   */
  async findAllBy(filter: User): Promise<User[]> {
    const executor = this.transaction ?? this.db;
    const conditions: string[] = [];
    const values: any[] = [];

    if (filter.name) {
      conditions.push("name LIKE ?");
      values.push(`%${filter.name}%`);
    }

    const whereClause =
      conditions.length > 0 ? "WHERE " + conditions.join(" AND ") : "";
    const rows = await executor.all<User[]>(
      `SELECT * FROM users ${whereClause}`,
      values
    );

    return rows.map((row) => new User(row.id, row.name));
  }

  /**
   * Deletes a user by its id.
   *
   * @param id - The id of the user to delete.
   * @returns A promise that resolves when the user is deleted.
   */
  async delete(id: string): Promise<void> {
    await this.beginTransaction();
    try {
      await this.transaction!.run("DELETE FROM users WHERE id = ?", id);
      await this.commit();
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Retrieves a user by its id.
   *
   * @param id - The id of the user to retrieve.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  async findById(id: string): Promise<User | null> {
    const executor = this.transaction ?? this.db;
    const row = await executor.get<User>(
      "SELECT * FROM users WHERE id = ?",
      id
    );
    return row ? new User(row.id, row.name) : null;
  }

  /**
   * Updates an existing user.
   *
   * @param user - The user to update.
   * @returns A promise that resolves when the user is updated.
   */
  async update(user: User): Promise<User> {
    await this.beginTransaction();
    try {
      const sql = "UPDATE users SET name = ? WHERE id = ?";
      await this.transaction!.run(sql, [user.name, user.id]);
      const updatedUser = await this.findById(user.id);
      if (!updatedUser) {
        throw new InternalException("No se pudo actualizar el usuario");
      }
      await this.commit();
      return updatedUser;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Creates a new user.
   *
   * @param user - The user to create.
   * @returns A promise that resolves to the id of the created user.
   */
  async create(user: User): Promise<string> {
    await this.beginTransaction();
    try {
      await this.transaction!.run(
        "INSERT INTO users (id, name) VALUES (?, ?)",
        [user.id, user.name]
      );
      await this.commit();
      return user.id;
    } catch (error) {
      await this.rollback();
      throw error;
    }
  }

  /**
   * Initializes the database connection.
   */
  private async init() {
    this.db = await open({
      filename: "./src/infrastructure/persistence/sql/users.db",
      driver: sqlite3.Database,
    });

    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT
      );
    `);
  }

  /**
   * Begins a transaction.
   */
  private async beginTransaction(): Promise<void> {
    if (!this.transaction) {
      this.transaction = this.db;
      await this.db.exec("BEGIN TRANSACTION;");
    }
  }

  /**
   * Commits the current transaction.
   */
  private async commit(): Promise<void> {
    if (this.transaction) {
      await this.transaction.exec("COMMIT;");
      this.transaction = undefined;
    }
  }

  /**
   * Rolls back the current transaction.
   */
  private async rollback(): Promise<void> {
    if (this.transaction) {
      await this.transaction.exec("ROLLBACK;");
      this.transaction = undefined;
    }
  }
}
