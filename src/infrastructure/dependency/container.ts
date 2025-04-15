import { IServerOptions } from "@domain/interfaces/http/IServerOptions";
import type { ILogger } from "@domain/interfaces/logger/ILogger";
import { SqliteAdapter } from "@infrastructure/persistence/sql/sqlite/AdapterSqlite";
import { UserCreateTableMigration } from "@infrastructure/persistence/sql/user/migrations/UserCreateTableMigration";
import { UserRepositorySQL } from "@infrastructure/persistence/sql/user/UserRepositorySQL";
import { UserController } from "@presentation/http/controllers/UserController";
import { UserServer } from "@presentation/http/UserServer";

interface MsOptions {
  pathDatabase?: string;
  port?: number;
  host?: string;
  path?: string;
  protocol?: string;
  logger?: ILogger;
}

export const userMs = async ({
  pathDatabase = "./database.user.db",
  port = 3000,
  host = "localhost",
  path = "api/users",
  protocol = "http",
  logger,
}: MsOptions) => {
  const userServerOptionsDefault: IServerOptions = {
    path,
    host,
    port,
    protocol,
  };
  const userDatabase = new SqliteAdapter(pathDatabase, "users", logger);

  const userMigration = new UserCreateTableMigration(logger);

  await userMigration.up(userDatabase);

  const userRepository = new UserRepositorySQL(userDatabase);
  const userController = new UserController(userRepository);

  const userServer = new UserServer(
    userServerOptionsDefault,
    [userController],
    logger
  );
  await userServer.listen();
};
