import { IUserRepository } from "@domain/interfaces/repositories/IUserRepository";
import { User } from "@domain/entities/User";

export class UserRepositorySQL implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    // Simulación de consulta SQL
    console.log(`SELECT * FROM users WHERE id = '${id}'`);
    return null;
  }

  async save(user: User): Promise<void> {
    // Simulación de inserción SQL
    console.log(`INSERT INTO users (id, name) VALUES ('${user.id}', '${user.name}')`);
  }
}