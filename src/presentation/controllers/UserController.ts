import { User } from "@domain/entities/User";
import type { IController } from "@domain/interfaces/http/IController";
import { IRepository } from "@domain/interfaces/repositories/IRepository";
import { HttpMethod } from "@infrastructure/http/core/HttpMethod";
import type { HttpRequest } from "@infrastructure/http/core/HttpRequest";
import type { HttpResponse } from "@infrastructure/http/core/HttpResponse";

/**
 * Controller that handles the requests related to users.
 */
export class UserController implements IController {
  constructor(private readonly repository: IRepository<User>) {}
  @HttpMethod("get", "/:id")
  /**
   * Retrieves a user by its id.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to the user if found, or rejects if not found.
   */
  public async getOneUser(req: HttpRequest, res: HttpResponse): Promise<void> {
    const id = await req.getParam("id");
    const user = await this.repository.findById(id);
    res.json(user);
  }

  @HttpMethod("get", "/")
  /**
   * Retrieves all users.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to an array of users.
   */
  public async getAllUsers(req: HttpRequest, res: HttpResponse): Promise<void> {
    const users = await this.repository.findAll();
    res.json(users);
  }
}
