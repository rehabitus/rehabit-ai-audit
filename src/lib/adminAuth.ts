import { createHash } from "crypto";
import { NextRequest } from "next/server";

export function expectedAdminToken(): string | undefined {
    if (!process.env.ADMIN_PASSWORD) return undefined;
    return createHash("sha256").update(`admin-session:${process.env.ADMIN_PASSWORD}`).digest("hex");
}

export function isAdminAuthenticated(req: NextRequest): boolean {
    const token = req.cookies.get("admin_token")?.value;
    const expected = expectedAdminToken();
    return !!expected && !!token && token === expected;
}
