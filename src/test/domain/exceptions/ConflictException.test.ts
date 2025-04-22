import { ConflictException } from "@domain/exceptions/ConflictException";

describe("ConflictException", () => {
    it("should create an instance with the correct message and code", () => {
        const message = "Conflict occurred";
        const exception = new ConflictException(message);

        expect(exception.message).toBe(message);
        expect(exception.code).toBe(409);
    });
});