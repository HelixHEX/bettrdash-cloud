import "express-session";
import 'express'
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      name: string;
      email: string;
    };
  }
}