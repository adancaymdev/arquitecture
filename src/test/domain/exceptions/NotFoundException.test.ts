import { NotFoundException } from "@domain/exceptions/NotFoundException";

describe("NotFoundException", () => {
    it("should create an instance with the correct message and code", () => {
        const message = "Resource not found";
        const exception = new NotFoundException(message);

        expect(exception.message).toBe(message);
        expect(exception.code).toBe(404);
    });

    it("should be an instance of Exception", () => {
        const exception = new NotFoundException("Test message");

        expect(exception).toBeInstanceOf(Error);
    });
});