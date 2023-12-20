import { Job, cronTrigger } from "@trigger.dev/sdk";
import { client } from "../utils/trigger";

import { prisma } from "@bettrdash/db";
// import { prisma } from "@bettrdash/db";
import axios from "axios";
import { isURL } from "../utils/url";

client.defineJob({
  id: "check website status'",
  name: "Job to check if a website is down or running",
  version: "0.0.1",
  trigger: cronTrigger({
    cron: "*/5 * * * *",
  }),
  run: async (payload, io, ctx) => {
      await io.runTask("check-website-status", async () => {
      try {
        await io.logger.info("Received scheduled event", {
          payload,
        });

        // console.log(await pris)
        let websites = await prisma.website.findMany();
        if (websites.length > 0) {
          websites.forEach(async (website) => {
            if (isURL(website.url as string)) {
              let url = website.url;
              if (website.url.substring(0, 4) !== "http") {
                url = `https://${website.url}`;
              }
              await axios
                .get(url)
                .then(async (res) => {
                  console.log(`${website.url} - ${res.status}`)
                  if (res.status === 200) {
                    console.log(`${website.url} is running`);
                    if (website.status !== "UP") {
                      await prisma.website.update({
                        where: {
                          id: website.id,
                        },
                        data: {
                          status: "UP",
                        },
                      });
                    }
                  } else {
                    if (website.status !== "DOWN") {
                      console.log(`${website.url} is down`);
                      await prisma.website.update({
                        where: {
                          id: website.id,
                        },
                        data: {
                          status: "DOWN",
                        },
                      });
                    }
                  }
                })
                .catch(async (e) => {
                  await prisma.website.update({
                    where: {
                      id: website.id,
                    },
                    data: {
                      status: "INVALID URL",
                    },
                  });
                  console.log(`${website.url} --> ${e.message}`);
                  console.log("----DOWN----");
                  return;
                });
            } else {
              await prisma.website.update({
                where: {
                  id: website.id,
                },
                data: {
                  status: "INVALID_URL",
                },
              });
            }
          });
        }

        return { message: "Checked websites" };
      } catch (e) {
        return {
          message: "An error has occurred while trying to check for websites",
        };
      }
    });
  },
});
