import { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import { UserRepositorySqlite } from "@infrastructure/persistence/sql/user/UserRepositorySqlite";

describe("UserRepositorySqlite", () => {
    let mockDatabase: IDatabase;
    let userRepository: UserRepositorySqlite;

    beforeEach(() => {
        mockDatabase = {
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
            all: jest.fn(),
            exec: jest.fn(),
        };
        userRepository = new UserRepositorySqlite(mockDatabase);
    });

    it("should create an instance of UserRepositorySqlite", () => {
        expect(userRepository).toBeInstanceOf(UserRepositorySqlite);
    });

    it("should call the parent constructor with the database instance", () => {
        expect((userRepository as any).db).toBe(mockDatabase);
    });
});