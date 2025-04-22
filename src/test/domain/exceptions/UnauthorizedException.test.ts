import { UnauthorizedException } from "@domain/exceptions/UnauthorizedException";

describe("UnauthorizedException", () => {
    it("should create an instance with the provided message and code 401", () => {
        const message = "Unauthorized access";
        const exception = new UnauthorizedException(message);

        expect(exception.message).toBe(message);
        expect(exception.code).toBe(401);
    });

    it("should be an instance of Exception", () => {
        const exception = new UnauthorizedException("Unauthorized access");

        expect(exception).toBeInstanceOf(Error);
        expect(exception).toBeInstanceOf(Object);
    });
});
