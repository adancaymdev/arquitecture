import "reflect-metadata";

import { IServer } from "./application/interfaces/http/IServer";
import { dependency } from "./infrastructure/dependency-inyection/dependency";
import { UserServer } from "./presentation/server/UserServer";

const bootstrap = async () => {
  const server = dependency.resolve<IServer>(UserServer);
  await server.listen();
};

bootstrap();
