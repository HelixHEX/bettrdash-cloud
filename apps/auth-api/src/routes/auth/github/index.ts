import express, { type Request, type Response } from "express";
import { generateState, OAuth2RequestError } from "arctic";
import { github } from "../../../utils/oauth/github.js";
import { serializeCookie, parseCookies } from "oslo/cookie";
import axios from "axios";
import { prisma } from "@bettrdash/db";
import { lucia } from "../../../utils/lucia.js";

const router = express.Router();
const env = process.env.NODE_ENV;

router.get("/", async (_, res: Response) => {
  const state = generateState();
  const url = await github.createAuthorizationURL(state);
  // console.log(url.toString());
  return res
    .setHeader(
      "Set-Cookie",
      serializeCookie("github_oauth_state", state, {
        path: "/",
        secure: env === "production",
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: "lax",
      }),
    )
    .redirect(url.toString());
});

router.get("/callback", async (req: Request, res: Response) => {
  const code = req.query.code?.toString() ?? null;
  const state = req.query.state?.toString() ?? null;
  const storedState =
    parseCookies(req.headers.cookie ?? "").get("github_oauth_state") ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    res.status(400).end();
    return;
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserRes = await axios.get("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const githubEmailsRes = await axios.get(
      "https://api.github.com/user/emails",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );
    const githubUser = githubUserRes.data;
    const githubEmails = githubEmailsRes.data;

    const primaryEmail =
      githubEmails.find((email: any) => email.primary) ?? null;

    if (!primaryEmail) return res.send("No primary email").status(400);
    if (!primaryEmail.verified) return res.send("Unverified Email").status(400);
    const existingUser = await prisma.user.findUnique({
      where: { email: primaryEmail.email },
      include: { oauth_accounts: true },
    });

    if (existingUser) {
      const existingOauth = existingUser?.oauth_accounts.find(
        (oauthAccount) =>
          oauthAccount.provider_id === "github" &&
          oauthAccount.provider_user_id === githubUser.id.toString(),
      );
      let oauthAccount: any;
      if (!existingOauth) {
        oauthAccount = await prisma.oauth_account.create({
          data: {
            provider_id: "github",
            provider_user_id: githubUser.id.toString(),
            provider_username: githubUser.login,
            user: {
              connect: {
                id: existingUser.id,
              },
            },
          },
        });
        if (!oauthAccount) {
          res.send("An error has occurred").status(500);
        }
      }
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      console.log(sessionCookie);
      return res
        .setHeader("Set-Cookie", sessionCookie.serialize())
        .redirect("/");
    } else {
      const user = await prisma.user.create({
        data: {
          email: primaryEmail.email,
          name: githubUser.name,
          password: "",
          oauth_accounts: {
            create: {
              provider_id: "github",
              provider_user_id: githubUser.id.toString(),
              provider_username: githubUser.login,
            },
          },
        },
      });
      const session = await lucia.createSession(user.id.toString(), {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      return res
        .setHeader("Set-Cookie", sessionCookie.serialize())
        .redirect("/");
    }
  } catch (e) {
    console.log(e);
    if (
      e instanceof OAuth2RequestError &&
      e.message === "bad_verification_code"
    ) {
      // invalid code
      res.status(400).end();
      return;
    }

    res.status(500).end();
    return;
  }
});

export default router;
