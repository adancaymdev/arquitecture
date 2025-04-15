import { IMethodHandler } from "@domain/interfaces/http/IMethodHandler";
import type { IMethodName } from "@domain/interfaces/http/IMethodName";
import type { IRoute } from "@domain/interfaces/http/IRoute";
import "reflect-metadata";

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
    const originalMethod: IMethodHandler = descriptor.value;
    descriptor.value = function (): IRoute {
      return {
        method: httpMethod,
        path: routePath,
        handler: originalMethod,
      };
    };
    return descriptor;
  };
}
