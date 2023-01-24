import express from "express";
import * as crypto from "crypto";
import { prisma } from "db";

const router = express.Router();

router.post(
  "/subscriptions",
  async (req: express.Request, res: express.Response) => {
    try {
      const secret = process.env.SIGNING_KEY;
      const hmac = crypto.createHmac("sha256", secret);
      const digest = Buffer.from(
        hmac.update(req.rawBody).digest("hex"),
        "utf8"
      );
      const signature = Buffer.from(req.get("X-Signature") || "", "utf8");

      if (crypto.timingSafeEqual(digest, signature)) {
        const { data } = req.body;
        switch (req.body.meta.event_name) {
          case "subscription_created":
            const user = await prisma.user.findUnique({
              where: { email: data.attributes.user_email },
              include: { subscription: true },
            });
            if (user && !user.subscription) {
              const subscription = await prisma.subscription.findUnique({
                where: { subscriptionId: data.id },
              });
              if (!subscription) {
                await prisma.subscription.create({
                  data: {
                    subscriptionId: data.id,
                    status: data.attributes.status,
                    plan: data.attributes.product_name,
                    user: { connect: { email: data.attributes.user_email } },
                    renews_at: new Date(data.attributes.renews_at),
                    ends_at: new Date(data.attributes.ends_at),
                  },
                });
              } else {
                console.log("Subscription already exists");
              }
            } else {
              console.log("User not found or user already has a subscription");
            }
            break;
          case "subscription_cancelled":
          case "subscription_resumed":
          case "subscription_paused":
          case "subscription_unpaused":
            const subscription = await prisma.subscription.findUnique({
              where: { subscriptionId: data.id },
            });
            if (subscription) {
              await prisma.subscription.update({
                where: { subscriptionId: subscription.subscriptionId },
                data: {
                  status: data.attributes.status,
                  ends_at: new Date(new Date(data.attributes.ends_at)),
                  renews_at: new Date(data.attributes.renews_at),
                  plan: data.attributes.product_name,
                },
              });
              console.log(req.body)
              console.log(typeof subscription.ends_at);
            } else {
              console.log("Subscription not found");
            }
            break;
          case "subscription_expired":
            const expiredSubscription = await prisma.subscription.findUnique({
              where: {
                subscriptionId: data.id,
              },
            });
            if (expiredSubscription) {
              await prisma.subscription.delete({
                where: { subscriptionId: expiredSubscription.subscriptionId },
              });
            } else {
              console.log("Subscription not found");
            }
            break;
          default:
            const billingSubscription = await prisma.subscription.findUnique({
              where: { subscriptionId: data.id },
            });
            if (billingSubscription) {
              await prisma.subscription.update({
                where: { subscriptionId: billingSubscription.subscriptionId },
                data: {
                  status: data.attributes.status,
                  ends_at: new Date(data.attributes.ends_at),
                  renews_at: new Date(data.attributes.renews_at),
                  plan: data.attributes.product_name,
                },
              });
            } else {
              console.log("billing error");
            }
            break;
        }
        // console.log(req.body);
        res.status(200).json({ success: true });
      } else {
        console.log("invalid signature");
        res.status(500).json({ success: false, message: "Invalid signature" });
      }
    } catch (e) {
      console.error(e);
      res.status(500).send("Something went wrong");
    }
  }
);

export default router;
