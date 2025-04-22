import type { IMethodName } from "@domain/interfaces/http/IMethodName";
import { HttpMethod } from "@infrastructure/http/HttpMethod";
import "reflect-metadata";


describe("HttpMethod Decorator", () => {
    it("should define metadata for httpMethod and routePath", () => {
        const mockHttpMethod: IMethodName = "get";
        const mockRoutePath = "/test-route";

        class TestController {
            @HttpMethod(mockHttpMethod, mockRoutePath)
            testMethod() {
                return "test";
            }
        }

        const target = TestController.prototype;
        const propertyKey = "testMethod";

        const httpMethodMetadata = Reflect.getMetadata("httpMethod", target, propertyKey);
        const routePathMetadata = Reflect.getMetadata("routePath", target, propertyKey);

        expect(httpMethodMetadata).toBe(mockHttpMethod);
        expect(routePathMetadata).toBe(mockRoutePath);
    });

    it("should preserve the original method functionality", async () => {
        const mockHttpMethod: IMethodName = "post";
        const mockRoutePath = "/another-route";

        class TestController {
            @HttpMethod(mockHttpMethod, mockRoutePath)
            async testMethod(arg: string) {
                return `Hello, ${arg}`;
            }
        }

        const controller = new TestController();
        const result = await controller.testMethod("World");

        expect(result).toBe("Hello, World");
    });
});