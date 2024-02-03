import { cronTrigger } from "@trigger.dev/sdk";
import { client } from "../utils/trigger";

import { prisma } from "@bettrdash/db";
// import { prisma } from "@bettrdash/db";
import axios from "axios";
import { isURL } from "../utils/url";
import { type AxiosResponse } from "axios";

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

        let websites = await prisma.website.findMany({
          include: { project: true },
        });
        if (websites.length > 0) {
          for (var i=0; i<websites.length; i++) {
            const website = websites[i]
            await io.logger.info(`Checking - ${website.url}`);
            if (isURL(website.url as string)) {
              let url = website.url;
              if (website.url.substring(0, 4) !== "http") {
                url = `https://${website.url}`;
              }
              await io.logger.info(`starting fetch for - ${url}`);
              const response = await io.backgroundFetch(
                `fetch-${url}-${new Date().toISOString()}`,
                `${url}?timestamp=${new Date().toISOString()}`,
                {
                  method: "GET",
                }
              );
              await io.logger.info(`${response}`);
            } else {
              await io.logger.info(`${website.url} is not a valid url`);
              await prisma.website.update({
                where: {
                  id: website.id,
                },
                data: {
                  status: "INVALID_URL",
                },
              });
              return {message: `${website.url} is not a valid url`}
            }
          };
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
