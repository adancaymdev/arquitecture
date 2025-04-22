import { Logger } from "../../../../domain/abstracts/logger/Logger";

class TestLogger extends Logger {}

describe("Logger", () => {
    let logger: TestLogger;

    beforeEach(() => {
        logger = new TestLogger();
        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "table").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should log a message using log method", () => {
        const message = "Test message";
        const optionalParams = ["param1", "param2"];
        logger.log(message, ...optionalParams);
        expect(console.log).toHaveBeenCalledWith(message, ...optionalParams);
    });

    it("should log a table using table method", () => {
        const data = { key: "value" };
        const optionalParams = ["param1", "param2"];
        logger.table(data, ...optionalParams);
        expect(console.table).toHaveBeenCalledWith(data, ...optionalParams);
    });

    it("should log an error message using error method", () => {
        const message = "Error message";
        logger.error(message);
        expect(console.log).toHaveBeenCalledWith(message);
    });

    it("should log a success message using success method", () => {
        const message = "Success message";
        logger.success(message);
        expect(console.log).toHaveBeenCalledWith(message);
    });

    it("should log an informational message using info method", () => {
        const message = "Info message";
        logger.info(message);
        expect(console.log).toHaveBeenCalledWith(message);
    });

    it("should log a warning message using warn method", () => {
        const message = "Warning message";
        logger.warn(message);
        expect(console.log).toHaveBeenCalledWith(message);
    });
});