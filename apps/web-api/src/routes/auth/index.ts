import express from "express";
import bcrypt from "bcrypt";
import { prisma } from "@bettrdash/db";
import { lucia } from "../../utils/lucia/index.js";
import github from "./github/index.js";
const router = express.Router();

const saltRounds = 10;

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
        const session = await lucia.createSession(user.id as any, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        if (req.device.type === "desktop") {
          return res.status(200).json({ session: session.id });
        }
        return res
          .setHeader("Set-Cookie", sessionCookie.serialize())
          .redirect("/");
      } else {
        return res.status(401).json({ message: "Incorrect email/passwordsss" });
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

  req.user = user;
  req.currentSession = session;

  return res.json({ session, user });
});

// router.post("/login", async (req: express.Request, res: express.Response) => {
//   const { email, password } = req.body;
//   try {
//     if (!email || !password || email === "" || password === "") {
//       res
//         .status(200)
//         .json({ success: false, message: "Incorrect email or password" });
//     } else {
//       const user = await prisma.user.findUnique({
//         where: {
//           email,
//         },
//       });
//       if (!user) {
//         res
//           .status(200)
//           .json({ success: false, message: "Incorrect email or password" });
//       } else {
//         const match = await bcrypt.compare(password, user.password!);
//         if (match) {
//           let { password, createdAt, updatedAt, ...other } = user;
//           req.session.user = other;
//           res.status(200).json({ success: true });
//         } else {
//           res
//             .status(200)
//             .json({ success: false, message: "Incorrect email or password" });
//         }
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ success: false, message: "An error has occurred" });
//   }
// });
//

router.post("/signup", async (req: express.Request, res: express.Response) => {
  const { name, email, password } = req.body;
  try {
    if (
      !name ||
      !email ||
      !password ||
      name === "" ||
      email === "" ||
      password === ""
    ) {
      return res.status(401).json({ message: "Missing required fields" });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (user) {
      return res.status(401).json({ message: "Email in use" });
    }

    await bcrypt.hash(password, saltRounds).then(async (hash) => {
      const newUser = await prisma.user.create({
        data: { email, name, password: hash },
      });
      const session = await lucia.createSession(newUser.id as any, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      if (req.device.type === "desktop") {
        return res.json({ session: session.id });
      }
      return res
        .setHeader("Set-Cookie", sessionCookie.serialize())
        .redirect("/");
    });
  } catch (e) {
    console.log(e);
  }
});

router.post("/logout", async (req, res) => {
  const authorizationHeader = req.headers["authorization"];
  const sessionId = lucia.readBearerToken(authorizationHeader ?? "");
  console.log(sessionId);
  await lucia.invalidateSession(sessionId!);
  req.currentSession = null;
  req.user = null;
  if (req.device.type === "web") {
    return res
      .setHeader("Set-Cookie", lucia.createBlankSessionCookie().serialize())
      .redirect("/login");
  }
  return res.end();
});

// router.post("/signup", async (req: express.Request, res: express.Response) => {
//   const { name, email, password } = req.body;
//   try {
//     if (
//       !name ||
//       !email ||
//       !password ||
//       name === "" ||
//       email === "" ||
//       password === ""
//     ) {
//       res
//         .status(200)
//         .json({ success: false, message: "Missing required fields" });
//     } else {
//       const user = await prisma.user.findUnique({
//         where: {
//           email,
//         },
//       });
//       if (user) {
//         res.status(200).json({ success: false, message: "Email in use" });
//       } else {
//         await bcrypt.hash(password, saltRounds).then(async (hash) => {
//           const newUser = await prisma.user.create({
//             data: {
//               name,
//               email,
//               password: hash,
//             },
//           });
//           const { password, createdAt, updatedAt, ...other } = newUser;
//           /*
//           Needs testing to see if this works
//           // await prisma.apikey.create({
//           //   data: {
//           //     key: v1(),
//           //     user: {
//           //       connect: {
//           //         id: req.session!.user!.id,
//           //       },
//           //     },
//           //   },
//           // });
//           */
//           req.session.user = other;
//           res.status(200).json({ success: true });
//         });
//       }
//     }
//   } catch (e) {
//     console.log(e);
//     res.status(500).json({ success: false, message: "An error has occurred" });
//   }
// });

// router.post("/logout", (req: express.Request, res: express.Response) => {
//   try {
//     req.session!.destroy((err) => {
//       if (err) {
//         res.status(200).json({ success: false, message: "Unable to logout" });
//       } else {
//         res.json({ success: true });
//       }
//     });
//   } catch (e: any) {
//     console.log(e);
//     res.status(500).send({ success: false, message: e.message });
//   }
// });

//update user data
router.post(
  "/update-profile",
  async (req: express.Request, res: express.Response) => {
    const { name, email, currentPassword, newPassword, profile_img } = req.body;
    try {
      if (!name || !email || name === "" || email === "") {
        res
          .status(200)
          .json({ success: false, message: "Missing required fields" });
      } else {
        if (currentPassword && newPassword) {
          const user = await prisma.user.findUnique({
            where: { id: req.user.id },
          });
          if (user) {
            const match = await bcrypt.compare(currentPassword, user.password!);
            if (match) {
              await bcrypt.hash(newPassword, saltRounds).then(async (hash) => {
                const newUser = await prisma.user.update({
                  where: {
                    id: req.user.id,
                  },
                  data: {
                    name,
                    email,
                    profile_img,
                    password: hash,
                  },
                });
                const { password, createdAt, updatedAt, ...other } = newUser;
                req.session.user = other;
                res.status(200).json({ success: true });
              });
            } else {
              res
                .status(200)
                .json({ success: false, message: "Incorrect password" });
            }
          }
        } else {
          const newUser = await prisma.user.update({
            where: {
              id: req.user.id,
            },
            data: {
              name,
              email,
              profile_img,
            },
          });
          const { password, createdAt, updatedAt, ...other } = newUser;
          req.session.user = other;
          res.status(200).json({ success: true });
        }
      }
    } catch (e) {
      console.log(e);
      res
        .status(500)
        .json({ success: false, message: "An error has occurred" });
    }
  },
);

export default router;
