import "express-session";
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
}

declare global {
  namespace Express {
    export interface Request {
      user: any;
      currentSession: any;
      device: {
        type?: "desktop" | "web";
      };
    }
  }
}
