import { Router } from "express";
import github from "./github/index.js";
// import { lucia } from "../../utils/lucia.js";

const router = Router();

router.use("/login/github", github);

router.use("/session", (req, res) => {
  res.send(req.device.type);
});

// router.use(
//   "/login/check",
//   async (req: express.Request, res: express.Response) => {
//     const authorizationHeader = req.headers["Authorization"] as string;
//     const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
//     if (!sessionId) {
//       return res.json({ sucess: false, message: "Unauthorized" }).status(401);
//     }

//     const { session, user } = await lucia.validateSession(sessionId);
//   },
// );

export default router;
