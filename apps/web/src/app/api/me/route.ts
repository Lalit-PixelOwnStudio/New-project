import { NextResponse } from "next/server";
import { currentUser } from "@/server/auth";
import { getEntitlements } from "@/server/entitlements";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = await currentUser();
  const entitlements = await getEntitlements(user?.id);
  return NextResponse.json(
    { ...entitlements, email: user?.email ?? null, name: user?.name ?? null },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}
