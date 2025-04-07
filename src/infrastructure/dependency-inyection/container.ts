import { UserController } from "../../presentation/controllers/UserController";
import { LoggerConsole } from "../logger/LoggerConsole";
import { dependency } from "./dependency";

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
