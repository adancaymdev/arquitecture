import { ILogger } from "@domain/interfaces/logger/ILogger";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import sqlite3 from "sqlite3";

export class SqliteAdapter implements IDatabase {
  private db: sqlite3.Database;
  private table: string;
  private logger?: ILogger;

  /**
   * Constructor of the SqliteAdapter class.
   * @param path - The path to the sqlite database file.
   * @param table - The name of the table.
   * @param logger - The logger to use. Optional.
   */
  constructor(path: string, table: string, logger?: ILogger) {
    if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(table)) {
      throw new Error(`Invalid table name: ${table}`);
    }
    this.db = new sqlite3.Database(path);
    this.table = table;
    this.logger = logger;
  }

  async exec(sql: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.logger?.table({ query: sql });
      this.db.exec(sql, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }

  /**
   * Inserts a new record in the database.
   *
   * @param params - A map of column names to their respective values.
   * @returns A promise that resolves to the inserted record.
   * @throws An error if no parameters are provided.
   * @throws An error if the record could not be inserted.
   */
  async insert<T>(params: Map<string, unknown>): Promise<T> {
    if (params.size === 0) {
      throw new Error("No parameters provided for insert");
    }

    const keys = Array.from(params.keys());
    const values = Array.from(params.values());
    const placeholders = keys.map(() => "?").join(", ");

    try {
      const query = `INSERT INTO ${this.table} (${keys.join(
        ", "
      )}) VALUES (${placeholders})`;

      const id = await this.run(query, ...values);
      return this.get<T>(new Map([["id", id]]));
    } catch (error) {
      throw new Error(
        `Failed to insert record: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Updates an existing record.
   *
   * @param id - The id of the record to update.
   * @param params - The parameters to update. The keys of the map are the column names,
   * and the values are the new values for the columns.
   * @returns A promise that resolves to the updated record.
   */
  async update<T>(
    id: number | string,
    params: Map<string, unknown>
  ): Promise<T> {
    const keys = Array.from(params.keys());
    const values = Array.from(params.values());
    const assignments = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE ${this.table} SET ${assignments} WHERE id = ?`;

    const result = await this.run(query, ...values, id);
    return this.get<T>(new Map([["id", result]]));
  }

  async all<T>(params?: Map<string, unknown>): Promise<T[]> {
    const { clause, values } = this.buildWhereClause(params);
    const query = `SELECT * FROM ${this.table} ${
      params ? "WHERE" : ""
    } ${clause}`;

    return new Promise<T[]>((resolve, reject) => {
      this.logger?.table(query);
      this.logger?.table(values);
      this.db.all<T>(query, values, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }

  async get<T>(params: Map<string, unknown>): Promise<T> {
    const { clause, values } = this.buildWhereClause(params);
    const query = `SELECT * FROM ${this.table} WHERE ${clause}`;

    return new Promise<T>((resolve, reject) => {
      this.logger?.table(query);
      this.logger?.table(values);
      this.db.get<T>(query, values, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  }

  async delete(id: number | string): Promise<void> {
    const query = `DELETE FROM ${this.table} WHERE id = ?`;
    await this.run(query, id);
  }

  private async run(query: string, ...params: unknown[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.logger?.table(query);
      this.logger?.table(params);
      this.db.run(query, params, function (err) {
        if (err) reject(err);
        else resolve(this.lastID);
      });
    });
  }

  private buildWhereClause(params?: Map<string, unknown>): {
    clause: string;
    values: unknown[];
  } {
    if (!params) {
      return {
        clause: "",
        values: [],
      };
    }
    const conditions: string[] = [];
    const values: unknown[] = [];

    for (const [key, value] of params) {
      conditions.push(`${key} = ?`);
      values.push(value);
    }

    return {
      clause: conditions.join(" AND "),
      values,
    };
  }
}
