import { NextResponse } from "next/server";
import { getCurrentPricing } from "@/lib/pricing";

// Force dynamic so this always reads the current REVIEW_COUNT env var,
// not a stale build-time snapshot.
export const dynamic = "force-dynamic";

export async function GET() {
  const pricing = getCurrentPricing();
  return NextResponse.json(pricing);
}
