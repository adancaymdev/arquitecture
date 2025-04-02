import { Controller } from "../../application/abstracts/http/Controller";
import { IRoute } from "../../application/interfaces/http/IRoute";

export class UserController extends Controller {
  public getAllUsers(): IRoute {
    return {
      method: "get",
      path: "/",
      handler: async (req, res) => {
        res.json({
          data: await req.getBody(),
        });
      },
    };
  }

  public getOneUser(): IRoute {
    return {
      method: "get",
      path: "/:id",
      handler: async (req, res) => {
        const id = await req.getParam("id");
        res.json({ message: "Get one user with id: " + id });
      },
    };
  }

  public getOneUserByID(): IRoute {
    return {
      method: "get",
      path: "/one/:id",
      handler: async (req, res) => {
        const id = await req.getParam("id");
        res.json({ message: "Get one user with id: " + id });
      },
    };
  }
}
