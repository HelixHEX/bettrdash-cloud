import { prisma } from "@bettrdash/db";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (request: NextRequest) => {
  try {
    const body = await request.json();
    // const services = await prisma.service.findMany()
    const services = await prisma.service.findMany()
    return NextResponse.json({ test: "hi" });
    // return NextResponse.json({ services: await prisma.service.findMany() });
  } catch (e) {
    console.log(e);
    return NextResponse.json({ message: "an erorr has occurred" });
  }
};
