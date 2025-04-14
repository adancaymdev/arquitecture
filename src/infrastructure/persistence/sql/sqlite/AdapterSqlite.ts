import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import type sqlite3 from "sqlite3";

export class SqliteAdapter implements IDatabase {
  private db: sqlite3.Database;
  private table: string;

  constructor(db: sqlite3.Database, table: string) {
    this.db = db;
    this.table = table;
  }
  exec(sql: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.db.run(sql, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  async insert<T>(params: Map<string, unknown>): Promise<T> {
    const keys = Array.from(params.keys());
    const values = Array.from(params.values());
    const placeholders = keys.map(() => "?").join(", ");

    const query = `INSERT INTO ${this.table} (${keys.join(
      ", "
    )}) VALUES (${placeholders})`;

    const id = await this.run(query, ...values);

    return this.get<T>(new Map([["id", id]]));
  }

  async update<T>(
    id: number | string,
    params: Map<string, unknown>
  ): Promise<T> {
    const keys = Array.from(params.keys());
    const values = Array.from(params.values());
    const assignments = keys.map((key) => `${key} = ?`).join(", ");
    const query = `UPDATE ${this.table} SET ${assignments} WHERE id = ?`;

    const result = await this.run(query, ...values, id);
    return this.get<T>(new Map([["id", id]]));
  }

  async all<T>(params?: Map<string, unknown>): Promise<T[]> {
    if (!params) {
      return new Promise<T[]>((resolve, reject) => {
        this.db.all<T>(`SELECT * FROM ${this.table}`, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    } else {
      const { clause, values } = this.buildWhereClause(params);
      const query = `SELECT * FROM ${this.table} WHERE ${clause}`;

      return new Promise<T[]>((resolve, reject) => {
        this.db.all<T>(query, values, (err, rows) => {
          if (err) {
            reject(err);
          } else {
            resolve(rows);
          }
        });
      });
    }
  }

  async get<T>(params: Map<string, unknown>): Promise<T> {
    const { clause, values } = this.buildWhereClause(params);
    const query = `SELECT * FROM ${this.table} WHERE ${clause}`;

    return new Promise<T>((resolve, reject) => {
      this.db.get<T>(query, values, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  async delete(id: number | string): Promise<void> {
    await this.run(`DELETE FROM ${this.table} WHERE id = ?`, id);
  }

  private async run(query: string, ...params: unknown[]): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.db.run(query, params, function (err) {
        if (err) {
          reject(err);
        } else {
          resolve(this.lastID);
        }
      });
    });
  }
  private buildWhereClause(params: Map<string, unknown>): {
    clause: string;
    values: unknown[];
  } {
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
