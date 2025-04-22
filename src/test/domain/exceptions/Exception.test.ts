import { Exception } from "@domain/exceptions/Exception";

describe('Exception', () => {
    it('should create an instance of Exception with the provided message and code', () => {
        const message = 'Test error message';
        const code = 400;

        const exception = new Exception({ message, code });

        expect(exception).toBeInstanceOf(Exception);
        expect(exception.message).toBe(message);
        expect(exception.code).toBe(code);
    });

    it('should inherit from the Error class', () => {
        const exception = new Exception({ message: 'Error message', code: 500 });

        expect(exception).toBeInstanceOf(Error);
    });

    it('should have a default stack trace', () => {
        const exception = new Exception({ message: 'Error message', code: 500 });

        expect(exception.stack).toBeDefined();
    });


});