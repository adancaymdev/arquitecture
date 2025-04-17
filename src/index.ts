import { userMs } from "@infrastructure/dependency/container";
import { LoggerConsole } from "@infrastructure/logger/LoggerConsole";
import "reflect-metadata";

/**
 * Bootstraps the application by creating an instance of the UserServer class,
 * resolving it from the dependency injection container, and starting the server.
 * @returns {Promise<void>} A promise that resolves when the server starts successfully.
 */
async function bootstrapApplication(): Promise<void> {
  await userMs({
    logger: new LoggerConsole(),
    port: 3000,
  });  
}

bootstrapApplication();
