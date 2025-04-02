import { UserServer } from "./presentation/server/UserServer";

const bootstrap = async () => {
  const server = new UserServer();
  await server.listen();
};

bootstrap();
