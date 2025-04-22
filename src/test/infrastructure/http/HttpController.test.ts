import { IRepository } from "@domain/interfaces/repositories/IRepository";
import { HttpController } from "@infrastructure/http/HttpController";
import { HttpRequest } from "@infrastructure/http/HttpRequest";
import { HttpResponse } from "@infrastructure/http/HttpResponse";

describe("HttpController", () => {
    let repository: jest.Mocked<IRepository<any>>;
    let controller: HttpController<any>;
    let req: jest.Mocked<HttpRequest>;
    let res: jest.Mocked<HttpResponse>;

    beforeEach(() => {
        repository = {
            findById: jest.fn(),
            findAllBy: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<IRepository<any>>;

        req = {
            getParam: jest.fn(),
            getQuery: jest.fn(),
            getBody: jest.fn(),
        } as unknown as jest.Mocked<HttpRequest>;

        res = {
            json: jest.fn().mockReturnThis(),
            status: jest.fn().mockReturnThis(),
            end: jest.fn(),
        } as unknown as jest.Mocked<HttpResponse>;

        controller = new HttpController(repository);
    });

    it("should retrieve a user by id", async () => {
        const userId = "123";
        const user = { id: userId, name: "John Doe" };
        req.getParam.mockResolvedValue(userId);
        repository.findById.mockResolvedValue(user);

        await controller.findOne(req, res);

        expect(req.getParam).toHaveBeenCalledWith("id");
        expect(repository.findById).toHaveBeenCalledWith(userId);
        expect(res.json).toHaveBeenCalledWith(user);
        expect(res.end).toHaveBeenCalled();
    });

    it("should retrieve all users", async () => {
        const query = { name: "John" };
        const users = [{ id: "123", name: "John Doe" }];
        req.getQuery.mockResolvedValue(query);
        repository.findAllBy.mockResolvedValue(users);

        await controller.findAll(req, res);

        expect(req.getQuery).toHaveBeenCalled();
        expect(repository.findAllBy).toHaveBeenCalledWith(query);
        expect(res.json).toHaveBeenCalledWith(users);
        expect(res.end).toHaveBeenCalled();
    });

    it("should create a new user", async () => {
        const newUser = { name: "John Doe" };
        const createdUser = { id: "123", ...newUser };
        req.getBody.mockResolvedValue(newUser);
        repository.create.mockResolvedValue(createdUser);

        await controller.create(req, res);

        expect(req.getBody).toHaveBeenCalled();
        expect(repository.create).toHaveBeenCalledWith(newUser);
        expect(res.json).toHaveBeenCalledWith(createdUser);
        expect(res.end).toHaveBeenCalled();
    });

    it("should update a user by id", async () => {
        const userId = "123";
        const updateData = { name: "Jane Doe" };
        const updatedUser = { id: userId, ...updateData };
        req.getParam.mockResolvedValue(userId);
        req.getBody.mockResolvedValue(updateData);
        repository.update.mockResolvedValue(updatedUser);

        await controller.update(req, res);

        expect(req.getParam).toHaveBeenCalledWith("id");
        expect(req.getBody).toHaveBeenCalled();
        expect(repository.update).toHaveBeenCalledWith(userId, updateData);
        expect(res.json).toHaveBeenCalledWith(updatedUser);
        expect(res.end).toHaveBeenCalled();
    });

    it("should delete a user by id", async () => {
        const userId = "123";
        req.getParam.mockResolvedValue(userId);

        await controller.delete(req, res);

        expect(req.getParam).toHaveBeenCalledWith("id");
        expect(repository.delete).toHaveBeenCalledWith(userId);
        expect(res.status).toHaveBeenCalledWith(204);
        expect(res.end).toHaveBeenCalled();
    });
});