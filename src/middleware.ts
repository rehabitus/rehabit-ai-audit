import { NextRequest, NextResponse } from "next/server";

async function expectedToken(): Promise<string | undefined> {
    if (!process.env.ADMIN_PASSWORD) return undefined;
    const encoder = new TextEncoder();
    const data = encoder.encode(`admin-session:${process.env.ADMIN_PASSWORD}`);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(hashBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
}

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
        const token = req.cookies.get("admin_token")?.value;
        const expected = await expectedToken();

        if (!expected || !token || token !== expected) {
            const loginUrl = new URL("/admin/login", req.url);
            loginUrl.searchParams.set("from", pathname);
            return NextResponse.redirect(loginUrl);
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/admin/:path*"],
};
