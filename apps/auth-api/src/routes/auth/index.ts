import { Router } from "express";
import github from "./github";
import { prisma } from "@bettrdash/db";
import bcrypt from "bcrypt";
import luciaPkg from "@bettrdash/auth";
const { lucia } = luciaPkg;

const router = Router();

router.use("/login/github", github);

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  req.device = {
    type: "desktop",
  };
  try {
    if (!email || !password || email === "" || password === "") {
      console.log("1");
      res.status(401).json({ message: "Incorrect email/password" });
    } else {
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (!user) {
        console.log("2");
        return res.status(401).json({ message: "Incorrect email/password" });
      }

      const validPass = await bcrypt.compare(password, user.password);

      if (validPass) {
        // let { password, ...other } = user;
        const session = await lucia.createSession(user.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        if (req.device.type === "desktop") {
          return res.json({ session: session.id });
        }
        return res
          .setHeader("Set-Cookie", sessionCookie.serialize())
          .redirect("/");
      } else {
        return res.status(401).json({ message: "Incorrect email/password" });
      }
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "An error has occurred" });
  }
});

router.get("/session", async (req, res) => {
  const authorizationHeader = req.headers["authorization"];
  const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
  if (!sessionId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { session, user } = await lucia.validateSession(sessionId);
  if (!session && !user) {
    return res.status(401).send("Unauthorized");
  }
  return res.json({ session, user });
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
