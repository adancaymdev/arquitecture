import { ILogger } from "@domain/interfaces/logger/ILogger";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import type { IMigration } from "@domain/interfaces/persistence/IMigration";

export class UserCreateTableMigration implements IMigration {
  constructor(private readonly logger?: ILogger) {}

  /**
   * Creates the "users" table in the database if it does not already exist.
   * The table includes "id" as the primary key and "name" as a text column.
   * Logs a message indicating the creation of the table.
   *
   * @param db - The database instance on which to execute the SQL command.
   * @returns A promise that resolves once the table creation is complete.
   */

  async up(db: IDatabase): Promise<void> {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT
      );
    `);

    this.logger?.info("User table created");
  }

  /**
   * Drops the "users" table in the database if it exists.
   * Logs a message indicating the deletion of the table.
   *
   * @param db - The database instance on which to execute the SQL command.
   * @returns A promise that resolves once the table deletion is complete.
   */
  async down(db: IDatabase): Promise<void> {
    await db.exec(`
      DROP TABLE IF EXISTS users;
    `);

    this.logger?.info("User table deleted");
  }
}
