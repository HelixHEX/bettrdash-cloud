import "dotenv-safe/config.js";
import "reflect-metadata";
import express from "express";
import cors from "cors";
import { lucia } from "./utils/lucia/index.js";

// import {createClient} from 'redis'
// import Redis from "ioredis";

//routes
import auth from "./routes/auth/index.js";
import project from "./routes/project/index.js";
import apiAuth from "./routes/api/auth.js";
import monitor from "./routes/monitor/index.js";
import website from "./routes/website/index.js";
import analytics from "./routes/analytics/index.js";
import morgan from "morgan";
// import session from "express-session";
// import connectRedis from "connect-redis";

// const RedisStore = connectRedis(session);
// const redisClient = new Redis(process.env.REDIS_URL);

const main = async () => {
  const app = express();

  morgan.token("body", (req: express.Request) => JSON.stringify(req.body));
  app.use(
    morgan(
      ":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms",
    ),
  );
  console.log(process.env.NODE_ENV);
  app.use(
    cors({
      origin: [
        // process.env.NODE_ENV === "development"
        //   ? "http://localhost:3002"
        //   : false,
        "http://localhost:3000",
        "https://dev.bettrdash.com",
        "https://bettrdash.com",
      ],
      credentials: true,
    }),
  );

  app.use(express.json());

  app.use((req, _res, next) => {
    const userAgent = req.headers["user-agent"];
    console.log(userAgent);
    if (userAgent && userAgent.includes("Electron")) {
      console.log("yolo");
      req.device = { type: "desktop" };
    } else {
      console.log("yolo 2");
      req.device = {
        type: "web",
      };
    }
    next();
  });

  //redis
  // app.use(
  //   session({
  //     store: new RedisStore({ client: redisClient }),
  //     secret: process.env.SESSION_SECRET,
  //     resave: false,
  //     cookie: {
  //       secure: false,
  //       httpOnly: true,
  //       sameSite: "lax",
  //       // secure: process.env.NODE_ENV === 'production' ? true : false, // if true: only transmit cookie over https, in prod, always activate this
  //       // httpOnly: true, // if true: prevents client side JS from reading the cookie
  //       maxAge: 1000 * 60 * 60 * 24 * 30, // session max age in milliseconds (30 days)
  //       // explicitly set cookie to lax
  //       // to make sure that all cookies accept it
  //       // you should never use none anyway
  //     },
  //   }),
  // );

  // const authenticate = (
  //   req: express.Request,
  //   res: express.Response,
  //   next: express.NextFunction,
  // ) => {
  //   if (!req.session || !req.session.user) {
  //     req;
  //     res.status(200).json({ success: false, message: "Unauthorized" });
  //     return;
  //   }
  //   next();
  // };

  app.get("/", (_, res: express.Response) => {
    res.send("Hello world");
  });

  app.use("/auth", auth);

  app.use(async (req, res, next) => {
    const authorizationHeader = req.headers["authorization"];
    const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
    if (!sessionId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { session, user } = await lucia.validateSession(sessionId);
    if (!session && !user) {
      return res.status(401).send("Unauthorized");
    }

    req.user = user;
    req.currentSession = session;
    next();
  });
  // app.use(authenticate);
  app.use("/projects", project);
  app.use("/api-settings", apiAuth);
  app.use("/monitor", monitor);
  app.use("/website", website);
  app.use("/analytics", analytics);

  app.use((_, res: express.Response) => {
    res.status(404).json({ status: "404" });
  });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Web API ready at http://localhost:${process.env.PORT}`);
  });
};

main();
