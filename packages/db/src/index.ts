import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

//for lucia
interface BasicPrismaModel {
  fields: any;
  findUnique: any;
  findMany: any;
}

export const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { PrismaClient };
export type { BasicPrismaModel };
export * from "@prisma/client";

// import "dotenv-safe/config";
// export * from "@prisma/client";

// import { PrismaClient } from "@prisma/client";

// let prisma: PrismaClient;

// declare global {
//   var __db: PrismaClient | undefined;
// }

// // this is needed because in development we don't want to restart
// // the server with every change, but we want to make sure we don't
// // create a new connection to the DB with every change either.
// if (process.env.NODE_ENV === "production") {
//   prisma = new PrismaClient({ log: ["error"] });
//   prisma.$connect();
// } else {
//   if (!global.__db) {
//     global.__db = new PrismaClient({ log: ["error", "warn"] });
//     global.__db.$connect();
//   }
//   prisma = global.__db;
// }

// export { prisma };
