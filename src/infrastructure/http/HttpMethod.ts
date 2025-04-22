import type { IMethodName } from "@domain/interfaces/http/IMethodName";
import "reflect-metadata";

/**
 * Decorador para definir una ruta a partir de la implementación del handler.
 * @param httpMethod - Método HTTP para el endpoint.
 * @param routePath - Ruta o path para el endpoint.
 */
export function HttpMethod(
  httpMethod: IMethodName,
  routePath: string
): MethodDecorator {
  return (target, propertyKey, descriptor: PropertyDescriptor) => {
    // Almacena los metadatos de la ruta en el prototipo del controlador
    Reflect.defineMetadata("httpMethod", httpMethod, target, propertyKey);
    Reflect.defineMetadata("routePath", routePath, target, propertyKey);

    // Mantiene la lógica original del método
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      return await originalMethod.apply(this, args);
    };

    return descriptor;
  };
}