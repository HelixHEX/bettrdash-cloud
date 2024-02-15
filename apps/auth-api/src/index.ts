import "dotenv-safe/config.js";
import express, { Application, Request, Response } from "express";
import morgan from "morgan";

//routes
import auth from "./routes/auth/index.js";

const main = () => {
  const app = express();

  morgan.token("body", (req: express.Request) => JSON.stringify(req.body));
  app.use(
    morgan(
      ":date[iso] :remote-addr :method :url :status :res[content-length] - :response-time ms",
    ),
  );

  app.use(express.json());

  app.use("/auth", auth);
  // app.use((_, res: express.Response) => {
  //   res.status(404).json({ status: "404" });
  // });

  app.listen(process.env.PORT, () => {
    console.log(`🚀 Auth API is running on port ${process.env.PORT}!`);
  });
};

main();
