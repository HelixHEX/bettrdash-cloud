import "dotenv-safe/config";
import "reflect-metadata";
import express from "express";
import cors from "cors";
// import {createClient} from 'redis'
import Redis from 'ioredis'

//routes
import auth from "./routes/auth";
import project from "./routes/project";
import apiAuth from "./routes/api/auth";
import monitor from "./routes/monitor";
import website from "./routes/website";
import analytics from "./routes/analytics";

const morgan = require("morgan");
const session = require("express-session");
const connectRedis = require("connect-redis");
const RedisStore = connectRedis(session);
// const redisUrl = process.env.REDIS_URL
const redisClient = new Redis(process.env.REDIS_URL)
// const redisClient = createClient({url: "redis://default:18e1c90720df461e8aa455c68cdad860@usw1-measured-unicorn-34414.upstash.io:34414"});

const main = async () => {
  const app = express();

  morgan.token("body", (req: express.Request) => JSON.stringify(req.body));
  app.use(
    morgan(
      ":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms"
    )
  );
  console.log(process.env.NODE_ENV)
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
    })
  );

  app.use(express.json());

  //redis
  app.use(
    session({
      store: new RedisStore({ client: redisClient }),
      secret: process.env.SESSION_SECRET,
      resave: false,
      cookie: {
        secure: false,
        httpOnly: true,
        sameSite: "lax",
        // secure: process.env.NODE_ENV === 'production' ? true : false, // if true: only transmit cookie over https, in prod, always activate this
        // httpOnly: true, // if true: prevents client side JS from reading the cookie
        maxAge: 1000 * 60 * 60 * 24 * 30, // session max age in milliseconds (30 days)
        // explicitly set cookie to lax
        // to make sure that all cookies accept it
        // you should never use none anyway
      },
    })
  );

  const authenticate = (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.session || !req.session.user) {
      req;
      res.status(200).json({ success: false, message: "Unauthorized" });
      return;
    }
    next();
  };

  app.get("/", (_, res: express.Response) => {
    res.send("Hello world");
  });

  app.use("/auth", auth);

  app.use(authenticate);
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
