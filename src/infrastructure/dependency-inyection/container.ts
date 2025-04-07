import { LoggerConsole } from "@infrastructure/logger/LoggerConsole";
import { UserController } from "@presentation/controllers/UserController";
import { dependency } from "./dependency";

/**
 * This module provides the dependency injection container.
 *
 * The dependency injection container is a singleton that manages the instances of the application's components.
 * It provides a way to register components and retrieve them with their dependencies resolved.
 *
 * @packageDocumentation
 */
export const TOKENS = {
  UserServerOptions: "UserServerOptions",
  UserController: "UserController",
  UserControllers: "UserControllers",
  ILogger: "ILogger",
};

dependency.register(TOKENS.ILogger, LoggerConsole);
dependency.register(TOKENS.UserServerOptions, {
  useValue: {
    protocol: "http",
    host: "localhost",
    port: 3000,
    path: "api/v1/users",
  },
});
dependency.register(TOKENS.UserController, {
  useClass: UserController,
});

dependency.register(TOKENS.UserControllers, {
  useValue: [dependency.resolve(TOKENS.UserController)],
});
