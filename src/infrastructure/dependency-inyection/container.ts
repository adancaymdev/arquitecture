import {UserServer} from "@infrastructure/http/UserServer";
import {UserController} from "@presentation/controllers/UserController";
import {LoggerConsole} from "@infrastructure/logger/LoggerConsole";
import {IServerOptions} from "@domain/interfaces/http/IServerOptions";
import {UserRepositorySQL} from "@infrastructure/persistence/sql/user/UserRepositorySQL";
import {SqliteAdapter} from "@infrastructure/persistence/sql/sqlite/AdapterSqlite";
import {UserCreateTableMigration} from "@infrastructure/persistence/sql/user/migrations/UserCreateTableMigration";


export const userMs = async (
    options?: IServerOptions,
    pathDatabase?: string
) => {

  const logger = new LoggerConsole();
  const pathDatabaseDefault = pathDatabase ?? './database.user.db';

  const userServerOptionsDefault: IServerOptions = options ?? {
    port: 3000,
    host: "localhost",
    path: "api",
    protocol: "http",
  }
  const userDatabase = new SqliteAdapter(pathDatabaseDefault, 'users', logger);

  const userMigration = new UserCreateTableMigration();

  await userMigration.up(userDatabase);

  const userRepository = new UserRepositorySQL(userDatabase)
  const userController = new UserController(userRepository);


   const userServer = new UserServer(
       userServerOptionsDefault,
       [userController],
       logger
   );

  await userServer.listen();
}

