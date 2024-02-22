import { lucia } from "./src/utils/lucia";

declare global {
  namespace Express {
    export interface Request {
      device: {
        type?: "desktop" | "web";
      };
    }
  }
}

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
