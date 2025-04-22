import { NotFoundException } from "@domain/exceptions/NotFoundException";
import type { IDatabase } from "@domain/interfaces/persistence/IDatabase";
import { SqliteRepository } from "../../../infrastructure/persistence/sql/sqlite/SqliteRepository";

interface TestEntity {
    id: string;
    name: string;
}

class TestSqliteRepository extends SqliteRepository<TestEntity> {}

describe("SqliteRepository", () => {
    let dbMock: jest.Mocked<IDatabase>;
    let repository: TestSqliteRepository;

    beforeEach(() => {
        dbMock = {
            insert: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            get: jest.fn(),
            all: jest.fn(),
            exec: jest.fn(),
        }
        repository = new TestSqliteRepository(dbMock);
    });

    describe("findById", () => {
        it("should return the entity if found", async () => {
            const entity = { id: "1", name: "Test" };
            dbMock.get.mockResolvedValue(entity);

            const result = await repository.findById("1");

            expect(result).toEqual(entity);
            expect(dbMock.get).toHaveBeenCalledWith(new Map([["id", "1"]]));
        });

        it("should throw NotFoundException if the entity is not found", async () => {
            dbMock.get.mockResolvedValue(null);

            await expect(repository.findById("1")).rejects.toThrow(NotFoundException);
            expect(dbMock.get).toHaveBeenCalledWith(new Map([["id", "1"]]));
        });
    });

    describe("findAll", () => {
        it("should return all entities", async () => {
            const entities = [{ id: "1", name: "Test" }];
            dbMock.all.mockResolvedValue(entities);

            const result = await repository.findAll();

            expect(result).toEqual(entities);
            expect(dbMock.all).toHaveBeenCalled();
        });
    });

    describe("findAllBy", () => {
        it("should return entities matching the filter", async () => {
            const filter = { name: "Test" };
            const entities = [{ id: "1", name: "Test" }];
            dbMock.all.mockResolvedValue(entities);

            const result = await repository.findAllBy(filter);

            expect(result).toEqual(entities);
            expect(dbMock.all).toHaveBeenCalledWith(new Map(Object.entries(filter)));
        });
    });

    describe("update", () => {
        it("should update the entity and return the updated entity", async () => {
            const updatedEntity = { id: "1", name: "Updated" };
            dbMock.update.mockResolvedValue(updatedEntity);

            const result = await repository.update("1", { name: "Updated" });

            expect(result).toEqual(updatedEntity);
            expect(dbMock.update).toHaveBeenCalledWith(
                "1",
                new Map(Object.entries({ name: "Updated" }))
            );
        });
    });

    describe("delete", () => {
        it("should delete the entity", async () => {
            dbMock.delete.mockResolvedValue();

            await repository.delete("1");

            expect(dbMock.delete).toHaveBeenCalledWith("1");
        });
    });

    describe("create", () => {
        it("should create a new entity and return it", async () => {
            const newEntity = { id: "1", name: "New" };
            dbMock.insert.mockResolvedValue(newEntity);

            const result = await repository.create(newEntity);

            expect(result).toEqual(newEntity);
            expect(dbMock.insert).toHaveBeenCalledWith(
                new Map(Object.entries(newEntity))
            );
        });
    });
});