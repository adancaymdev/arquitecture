import { ILogger } from "@domain/interfaces/logger/ILogger";
import sqlite3 from "sqlite3";
import { SqliteAdapter } from "../../../infrastructure/persistence/sql/sqlite/SqliteAdapter";

jest.mock("sqlite3");

describe("SqliteAdapter Constructor", () => {
    const mockDatabase = jest.fn();
    const mockLogger: ILogger = {
        table: jest.fn(),
        log: function (message?: any, ...optionalParams: any[]): void {
            throw new Error("Function not implemented.");
        },
        error: function (message: string): void {
            throw new Error("Function not implemented.");
        },
        success: function (message: string): void {
            throw new Error("Function not implemented.");
        },
        info: function (message: string): void {
            throw new Error("Function not implemented.");
        },
        warn: function (message: string): void {
            throw new Error("Function not implemented.");
        }
    };

    beforeAll(() => {
        (sqlite3.Database as unknown as jest.Mock).mockImplementation(mockDatabase);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should initialize with the given path, table, and logger", () => {
        const path = "test.db";
        const table = "test_table";

        const adapter = new SqliteAdapter(path, table, mockLogger);

        expect(mockDatabase).toHaveBeenCalledWith(path);
        expect(adapter).toBeDefined();
        expect((adapter as any).table).toBe(table);
        expect((adapter as any).logger).toBe(mockLogger);
    });

    it("should initialize without a logger if not provided", () => {
        const path = "test.db";
        const table = "test_table";

        const adapter = new SqliteAdapter(path, table);

        expect(mockDatabase).toHaveBeenCalledWith(path);
        expect(adapter).toBeDefined();
        expect((adapter as any).table).toBe(table);
        expect((adapter as any).logger).toBeUndefined();
    });
});