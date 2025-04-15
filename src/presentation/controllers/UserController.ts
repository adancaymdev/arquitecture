import type { HttpRequest } from "@infrastructure/http/core/HttpRequest";
import type { HttpResponse } from "@infrastructure/http/core/HttpResponse";
import {HttpMethod} from "@infrastructure/http/core/HttpMethod";
import type {IController} from "@domain/interfaces/http/IController";
import {IRepository} from "@domain/interfaces/repositories/IRepository";
import {User} from "@domain/entities/User";

/**
 * Controller that handles the requests related to users.
 */
export class UserController implements IController{
  constructor(private readonly repository: IRepository<User>) {}
  /**
   * Retrieves the user with the given id.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to the user with the given id.
   */
  @HttpMethod("get", "/:id")
  public async getOneUser(req: HttpRequest, res: HttpResponse): Promise<void> {
    const id = await req.getParam("id");
    const user = await this.repository.findById(id);
    res.json(user);
  }

  @HttpMethod("get", "/")
  public async getAllUsers(req: HttpRequest, res: HttpResponse): Promise<void> {
    const users = await this.repository.findAll();
    res.json( users );
  }
}
