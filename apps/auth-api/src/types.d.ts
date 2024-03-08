import { lucia } from "@bettrdash/lucia";

declare global {
  namespace Express {
    export interface Request {
      device: {
        type?: "desktop" | "web";
      };
    }
  }
}

declare module "@bettrdash/lucia-local" {
  interface Register {
    Lucia: lucia;
    DatabaseUserAttributes: DatabaseUserAttributes;
  }
}

interface DatabaseUserAttributes {
  email: string;
  name: string;
}
