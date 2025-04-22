import "reflect-metadata";
import {Server} from "./Server";
import {IController} from "@domain/interfaces/http/IController";
import {IServerOptions} from "@domain/interfaces/http/IServerOptions";
import {BadRequestException} from "@domain/exceptions/BadRequestException";


class MockController implements IController {
    someMethod(req: any, res: any) {
        return res
    }
}

describe("Server", () => {
    let server: Server;
    const mockOptions: IServerOptions = {
        host: "localhost",
        port: 3000,
        protocol: "http",
        path: "/api",
    };

    const mockController = new MockController();

    beforeEach(() => {
        server = new (class extends Server {
            public listen(): Promise<void> {
                return Promise.resolve();
            }

            public handleRoute(): Promise<any> {
                return Promise.resolve();
            }
        })(mockOptions);
    });

    it("addController should register routes from controllers", () => {

        Reflect.defineMetadata("httpMethod", "get", mockController, "someMethod");
        Reflect.defineMetadata("routePath", "/some-path", mockController, "someMethod");


        server.addController(mockController);


        expect(server["routes"]).toHaveLength(1);
        expect(server["routes"][0]).toMatchObject({
            name: "someMethod",
            path: "/api/some-path",
            method: "get",
        });
    });

    it("addController should throw an error if a route with the same name is already registered", () => {

        Reflect.defineMetadata("httpMethod", "get", mockController, "someMethod");
        Reflect.defineMetadata("routePath", "/some-path", mockController, "someMethod");

        server.addController(mockController);

        expect(() => server.addController(mockController)).toThrow(
            "Route with name someMethod already exists in the server."
        );
    });

    it("getRoute should return the correct route for a valid method and path", () => {

        Reflect.defineMetadata("httpMethod", "get", mockController, "someMethod");
        Reflect.defineMetadata("routePath", "/some-path", mockController, "someMethod");

        server.addController(mockController);

        const route = server["getRoute"]("get", "/api/some-path");

        expect(route).toBeDefined();
        expect(route?.name).toBe("someMethod");
    });

    it("getRoute should throw BadRequestException if method or path is missing", () => {
        expect(() => server["getRoute"](undefined, "/api/some-path")).toThrow(BadRequestException);
        expect(() => server["getRoute"]("get", undefined)).toThrow(BadRequestException);
    });

    it("getRoute should throw BadRequestException if no matching route is found", () => {
        expect(() => server["getRoute"]("post", "/api/unknown-path")).toThrow(
            BadRequestException
        );
    });
});