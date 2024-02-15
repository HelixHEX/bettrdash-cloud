import { lucia } from "./src/utils/lucia";

declare module "lucia" {
  interface Register {
    Lucia: lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  name: string;
}
