import type { IController } from "@domain/interfaces/http/IController";
import { IResponse } from "@domain/interfaces/http/IResponse";
import { IRepository } from "@domain/interfaces/repositories/IRepository";
import { HttpMethod } from "@infrastructure/http/HttpMethod";
import type { HttpRequest } from "@infrastructure/http/HttpRequest";
import type { HttpResponse } from "@infrastructure/http/HttpResponse";

/**
 * Controller that handles the requests related to users.
 */
export class HttpController<T> implements IController {

  constructor(protected readonly repository: IRepository<T>) {}
  /**
   * Retrieves a user by its id.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to the user if found, or rejects if not found.
   */
  @HttpMethod("get", "/:id") public async findOne(req: HttpRequest, res: HttpResponse): Promise<IResponse> {
    const id = await req.getParam("id");
    const user = await this.repository.findById(id);
    return res.json(user).end();
  }
  /**
   * Retrieves all users.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to an array of users.
   */
  @HttpMethod("get", "/") public async findAll(req: HttpRequest, res: HttpResponse): Promise<IResponse> {
    const query = await req.getQuery<Partial<T>>();
    const users = await this.repository.findAllBy(query);
    return res.json(users).end();
  }

  
  /**
   * Creates a new user.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to the created user.
   */
  @HttpMethod("post", "/") public async create(req: HttpRequest, res: HttpResponse): Promise<IResponse> {
    const user = await this.repository.create(await req.getBody<T>());
    return res.json(user).end();
  }

  /**
   * Updates a user by its id.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves to the updated user.
   */
   @HttpMethod("put", "/:id") public async update(req: HttpRequest, res: HttpResponse): Promise<IResponse> {
    const id = await req.getParam("id");
    const user = await this.repository.update(id, await req.getBody<Partial<T>>());
    return res.json(user).end();
  }
  
  /**
   * Deletes a user by its id.
   * @param req The request object.
   * @param res The response object.
   * @returns A promise that resolves when the user is deleted.
   */
  @HttpMethod("delete", "/:id") public async delete(req: HttpRequest, res: HttpResponse): Promise<IResponse> {
    const id = await req.getParam("id");
    await this.repository.delete(id);
    return res.status(204).end();
   }
}
