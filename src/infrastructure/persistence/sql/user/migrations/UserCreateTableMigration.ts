import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import type { IMigration } from "@domain/interfaces/persistence/IMigration";

class UserCreateTableMigration implements IMigration {
  private db: IDatabase;
  constructor(db: IDatabase) {
    this.db = db;
  }

  async up(): Promise<void> {
    await this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT
      );
    `);
  }

  async down(): Promise<void> {
    await this.db.exec(`
      DROP TABLE IF EXISTS users;
    `);
  }
}
