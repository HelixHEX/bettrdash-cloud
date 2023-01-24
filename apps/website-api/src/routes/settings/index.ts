import express from "express";
import { prisma } from "db";
import { v1 } from "uuid";
import axios from "axios";

const router = express.Router();

//get api token
router.get("/key", async (req, res) => {
  try {
    const apiKey = await prisma.apikey.findUnique({
      where: { userId: req!.session!.user!.id },
    });
    if (apiKey) {
      res.status(200).json({ success: true, apiKey: apiKey.key });
    } else {
      res.status(200).json({ success: false, message: "No api key" });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

//create api token
router.post("/generate-key", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session!.user!.id },
      include: { api_key: true },
    });
    if (user && user.api_key) {
      await prisma.apikey.delete({ where: { id: user.api_key.id } });
    }

    const apiKey = await prisma.apikey.create({
      data: {
        key: v1(),
        user: {
          connect: {
            id: req.session!.user!.id,
          },
        },
      },
    });
    res.status(200).json({ success: true, apiKey: apiKey.key });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

//api key settings
router.get("/all", async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session!.user!.id },
      include: { api_key: true, subscription: true },
    });
    if (user) {
      const settings = {
        show_inactive_projects: user.show_inactive_projects,
        authorized_urls: new Array("user.api_key.authorized_urls", "fs"),
        subscription: user.subscription,
      };
      res.status(200).json({ success: true, settings });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

//update api key settings
router.post("/update", async (req, res) => {
  const { show_inactive_projects } = req.body.settings;
  console.log(show_inactive_projects);
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.session!.user!.id },
      include: { api_key: true },
    });
    if (user) {
      await prisma.user.update({
        where: { id: user.id },
        data: { show_inactive_projects: show_inactive_projects },
      });
      res.status(200).json({ success: true });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
});

router.get(
  "/update-payment-method-link",
  async (req: express.Request, res: express.Response) => {
    // res.send('hi')
    try {
      const subscription = await prisma.subscription.findUnique({
        where: { userId: req.session!.user!.id },
      });
      if (subscription && subscription.subscriptionId !== "override") {
        let response = await axios.get(
          `${process.env.LEMONSQUEEZY_API}/subscriptions/${subscription.subscriptionId}`,
          {
            headers: {
              Accept: " application/vnd.api+json",
              ContentType: "application/vnd.api+json",
              Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
            },
          }
        );
        if (response.status === 200) {
          if (response.data.data) {
            res.status(200).json({
              success: true,
              link: response.data.data.attributes.urls.update_payment_method,
            });
          }
        } else {
          console.log(response.data);
          res
            .status(500)
            .json({ success: false, message: "Unable to retrieve link" });
        }
      } else {
        res
          .status(200)
          .json({ success: false, message: "No subscription found" });
      }
    } catch (e) {
      console.log(e);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
);

router.post(
  "/cancel-subscription",
  async (req: express.Request, res: express.Response) => {
    try {
      const { id } = req.body;
      let subscription = await prisma.subscription.findUnique({
        where: { id },
        include: { user: true },
      });
      if (subscription) {
        if (subscription.userId === req!.session!.user!.id) {
          let response = await axios.patch(
            `${process.env.LEMONSQUEEZY_API}/subscriptions/${subscription.subscriptionId}`,
            {
              type: "subscriptions",
              id: subscription.subscriptionId,
              attributes: {
                cancelled: true,
              },
            },
            {
              headers: {
                accept: " application/vnd.api+json",
                contentType: "application/vnd.api+json",
                authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
              },
            }
          )
          if (response.status === 200) {
            res.status(200).json({ success: true });
          } else {
            console.log(response.data.data);
            res.status(500).json({
              success: true,
              message:
                "Unable to cancel subscription. Please reach out to the support team (e.wambugu192@gmail.com).",
            });
          }
        } else {
          res
            .status(503)
            .json({ success: false, message: "Unauthorized access" });
        }
      } else {
        res
          .status(404)
          .json({ success: false, message: "Subscrption not found" });
      }
    } catch (e) {
      console.log(e.response.data);
      res.status(500).json({ success: false, message: "Something went wrong" });
    }
  }
);

export default router;
