import { IController } from "../../application/interfaces/http/IController";
import { HttpServer } from "../../infrastructure/http/HttpServer";
import { UserController } from "../controllers/UserController";

export class UserServer extends HttpServer {
  controllers: IController[] = [new UserController()];
  constructor() {
    super({
      host: "localhost",
      port: 3000,
      protocol: "http",
      path: "api/v1/users",
    });
    this.addController(...this.controllers);
  }
}
