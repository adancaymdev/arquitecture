import type { ILogger } from "@domain/interfaces/logger/ILogger";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import { UserCreateTableMigration } from "../../../infrastructure/persistence/sql/user/migrations/UserCreateTableMigration";

describe("UserCreateTableMigration", () => {
    let dbMock: jest.Mocked<IDatabase>;
    let loggerMock: jest.Mocked<ILogger>;
    let migration: UserCreateTableMigration;

    beforeEach(() => {
        dbMock = {
            exec: jest.fn(),
        } as unknown as jest.Mocked<IDatabase>;

        loggerMock = {
            info: jest.fn(),
            error: jest.fn(),
        } as unknown as jest.Mocked<ILogger>;

        migration = new UserCreateTableMigration(loggerMock);
    });

    describe("up", () => {
        it("should create the users table if it does not exist", async () => {
            await migration.up(dbMock);

            expect(dbMock.exec).toHaveBeenCalledWith(expect.stringContaining("CREATE TABLE IF NOT EXISTS users"));
            expect(loggerMock.info).toHaveBeenCalledWith("User table created or altered");
        });
    });

    describe("down", () => {
        it("should drop the users table if it exists", async () => {
            await migration.down(dbMock);

            expect(dbMock.exec).toHaveBeenCalledWith(expect.stringContaining("DROP TABLE IF EXISTS users"));
            expect(loggerMock.info).toHaveBeenCalledWith("User table deleted");
        });
    });
});