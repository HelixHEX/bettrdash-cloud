import { NextRequest, NextResponse } from 'next/server';

import {prisma} from '@bettrdash/db'
import axios from 'axios';
import { isURL } from '../../../utils/url';

export const GET = async (req: any, res: any) => {
  if (req.headers.get('Authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).end('Unauthorized');
  }
  let websites = await prisma.website.findMany()
  websites.forEach(async website => {
    if (isURL(website.url as string)) {
      let url = website.url;
      if (website.url.substring(0, 4) !== "http") {
        url = `https://${website.url}`;
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
  })
  return NextResponse.json({success: true, message: 'Checked websites'});
}