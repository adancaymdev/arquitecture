import { BadRequestException } from "@domain/exceptions/BadRequestException";
import { IRequest } from "@domain/interfaces/http/IRequest";
import { IResponse } from "@domain/interfaces/http/IResponse";
import { IRoute } from "@domain/interfaces/http/IRoute";
import { IServerOptions } from "@domain/interfaces/http/IServerOptions";
import { HttpRequest } from "@infrastructure/http/HttpRequest";
import { IncomingMessage } from "http";
import { Readable } from "stream";


describe("HttpRequest", () => {
    const mockRequest = (url: string, headers: Record<string, string> = {}, body: string = ""): IncomingMessage => {
        const req = new Readable() as unknown as IncomingMessage;
    
        req.url = url;
        req.headers = headers;
    
        // Simula que el objeto es "readable"
        req._read = () => {}; // Implementa un método _read vacío para evitar errores
    
        // Simula el cuerpo de la solicitud
        if (body) {
            setImmediate(() => {
                req.emit("data", body);
                req.emit("end");
            });
        }
    
        return req;
    };
    const mockOptions: IServerOptions = {
        protocol: "http",
        host: "localhost",
        port: 3000,
        path: ""
    };

    const mockRoute: IRoute = {
        path: "/users/:id",
        method: "get",
        handler: async (req: IRequest, res: IResponse): Promise<IResponse> => {
            const userId = await req.getParam("id");
            return res.send({ userId });
        }
    };

    describe("getParam", () => {
        it("should return the correct route parameter", async () => {
            const request = mockRequest("/users/123");
            const httpRequest = new HttpRequest(request, mockOptions, mockRoute);

            const param = await httpRequest.getParam("id");
            expect(param).toBe("123");
        });

        it("should throw BadRequestException if the parameter is not found", async () => {
            const request = mockRequest("/users");
            const httpRequest = new HttpRequest(request, mockOptions, mockRoute);

            await expect(httpRequest.getParam("id")).rejects.toThrow(BadRequestException);
        });
    });

    describe("getQuery", () => {
        it("should return the query parameters as an object", async () => {
            const request = mockRequest("/users?name=John&age=30");
            const httpRequest = new HttpRequest(request, mockOptions, mockRoute);

            const query = await httpRequest.getQuery();
            expect(query).toEqual({ name: "John", age: "30" });
        });

        it("should return an empty object if no query parameters are present", async () => {
            const request = mockRequest("/users");
            const httpRequest = new HttpRequest(request, mockOptions, mockRoute);

            const query = await httpRequest.getQuery();
            expect(query).toEqual({});
        });
    });

    describe("getHeaders", () => {
        it("should return the headers as an object", async () => {
            const headers = { "content-type": "application/json" };
            const request = mockRequest("/users", headers);
            const httpRequest = new HttpRequest(request, mockOptions, mockRoute);

            const resultHeaders = await httpRequest.getHeaders();
            expect(resultHeaders).toEqual(headers);
        });
    });
    describe("getBody", () => {
        it("should return the parsed JSON body", async () => {
          const request = mockRequest("/users");
          const httpRequest = new HttpRequest(request, mockOptions, mockRoute);
      
          const bodyData = { name: "John", age: 30 };
          const bodyString = JSON.stringify(bodyData);
      
          // Simula el flujo de datos del cuerpo
          setImmediate(() => {
            request.emit("data", bodyString);
            request.emit("end");
          });
      
          const body = await httpRequest.getBody();
          expect(body).toEqual(bodyData);
        });
      
        it("should throw BadRequestException if the body is not valid JSON", async () => {
          const request = mockRequest("/users");
          const httpRequest = new HttpRequest(request, mockOptions, mockRoute);
      
          // Simula un cuerpo con JSON inválido
          setImmediate(() => {
            request.emit("data", "invalid-json");
            request.emit("end");
          });
      
          await expect(httpRequest.getBody()).rejects.toThrow(BadRequestException);
        });
      });
});