import { HttpController } from "@infrastructure/http/core/HttpController";
import type { HttpRequest } from "@infrastructure/http/core/HttpRequest";
import type { HttpResponse } from "@infrastructure/http/core/HttpResponse";
import {IUserRepository} from "@domain/interfaces/repositories/IUserRepository";
import {HttpMethod} from "@infrastructure/http/core/HttpMethod";
import type {IController} from "@domain/interfaces/http/IController";

/**
 * Controller that handles the requests related to users.
 */
@HttpController()
export class UserController implements IController{
  constructor(private readonly userRepository: IUserRepository) {}
  /**
   * Retrieves the user with the given id.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to the user with the given id.
   */
  @HttpMethod("get", "/:id")
  public async getOneUser(req: HttpRequest, res: HttpResponse): Promise<void> {
    const id = await req.getParam("id");
    const user = await this.userRepository.findById(id);
    res.json({ message: user });
  }

  @HttpMethod("get", "/")
  public async getAllUsers(req: HttpRequest, res: HttpResponse): Promise<void> {
    const users = await this.userRepository.findAll();
    res.json({ message: users });
  }
}
