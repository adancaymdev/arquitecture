import { User } from "@domain/entities/User";
import { IRepository } from "@domain/interfaces/repositories/IRepository";
import { HttpController } from "@infrastructure/http/HttpController";

/**
 * Controller that handles the requests related to users.
 */
export class UserController extends HttpController<User> {
  constructor(repository: IRepository<User>) {
    super(repository);
  }
}