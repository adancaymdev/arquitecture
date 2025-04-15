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
    // Create table if it does not exist
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT,
        email TEXT,
        password TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        deletedAt DATETIME DEFAULT NULL
      );
    `);

    // Attempt to alter table to ensure required columns exist
    const columnsToEnsure = [
      { name: "id", type: "INTEGER PRIMARY KEY AUTOINCREMENT" },
      { name: "name", type: "TEXT" },
      { name: "email", type: "TEXT" },
      { name: "password", type: "TEXT" },
      { name: "createdAt", type: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
      { name: "updatedAt", type: "DATETIME DEFAULT CURRENT_TIMESTAMP" },
      { name: "deletedAt", type: "DATETIME DEFAULT NULL" },
    ];

    for (const column of columnsToEnsure) {
      try {
        await db.exec(
          `ALTER TABLE users ADD COLUMN ${column.name} ${column.type};`
        );
      } catch (e: any) {
        if (!e.message.includes("duplicate column name")) {
          throw e;
        }
      }
    }

    this.logger?.info("User table created or altered");
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
