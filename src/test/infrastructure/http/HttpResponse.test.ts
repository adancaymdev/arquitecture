import type { IRoute } from "@domain/interfaces/http/IRoute";
import { HttpResponse } from "@infrastructure/http/HttpResponse";
import { ServerResponse } from "http";


describe("HttpResponse", () => {
    let mockResponse: ServerResponse;
    let mockRoute: IRoute;
    let httpResponse: HttpResponse;

    beforeEach(() => {
        mockResponse = {
            statusCode: 200,
            setHeader: jest.fn(),
            end: jest.fn(),
        } as unknown as ServerResponse;

        mockRoute = {} as IRoute;

        httpResponse = new HttpResponse(mockResponse, mockRoute);
    });

    it("should set the status code using status()", () => {
        httpResponse.status(404);
        expect(mockResponse.statusCode).toBe(404);
    });

    it("should send data using send()", () => {
        const data = "Hello, world!";
        httpResponse.send(data);
        expect(mockResponse.end).toHaveBeenCalledWith(data);
    });

    it("should send JSON data using json()", () => {
        const data = { message: "Hello, JSON!" };
        httpResponse.json(data);
        expect(mockResponse.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
        expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it("should send JSON data with a custom status code using json()", () => {
        const data = { message: "Custom status" };
        httpResponse.json(data, 201);
        expect(mockResponse.statusCode).toBe(201);
        expect(mockResponse.setHeader).toHaveBeenCalledWith("Content-Type", "application/json");
        expect(mockResponse.end).toHaveBeenCalledWith(JSON.stringify(data));
    });

    it("should end the response using end()", () => {
        httpResponse.end();
        expect(mockResponse.end).toHaveBeenCalled();
    });
});