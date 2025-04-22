import { IRoute } from "@domain/interfaces/http/IRoute";
import { IServerOptions } from "@domain/interfaces/http/IServerOptions";
import { ILogger } from "@domain/interfaces/logger/ILogger";
import { HttpRequest } from "@infrastructure/http/HttpRequest";
import { HttpResponse } from "@infrastructure/http/HttpResponse";
import { HttpServer } from "@infrastructure/http/HttpServer";
import { IncomingMessage, ServerResponse } from "http";

describe("HttpServer - handleRoute", () => {
    let httpServer: HttpServer;
    let mockLogger: ILogger;
    let mockOptions: IServerOptions;

    beforeEach(() => {
        mockLogger = {
            success: jest.fn(),
            error: jest.fn(),
            info: jest.fn(),
            log: jest.fn(),
            table: jest.fn(),
            warn: jest.fn(),
        };
        mockOptions = {
            protocol: "http",
            host: "localhost",
            port: 3000,
            path: "api",
        };
        httpServer = new HttpServer(mockOptions, mockLogger);
    });

    it("should call the route handler with HttpRequest and HttpResponse", async () => {
        const mockReq = {} as IncomingMessage;
        const mockRes = {} as ServerResponse;
        const mockRoute: IRoute = {
            handler: jest.fn().mockResolvedValue({ statusCode: 200 }),
            method: "get",
            path: ""
        };

        const result = await httpServer["handleRoute"](mockReq, mockRes, mockRoute);

        expect(mockRoute.handler).toHaveBeenCalledWith(
            expect.any(HttpRequest),
            expect.any(HttpResponse)
        );
        expect(result).toEqual({ statusCode: 200 });
    });

    it("should log the request on close", async () => {
        const mockReq = {} as IncomingMessage;
        const mockRes = { statusCode: 200 } as ServerResponse;
        const mockRoute: IRoute = {
            handler: jest.fn().mockResolvedValue({ statusCode: 200 }),
            method: "get",
            path: ""
        };

        const logRequestOnCloseSpy = jest.spyOn(
            httpServer as any,
            "logRequestOnClose"
        );

        await httpServer["handleRoute"](mockReq, mockRes, mockRoute);

        expect(logRequestOnCloseSpy).toHaveBeenCalledWith(
            mockReq,
            mockRes,
            expect.any(BigInt)
        );
    });

    it("should handle errors thrown by the route handler", async () => {
        const mockReq = {} as IncomingMessage;
        const mockRes = { statusCode: 500 } as ServerResponse;
        const mockRoute: IRoute = {
            handler: jest.fn().mockRejectedValue(new Error("Handler error")),
            method: "get",
            path: ""
        };

        await expect(
            httpServer["handleRoute"](mockReq, mockRes, mockRoute)
        ).rejects.toThrow("Handler error");
    });
});