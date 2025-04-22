import { ForbiddenException } from "@domain/exceptions/ForbiddenException";

describe("ForbiddenException", () => {
    it("should create an instance of ForbiddenException with the correct message and code", () => {
        const message = "Access denied";
        const exception = new ForbiddenException(message);

        expect(exception).toBeInstanceOf(ForbiddenException);
        expect(exception.message).toBe(message);
        expect(exception.code).toBe(403);
    });

    it("should inherit from the Exception class", () => {
        const exception = new ForbiddenException("Test message");

        expect(exception).toBeInstanceOf(Error); // Assuming Exception extends Error
    });


});