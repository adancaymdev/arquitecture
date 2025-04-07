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
    // Guarda la implementación original del método (el handler)
    const originalMethod = descriptor.value;

    // Se modifica el descriptor para que el método devuelva un IRoute
    descriptor.value = function (): IRoute {
      return {
        method: httpMethod,
        path: routePath,
        // Se utiliza una función handler que ejecuta la implementación original
        handler: async (req: any, res: any) => {
          // Llama al método original (el handler) con el contexto y parámetros correspondientes
          // Nota: el método original no debe retornar nada, solo ejecutar la lógica
          await originalMethod.call(this, req, res);
        },
      };
    };

    return descriptor;
  };
}
