import { LoggerConsole } from "../../../infrastructure/logger/LoggerConsole";

describe("LoggerConsole", () => {
    let logger: LoggerConsole;

    beforeEach(() => {
        logger = new LoggerConsole();
        jest.spyOn(console, "log").mockImplementation(() => {});
        jest.spyOn(console, "table").mockImplementation(() => {});
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });

    it("should log a message using console.log", () => {
        const message = "Test message";
        logger.log(message);
        expect(console.log).toHaveBeenCalledWith(message);
    });

    it("should log a message with optional parameters using console.log", () => {
        const message = "Test message";
        const param1 = "param1";
        const param2 = "param2";
        logger.log(message, param1, param2);
        expect(console.log).toHaveBeenCalledWith(message, param1, param2);
    });

    it("should log a table using console.table", () => {
        const data = [{ key: "value" }];
        logger.table(data);
        expect(console.table).toHaveBeenCalledWith(data);
    });

    it("should log an error message with [Error] prefix", () => {
        const message = "Error occurred";
        logger.error(message);
        expect(console.log).toHaveBeenCalledWith(`[Error]: ${message}`);
    });

    it("should log a success message with [Success] prefix", () => {
        const message = "Operation successful";
        logger.success(message);
        expect(console.log).toHaveBeenCalledWith(`[Success]: ${message}`);
    });

    it("should log an info message with [Info] prefix", () => {
        const message = "Informational message";
        logger.info(message);
        expect(console.log).toHaveBeenCalledWith(`[Info]: ${message}`);
    });

    it("should log a warning message with [Warn] prefix", () => {
        const message = "Warning message";
        logger.warn(message);
        expect(console.log).toHaveBeenCalledWith(`[Warn]: ${message}`);
    });
});