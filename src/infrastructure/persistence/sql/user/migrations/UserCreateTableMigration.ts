import { ILogger } from "@domain/interfaces/logger/ILogger";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import type { IMigration } from "@domain/interfaces/persistence/IMigration";

export class UserCreateTableMigration implements IMigration {
  constructor(private readonly logger?: ILogger) {}

  async up(db: IDatabase): Promise<void> {
    await db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT
      );
    `);

    this.logger?.info("User table created");
  }

  async down(db: IDatabase): Promise<void> {
    await db.exec(`
      DROP TABLE IF EXISTS users;
    `);

    this.logger?.info("User table deleted");
  }
}
