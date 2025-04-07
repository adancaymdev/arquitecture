import { Controller } from "../../application/abstracts/http/Controller";
import { Injectable } from "../../infrastructure/dependency-inyection/dependency";
import { HttpController } from "../../infrastructure/http/HttpController";
import { HttpMethod } from "../../infrastructure/http/HttpMethod";
import type { HttpRequest } from "../../infrastructure/http/HttpRequest";
import type { HttpResponse } from "../../infrastructure/http/HttpResponse";

/**
 * Controller that handles the requests related to users.
 */
@Injectable()
@HttpController()
export class UserController extends Controller {
  /**
   * Retrieves the user with the given id.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to the user with the given id.
   */
  @HttpMethod("get", "/:id")
  public async getOneUser(req: HttpRequest, res: HttpResponse): Promise<void> {
    const id = await req.getParam("id");
    res.json({ message: "Get one user with id: " + id });
  }
}
