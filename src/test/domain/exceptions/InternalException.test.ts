import { InternalException } from "@domain/exceptions/InternalException";

describe("InternalException", () => {
    it("should create an instance of InternalException with the correct message and code", () => {
        const message = "An unexpected error occurred";
        const exception = new InternalException(message);

        expect(exception).toBeInstanceOf(InternalException);
        expect(exception.message).toBe(message);
        expect(exception.code).toBe(500);
    });
});