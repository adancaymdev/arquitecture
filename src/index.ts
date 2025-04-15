import "reflect-metadata";
import {userMs} from "@infrastructure/dependency-inyection/container";

/**
 * Bootstraps the application by creating an instance of the UserServer class,
 * resolving it from the dependency injection container, and starting the server.
 * @returns {Promise<void>} A promise that resolves when the server starts successfully.
 */
const bootstrap = async () => {

  await userMs()
};

bootstrap();
