import { Lucia, PrismaAdapter } from "@bettrdash/lucia";
import {
  prisma,
  type PrismaClient,
  type BasicPrismaModel,
} from "@bettrdash/db";

const client: PrismaClient = prisma;

const env = process.env.NODE_ENV;

const session: BasicPrismaModel = client.session as any;
const user: BasicPrismaModel = client.user as any;
const adapter = new PrismaAdapter(session, user);

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    attributes: {
      secure: env === "production",
    },
  },
  getUserAttributes: (attributes: any) => {
    return {
      email: attributes.email,
      name: attributes.name,
    };
  },
});
