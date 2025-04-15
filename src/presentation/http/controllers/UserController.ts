import { User } from "@domain/entities/User";
import { IRepository } from "@domain/interfaces/repositories/IRepository";
import { HttpController } from "@infrastructure/http/HttpController";
import { HttpMethod } from "@infrastructure/http/HttpMethod";
import type { HttpRequest } from "@infrastructure/http/HttpRequest";
import type { HttpResponse } from "@infrastructure/http/HttpResponse";

/**
 * Controller that handles the requests related to users.
 */
export class UserController extends HttpController<User> {
  constructor(repository: IRepository<User>) {
    super(repository);
  }

  @HttpMethod("get", "/:name")
  public async findOneByName(req: HttpRequest, res: HttpResponse): Promise<void> {
    const id = await req.getParam("id");
    const user = await this.repository.findById(id);
    res.json(user);
  }
}