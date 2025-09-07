import { NextResponse } from "next/server";
import { closeEndedAuctions } from "@/lib/closeAuctions";

export async function GET() {
  await closeEndedAuctions();
  return NextResponse.json({ success: true });
}
