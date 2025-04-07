import { Controller } from "../../application/abstracts/http/Controller";
import { Injectable } from "../../infrastructure/dependency-inyection/dependency";
import { HttpController } from "../../infrastructure/http/HttpController";
import { HttpMethod } from "../../infrastructure/http/HttpMethod";
import type { HttpRequest } from "../../infrastructure/http/HttpRequest";
import type { HttpResponse } from "../../infrastructure/http/HttpResponse";

/**
 * User controller.
 */
@Injectable()
@HttpController()
export class UserController extends Controller {
  @HttpMethod("get", "/:id")
  /**
   * Gets a user by its ID.
   * @param req - The request that contains the user ID as a route parameter.
   * @param res - The response that will be sent with the user data.
   */
  public async getOneUser(req: HttpRequest, res: HttpResponse): Promise<void> {
    const id = await req.getParam("id");
    res.json({ message: "Get one user with id: " + id });
  }
}
