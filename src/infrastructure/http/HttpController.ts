// ControllerRoutes.decorator.ts
import "reflect-metadata";
import type { IMethodName } from "../../application/interfaces/http/IMethodName";
import type { IRequest } from "../../application/interfaces/http/IRequest";
import type { IResponse } from "../../application/interfaces/http/IResponse";
import type { IRoute } from "../../application/interfaces/http/IRoute";

export function HttpController(): ClassDecorator {
  return function (constructor: Function) {
    const proto = constructor.prototype;
    for (const key of Object.getOwnPropertyNames(proto)) {
      if (key === "constructor") continue;
      const httpMethod: IMethodName | undefined = Reflect.getMetadata(
        "route:method",
        proto,
        key
      );
      const routePath: string | undefined = Reflect.getMetadata(
        "route:path",
        proto,
        key
      );
      const originalHandler: any = Reflect.getMetadata(
        "route:handler",
        proto,
        key
      );
      if (httpMethod && routePath && originalHandler) {
        proto[key] = function (): IRoute {
          return {
            method: httpMethod,
            path: routePath,
            handler: (req: IRequest, res: IResponse) => {
              return originalHandler.call(req, res);
            },
          };
        } as () => IRoute;
      }
    }
  };
}
