import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

export const dynamic = "force-dynamic";

function maskUrl(url: string) {
  try {
    const u = new URL(url);
    return `${u.protocol}//${u.username}:****@${u.hostname}:${u.port}${u.pathname}${u.search}`;
  } catch {
    return "invalid";
  }
}

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || "not set";
  try {
    const client = new PrismaClient();
    await client.$connect();
    const result = await client.$queryRawUnsafe("SELECT 1 as ok");
    await client.$disconnect();
    return NextResponse.json({ status: "ok", result, dbUrl: maskUrl(dbUrl) });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        dbUrl: maskUrl(dbUrl),
        message: error instanceof Error ? error.message : String(error),
        name: error instanceof Error ? error.name : "Unknown",
      },
      { status: 500 }
    );
  }
}
