import { User } from "@domain/entities/User";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import { SqliteRepository } from "@infrastructure/persistence/sql/sqlite/SqliteRepository";

export class UserRepositorySqlite extends SqliteRepository<User> {
  /**
   * Constructor of the UserRepositorySQL class.
   * @param db - The database instance to use.
   */
  constructor(db: IDatabase) {
    super(db);
  }
}
