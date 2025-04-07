import "reflect-metadata";

import type { IServer } from "@domain/interfaces/http/IServer";
import { dependency } from "@infrastructure/dependency-inyection/dependency";
import { UserServer } from "@infrastructure/http/UserServer";

/**
 * Bootstraps the application by creating an instance of the UserServer class,
 * resolving it from the dependency injection container, and starting the server.
 * @returns {Promise<void>} A promise that resolves when the server starts successfully.
 */
const bootstrap = async () => {
  const server = dependency.resolve<IServer>(UserServer);
  await server.listen();
};

bootstrap();
