import { NextResponse } from "next/server"
import { prisma } from "@bettrdash/db";

export const GET = async () => {
  const services = await prisma.service.findMany();
  console.log(services)
  return NextResponse.json('hi')
}