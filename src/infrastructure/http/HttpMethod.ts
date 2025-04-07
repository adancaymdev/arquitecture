import "reflect-metadata";
import type { IMethodName } from "../../application/interfaces/http/IMethodName";
import type { IRoute } from "../../application/interfaces/http/IRoute";

/**
 * Decorador para definir una ruta a partir de la implementación del handler.
 * El método decorado no tiene que retornar el objeto, ya que el decorador lo genera.
 *
 * @param httpMethod - Metodo HTTP para el endpoint.
 * @param routePath - Ruta o path para el endpoint.
 */
export function HttpMethod(
  httpMethod: IMethodName,
  routePath: string
): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    const originalMethod = descriptor.value;

    descriptor.value = function (): IRoute {
      return {
        method: httpMethod,
        path: routePath,
        handler: async (req: any, res: any) => {
          await originalMethod.call(this, req, res);
        },
      };
    };

    return descriptor;
  };
}
