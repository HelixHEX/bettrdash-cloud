import "dotenv-safe/config";
import gateway from "fast-gateway";
import { prisma } from "@bettrdash/db";

const port = parseInt(process.env.PORT) || 3000;

const main = async () => {
  let services = await prisma.service.findMany();
  const server = gateway({
    routes: services.map((service: any) => {
      return {
        prefix: service.prefix,
        target: service.target,
      };
    }),
  });

  server.start(port).then(() => {
    console.log(`API Gateway is running on port ${port}`);
  });
};

main();
