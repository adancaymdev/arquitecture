import { User } from "@domain/entities/User";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import { RepositorySQL } from "@infrastructure/persistence/sql/user/RepositorySQL";

export class UserRepositorySQL extends RepositorySQL<User> {
  /**
   * Constructor of the UserRepositorySQL class.
   * @param db - The database instance to use.
   */
  constructor(db: IDatabase) {
    super(db);
  }
}
