import { BadRequestException } from "@domain/exceptions/BadRequestException";

describe("BadRequestException", () => {
    it("should create an instance with the correct message and code", () => {
        const message = "Invalid request data";
        const exception = new BadRequestException(message);

        expect(exception.message).toBe(message);
        expect(exception.code).toBe(400);
    });

    it("should be an instance of Exception", () => {
        const exception = new BadRequestException("Test message");

        expect(exception).toBeInstanceOf(Error);
        expect(exception).toBeInstanceOf(BadRequestException);
    });
});