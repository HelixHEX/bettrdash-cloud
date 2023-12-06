import type { VercelRequest, VercelResponse } from "@vercel/node";
import { prisma } from "@bettrdash/db";
import { isURL } from "./utils/url";
import axios from 'axios';

const handler = async (_request: VercelRequest, response: VercelResponse) => {
  let websites = await prisma.website.findMany();
  websites.forEach(async (website) => {
    if (isURL(website.url as string)) {
      let url = website.url;
      if (website.url.substring(0, 4) !== "http") {
        url = `https://${website.url}`;
        //PROD: postgresql://HelixHEX:PkZgcBQG6p5f@ep-patient-hall-78509768-pooler.us-west-2.aws.neon.tech/main_prod?sslmode=require

      }
      await axios
        .get(url)
        .then(async (res) => {
          if (res.status === 200) {
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
              await prisma.website.update({
                where: {
                  id: website.id,
                },
                data: {
                  status: "UP",
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
  return response.json({success: true, message: 'Checked websites'});
};

export default handler;